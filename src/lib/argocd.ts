import https from 'node:https';
import http from 'node:http';

import { siteConfig } from '@/config/site';

export type ArgoApp = {
  name: string;
  namespace: string;
  source: string;
  sync: string;
  health: string;
  revision?: string;
  reconciledAt?: string;
};

export type ArgoCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
};

export type ArgoStatus = {
  mode: 'live' | 'snapshot';
  /** Why live mode failed (no secrets), to debug the tunnel from the outside. */
  liveError?: string;
  fetchedAt: string;
  apps: ArgoApp[];
  commits: ArgoCommit[];
};

const LIVE_TIMEOUT_MS = 3500;
const CACHE_MS = 15_000;

let cache: { at: number; value: ArgoStatus } | null = null;

/** Per app: "Kind/namespace/name" -> sync status, from the last live app list. */
let syncByApp = new Map<string, Map<string, string>>();
const treeCache = new Map<string, { at: number; value: ArgoTree }>();

export type ArgoTreeNode = {
  id: string;
  kind: string;
  name: string;
  namespace?: string;
  health?: string;
  healthMessage?: string;
  sync?: string;
  /** ids of parent nodes; empty = direct child of the Application */
  parents: string[];
  status?: string;
  node?: string;
  containers?: string;
  restarts?: string;
  images?: string[];
  createdAt?: string;
};

export type ArgoTree = {
  app: string;
  health: string;
  sync: string;
  fetchedAt: string;
  nodes: ArgoTreeNode[];
};

/**
 * Minimal GET helper on node:https so a self-signed Argo CD cert can be
 * accepted for this one request (ARGOCD_INSECURE_TLS=true) without turning
 * off TLS verification for the whole process.
 */
function getJson<T>(url: string, token: string, insecure: boolean): Promise<T> {
  const target = new URL(url);
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

  return new Promise((resolve, reject) => {
    const onResponse = (res: http.IncomingMessage) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk: string) => (body += chunk));
      res.on('end', () => {
        if (!res.statusCode || res.statusCode >= 400) {
          reject(new Error(`Argo CD responded ${res.statusCode} from ${res.socket.remoteAddress ?? '?'} (server: ${res.headers.server ?? '?'})`));
          return;
        }
        try {
          resolve(JSON.parse(body) as T);
        } catch (error) {
          reject(error);
        }
      });
    };

    const req =
      target.protocol === 'http:'
        ? http.request(target, { method: 'GET', headers, timeout: LIVE_TIMEOUT_MS }, onResponse)
        : https.request(
            target,
            { method: 'GET', headers, timeout: LIVE_TIMEOUT_MS, rejectUnauthorized: !insecure },
            onResponse
          );
    req.on('timeout', () => req.destroy(new Error('Argo CD request timed out')));
    req.on('error', reject);
    req.end();
  });
}

type ArgoSource = { repoURL?: string; chart?: string; path?: string; targetRevision?: string; ref?: string };

type ArgoApplicationList = {
  items?: Array<{
    metadata: { name: string };
    spec: { source?: ArgoSource; sources?: ArgoSource[]; destination?: { namespace?: string } };
    status?: {
      sync?: { status?: string; revision?: string; revisions?: string[] };
      health?: { status?: string };
      reconciledAt?: string;
      resources?: Array<{ kind: string; name: string; namespace?: string; status?: string }>;
    };
  }>;
};

type ArgoResourceTreeResponse = {
  nodes?: Array<{
    kind: string;
    name: string;
    namespace?: string;
    uid: string;
    parentRefs?: Array<{ uid?: string }>;
    info?: Array<{ name: string; value: string }>;
    health?: { status?: string; message?: string };
    images?: string[];
    createdAt?: string;
  }>;
};

const resourceKey = (kind: string, namespace: string | undefined, name: string) => `${kind}/${namespace ?? ''}/${name}`;

function argoConfig() {
  const baseUrl = process.env.ARGOCD_URL;
  const token = process.env.ARGOCD_TOKEN;
  if (!baseUrl || !token) throw new Error('ARGOCD_URL / ARGOCD_TOKEN not set');
  return { baseUrl: baseUrl.replace(/\/$/, ''), token, insecure: process.env.ARGOCD_INSECURE_TLS === 'true' };
}

function describeSource(sources: ArgoSource[]): string {
  // Skip "ref:" sources: they only provide Helm values files.
  const main = sources.find((source) => !source.ref) ?? sources[0];
  if (!main) return '';
  if (main.chart) return `${main.chart} ${main.targetRevision ?? ''}`.trim();
  return main.path ?? main.repoURL ?? '';
}

async function getLiveApps(): Promise<ArgoApp[]> {
  const { baseUrl, token, insecure } = argoConfig();
  const data = await getJson<ArgoApplicationList>(`${baseUrl}/api/v1/applications`, token, insecure);

  const nextSync = new Map<string, Map<string, string>>();
  for (const item of data.items ?? []) {
    nextSync.set(
      item.metadata.name,
      new Map((item.status?.resources ?? []).map((r) => [resourceKey(r.kind, r.namespace, r.name), r.status ?? 'Unknown']))
    );
  }
  syncByApp = nextSync;

  return (data.items ?? []).map((item) => {
    const sources = item.spec.sources ?? (item.spec.source ? [item.spec.source] : []);
    const revision = item.status?.sync?.revision ?? item.status?.sync?.revisions?.find((rev) => /^[0-9a-f]{40}$/.test(rev));
    return {
      name: item.metadata.name,
      namespace: item.spec.destination?.namespace ?? '',
      source: describeSource(sources),
      sync: item.status?.sync?.status ?? 'Unknown',
      health: item.status?.health?.status ?? 'Unknown',
      revision: revision && /^[0-9a-f]{40}$/.test(revision) ? revision.slice(0, 7) : revision,
      reconciledAt: item.status?.reconciledAt
    };
  });
}

