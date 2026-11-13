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
  fetchedAt: string;
  apps: ArgoApp[];
  commits: ArgoCommit[];
};

const LIVE_TIMEOUT_MS = 3500;
const CACHE_MS = 15_000;

let cache: { at: number; value: ArgoStatus } | null = null;

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
          reject(new Error(`Argo CD responded ${res.statusCode}`));
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
    };
  }>;
};

function describeSource(sources: ArgoSource[]): string {
  // Skip "ref:" sources: they only provide Helm values files.
  const main = sources.find((source) => !source.ref) ?? sources[0];
  if (!main) return '';
  if (main.chart) return `${main.chart} ${main.targetRevision ?? ''}`.trim();
  return main.path ?? main.repoURL ?? '';
}

async function getLiveApps(): Promise<ArgoApp[]> {
  const baseUrl = process.env.ARGOCD_URL;
  const token = process.env.ARGOCD_TOKEN;
  if (!baseUrl || !token) throw new Error('ARGOCD_URL / ARGOCD_TOKEN not set');

  const data = await getJson<ArgoApplicationList>(
    `${baseUrl.replace(/\/$/, '')}/api/v1/applications`,
    token,
    process.env.ARGOCD_INSECURE_TLS === 'true'
  );

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

  try {
    apps = await getLiveApps();
  } catch {
    mode = 'snapshot';
    apps = await getSnapshotApps().catch(() => []);
  }

  const value: ArgoStatus = {
    mode,
    fetchedAt: new Date().toISOString(),
    apps: apps.sort((a, b) => a.name.localeCompare(b.name)),
    commits: await commitsPromise
  };
  cache = { at: Date.now(), value };
  return value;
}