/** Fallback: read the Application manifests straight from the public GitOps repo. */
async function getSnapshotApps(): Promise<ArgoApp[]> {
  const { repo, branch } = siteConfig.homelab;
  const listing = await fetch(`https://api.github.com/repos/${repo}/contents/apps?ref=${branch}`, {
    headers: { Accept: 'application/vnd.github+json' },
    next: { revalidate: 600 }
  });
  if (!listing.ok) throw new Error(`GitHub responded ${listing.status}`);
  const files = (await listing.json()) as Array<{ name: string; download_url: string | null }>;

  const apps = await Promise.all(
    files
      .filter((file) => file.name.endsWith('.yaml') && file.download_url)
      .map(async (file) => {
        const res = await fetch(file.download_url as string, { next: { revalidate: 600 } });
        const yaml = res.ok ? await res.text() : '';
        const field = (key: string) => yaml.match(new RegExp(`^\\s*-?\\s*${key}:\\s*([^\\s#]+)`, 'm'))?.[1];
        const chart = field('chart');
        return {
          name: field('name') ?? file.name.replace(/\.yaml$/, ''),
          namespace: yaml.match(/destination:[\s\S]*?namespace:\s*(\S+)/)?.[1] ?? '',
          source: chart ? `${chart} ${field('targetRevision') ?? ''}`.trim() : field('path') ?? '',
          sync: 'Declared',
          health: 'Unknown'
        } satisfies ArgoApp;
      })
  );

  return apps.sort((a, b) => a.name.localeCompare(b.name));
}

async function getCommits(): Promise<ArgoCommit[]> {
  const { repo, branch } = siteConfig.homelab;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?sha=${branch}&per_page=5`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 600 }
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{
      sha: string;
      html_url: string;
      commit: { message: string; author?: { date?: string } };
    }>;
    return data.map((item) => ({
      sha: item.sha.slice(0, 7),
      message: item.commit.message.split('\n')[0],
      date: item.commit.author?.date ?? '',
      url: item.html_url
    }));
  } catch {
    return [];
  }
}

export async function getArgoStatus(): Promise<ArgoStatus> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;

  const commitsPromise = getCommits();
  let mode: ArgoStatus['mode'] = 'live';
  let apps: ArgoApp[];
  let liveError: string | undefined;

  try {
    apps = await getLiveApps();
  } catch (error) {
    mode = 'snapshot';
    liveError = error instanceof Error ? error.message.slice(0, 160) : 'unknown error';
    console.warn(`[argocd] live fetch failed: ${liveError}`);
    apps = await getSnapshotApps().catch(() => []);
  }

  const value: ArgoStatus = {
    mode,
    liveError,
    fetchedAt: new Date().toISOString(),
    apps: apps.sort((a, b) => a.name.localeCompare(b.name)),
    commits: await commitsPromise
  };
  cache = { at: Date.now(), value };
  return value;
}

const TREE_INFO_FIELDS: Record<string, keyof ArgoTreeNode> = {
  'Status Reason': 'status',
  Node: 'node',
  Containers: 'containers',
  'Restart Count': 'restarts'
};

/**
 * Live resource tree of one Application, reduced to what the graph needs:
 * kinds, names, health/sync and a few pod facts. No labels, specs or manifests.
 */
export async function getResourceTree(app: string): Promise<ArgoTree> {
  const cached = treeCache.get(app);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value;

  // Only names Argo CD itself reported may be requested.
  const status = await getArgoStatus();
  if (status.mode !== 'live') throw new Error('Argo CD is not reachable right now');
  const meta = status.apps.find((a) => a.name === app);
  if (!meta) throw new Error('Unknown application');

  const { baseUrl, token, insecure } = argoConfig();
  const data = await getJson<ArgoResourceTreeResponse>(
    `${baseUrl}/api/v1/applications/${encodeURIComponent(app)}/resource-tree`,
    token,
    insecure
  );

  const raw = data.nodes ?? [];
  const known = new Set(raw.map((n) => n.uid));
  const sync = syncByApp.get(app);

  const nodes: ArgoTreeNode[] = raw.map((n) => {
    const node: ArgoTreeNode = {
      id: n.uid,
      kind: n.kind,
      name: n.name,
      namespace: n.namespace,
      health: n.health?.status,
      healthMessage: n.health?.message?.slice(0, 200),
      sync: sync?.get(resourceKey(n.kind, n.namespace, n.name)),
      // Parents outside the tree (e.g. cluster-scoped owners) => treat as top level.
      parents: (n.parentRefs ?? []).map((ref) => ref.uid ?? '').filter((uid) => known.has(uid)),
      images: n.kind === 'Pod' ? n.images : undefined,
      createdAt: n.createdAt
    };
    for (const info of n.info ?? []) {
      const field = TREE_INFO_FIELDS[info.name];
      if (field) (node as Record<string, unknown>)[field] = info.value;
    }
    return node;
  });

  const value: ArgoTree = {
    app,
    health: meta.health,
    sync: meta.sync,
    fetchedAt: new Date().toISOString(),
    nodes
  };
  treeCache.set(app, { at: Date.now(), value });
  return value;
}
