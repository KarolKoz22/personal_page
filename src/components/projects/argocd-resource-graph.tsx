'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CircleArrowUp,
  CircleCheck,
  CircleHelp,
  CirclePause,
  Ghost,
  Heart,
  HeartCrack,
  LoaderCircle,
  X
} from 'lucide-react';

import { useLanguage } from '@/components/language-provider';
import type { ArgoTree, ArgoTreeNode } from '@/lib/argocd';
import { cn } from '@/lib/utils';

/* ---------- presentation helpers ---------- */

const KIND_ABBR: Record<string, string> = {
  Application: 'app',
  Deployment: 'deploy',
  StatefulSet: 'sts',
  DaemonSet: 'ds',
  ReplicaSet: 'rs',
  Pod: 'pod',
  Job: 'job',
  CronJob: 'cj',
  Service: 'svc',
  Endpoints: 'ep',
  EndpointSlice: 'eps',
  Ingress: 'ing',
  ConfigMap: 'cm',
  Secret: 'secret',
  SealedSecret: 'sealed',
  ServiceAccount: 'sa',
  Role: 'role',
  RoleBinding: 'rb',
  ClusterRole: 'crole',
  ClusterRoleBinding: 'crb',
  CustomResourceDefinition: 'crd',
  PersistentVolumeClaim: 'pvc',
  Namespace: 'ns',
  NetworkPolicy: 'netpol',
  ServiceMonitor: 'smon',
  PodMonitor: 'pmon',
  PrometheusRule: 'rule',
  Prometheus: 'prom',
  Alertmanager: 'am',
  ControllerRevision: 'rev',
  StorageClass: 'sc',
  MutatingWebhookConfiguration: 'hook',
  ValidatingWebhookConfiguration: 'hook'
};

// Workloads first, then networking, config, RBAC, cluster-level plumbing.
const KIND_ORDER = [
  'Application',
  'Deployment',
  'StatefulSet',
  'DaemonSet',
  'ReplicaSet',
  'Job',
  'CronJob',
  'Pod',
  'Prometheus',
  'Alertmanager',
  'Service',
  'Endpoints',
  'EndpointSlice',
  'Ingress',
  'PersistentVolumeClaim',
  'ConfigMap',
  'SealedSecret',
  'Secret',
  'ServiceMonitor',
  'PodMonitor',
  'PrometheusRule',
  'NetworkPolicy',
  'ServiceAccount',
  'Role',
  'RoleBinding',
  'ClusterRole',
  'ClusterRoleBinding',
  'ControllerRevision',
  'Namespace',
  'CustomResourceDefinition'
];

const kindRank = (kind: string) => {
  const index = KIND_ORDER.indexOf(kind);
  return index === -1 ? KIND_ORDER.length - 2 : index;
};

const abbr = (kind: string) => KIND_ABBR[kind] ?? (kind.replace(/[a-z]/g, '').toLowerCase().slice(0, 4) || kind.slice(0, 3).toLowerCase());

// Kind badge colour: workloads blue, network teal, config amber, RBAC/other slate.
function kindTone(kind: string) {
  if (['Application'].includes(kind)) return 'bg-orange-500/15 text-orange-600 dark:text-orange-400';
  if (['Deployment', 'StatefulSet', 'DaemonSet', 'ReplicaSet', 'Pod', 'Job', 'CronJob', 'Prometheus', 'Alertmanager'].includes(kind))
    return 'bg-sky-500/15 text-sky-600 dark:text-sky-400';
  if (['Service', 'Endpoints', 'EndpointSlice', 'Ingress', 'NetworkPolicy'].includes(kind))
    return 'bg-teal-500/15 text-teal-600 dark:text-teal-400';
  if (['ConfigMap', 'Secret', 'SealedSecret', 'PersistentVolumeClaim'].includes(kind))
    return 'bg-amber-500/15 text-amber-700 dark:text-amber-400';
  return 'bg-muted text-muted-foreground';
}

export function HealthIcon({ status, className }: { status?: string; className?: string }) {
  const base = cn('h-4 w-4 shrink-0', className);
  switch (status) {
    case 'Healthy':
      return <Heart className={cn(base, 'fill-emerald-500 text-emerald-500')} aria-label="Healthy" />;
    case 'Progressing':
      return <LoaderCircle className={cn(base, 'animate-spin text-sky-500')} aria-label="Progressing" />;
    case 'Degraded':
      return <HeartCrack className={cn(base, 'text-rose-500')} aria-label="Degraded" />;
    case 'Missing':
      return <Ghost className={cn(base, 'text-amber-500')} aria-label="Missing" />;
    case 'Suspended':
      return <CirclePause className={cn(base, 'text-zinc-500')} aria-label="Suspended" />;
    case undefined:
      return null;
    default:
      return <CircleHelp className={cn(base, 'text-muted-foreground')} aria-label={status} />;
  }
}

export function SyncIcon({ status, className }: { status?: string; className?: string }) {
  const base = cn('h-4 w-4 shrink-0', className);
  if (status === 'Synced') return <CircleCheck className={cn(base, 'text-emerald-500')} aria-label="Synced" />;
  if (status === 'OutOfSync') return <CircleArrowUp className={cn(base, 'text-amber-500')} aria-label="OutOfSync" />;
  return null;
}

/* ---------- tree model ---------- */

type GraphItem =
  | { type: 'node'; node: ArgoTreeNode; children: GraphItem[] }
  | { type: 'group'; id: string; kind: string; nodes: ArgoTreeNode[]; children: GraphItem[] };

const GROUP_THRESHOLD = 4;

function buildChildren(parentId: string | null, byParent: Map<string | null, ArgoTreeNode[]>, seen: Set<string>): GraphItem[] {
  const nodes = [...(byParent.get(parentId) ?? [])]
    .filter((n) => !seen.has(n.id))
    .sort((a, b) => kindRank(a.kind) - kindRank(b.kind) || a.name.localeCompare(b.name));
  nodes.forEach((n) => seen.add(n.id));

  const byKind = new Map<string, ArgoTreeNode[]>();
  for (const n of nodes) byKind.set(n.kind, [...(byKind.get(n.kind) ?? []), n]);

  const items: GraphItem[] = [];
  for (const [kind, list] of byKind) {
    const children = (n: ArgoTreeNode): GraphItem => ({ type: 'node', node: n, children: buildChildren(n.id, byParent, seen) });
    // Large same-kind sibling sets (and their subtrees) collapse into one group, like Argo CD.
    if (list.length >= GROUP_THRESHOLD) {
      items.push({ type: 'group', id: `${parentId ?? 'root'}:${kind}`, kind, nodes: list, children: list.map(children) });
    } else {
      items.push(...list.map(children));
    }
  }
  return items;
}

function buildGraph(tree: ArgoTree): GraphItem[] {
  const byParent = new Map<string | null, ArgoTreeNode[]>();
  for (const node of tree.nodes) {
    // A node with several owners is drawn once, under its first parent.
    const parent = node.parents[0] ?? null;
    byParent.set(parent, [...(byParent.get(parent) ?? []), node]);
  }
  return buildChildren(null, byParent, new Set());
}

function worstHealth(nodes: ArgoTreeNode[]) {
  const order = ['Degraded', 'Missing', 'Progressing', 'Suspended', 'Unknown', 'Healthy'];
  const present = nodes.map((n) => n.health).filter(Boolean) as string[];
  return order.find((status) => present.includes(status));
}

/* ---------- rendering ---------- */

function NodeCard({
  kind,
  title,
  subtitle,
  health,
  sync,
  selected,
  onClick,
  trailing,
  root
}: {
  kind: string;
  title: string;
  subtitle: string;
  health?: string;
  sync?: string;
  selected?: boolean;
  onClick?: () => void;
  trailing?: React.ReactNode;
  root?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-64 shrink-0 items-center gap-2.5 rounded-xl border bg-card px-2.5 py-2 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
        root ? 'border-orange-500/40' : 'border-border/70',
        selected && 'border-primary ring-2 ring-primary/30'
      )}
    >
      <span
        className={cn(
          'inline-flex h-9 w-12 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-semibold uppercase tracking-wide',
          kindTone(kind)
        )}
      >
        {abbr(kind)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 break-all text-[13px] font-medium leading-snug" title={title}>
          {title}
        </span>
        <span className="block truncate text-[11px] text-muted-foreground">{subtitle}</span>
      </span>
      <span className="flex items-center gap-1">
        <HealthIcon status={health} className="h-3.5 w-3.5" />
        <SyncIcon status={sync} className="h-3.5 w-3.5" />
        {trailing}
      </span>
    </button>
  );
}

function Children({
  items,
  expanded,
  toggle,
  selectedId,
  select
}: {
  items: GraphItem[];
  expanded: Set<string>;
  toggle: (id: string) => void;
  selectedId: string | null;
  select: (node: ArgoTreeNode) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="flex items-center">
      <span className="h-px w-5 shrink-0 bg-border" aria-hidden="true" />
      <div className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.type === 'node' ? item.node.id : item.id}
            className={cn(
              'relative flex items-center py-1 pl-5',
              // vertical spine (trimmed at first/last child) + horizontal tick into each child
              "before:absolute before:bottom-0 before:left-0 before:top-0 before:w-px before:bg-border before:content-['']",
              'first:before:top-1/2 last:before:bottom-1/2',
              "after:absolute after:left-0 after:top-1/2 after:h-px after:w-5 after:bg-border after:content-['']"
            )}
          >
            <Branch item={item} expanded={expanded} toggle={toggle} selectedId={selectedId} select={select} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Branch({
  item,
  expanded,
  toggle,
  selectedId,
  select
}: {
  item: GraphItem;
  expanded: Set<string>;
  toggle: (id: string) => void;
  selectedId: string | null;
  select: (node: ArgoTreeNode) => void;
}) {
  const { dictionary } = useLanguage();

  if (item.type === 'group') {
    const open = expanded.has(item.id);
    return (
      <div className="flex items-center">
        <NodeCard
          kind={item.kind}
          title={`${item.kind} ×${item.nodes.length}`}
          subtitle={`${item.nodes.length} ${dictionary.projects.argo.resources}`}
          health={worstHealth(item.nodes)}
          sync={item.nodes.some((n) => n.sync === 'OutOfSync') ? 'OutOfSync' : item.nodes.every((n) => n.sync === 'Synced') ? 'Synced' : undefined}
          onClick={() => toggle(item.id)}
          trailing={open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        />
        {open && <Children items={item.children} expanded={expanded} toggle={toggle} selectedId={selectedId} select={select} />}
      </div>
    );
  }

  const { node } = item;
  return (
    <div className="flex items-center">
      <NodeCard
        kind={node.kind}
        title={node.name}
        subtitle={node.kind === 'Pod' && node.status ? `${node.kind} · ${node.status}` : node.kind}
        health={node.health}
        sync={node.sync}
        selected={selectedId === node.id}
        onClick={() => select(node)}
      />
      <Children items={item.children} expanded={expanded} toggle={toggle} selectedId={selectedId} select={select} />
    </div>
  );
}

function Details({ node, onClose }: { node: ArgoTreeNode; onClose: () => void }) {
  const { dictionary, locale } = useLanguage();
  const t = dictionary.projects.argo.details;
  const rows: Array<[string, React.ReactNode]> = [
    [t.kind, node.kind],
    [t.namespace, node.namespace],
    [t.status, node.status],
    [t.node, node.node],
    [t.containers, node.containers],
    [t.restarts, node.restarts],
    [
      t.created,
      node.createdAt
        ? new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(
            new Date(node.createdAt)
          )
        : undefined
    ],
    [t.message, node.healthMessage]
  ];

  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 text-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <HealthIcon status={node.health} />
          <SyncIcon status={node.sync} />
          <span className="truncate font-medium">{node.name}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="min-w-0 break-words">{value}</dd>
            </div>
          ))}
        {node.health && (
          <div className="contents">
            <dt className="text-muted-foreground">Health / Sync</dt>
            <dd>
              {node.health}
              {node.sync ? ` / ${node.sync}` : ''}
            </dd>
          </div>
        )}
        {node.images?.length ? (
          <div className="contents">
            <dt className="text-muted-foreground">{t.images}</dt>
            <dd className="min-w-0 space-y-0.5 font-mono text-xs">
              {node.images.map((image) => (
                <div key={image} className="break-all">
                  {image}
                </div>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

export function ArgoCdResourceGraph({ app, refreshKey }: { app: string; refreshKey: number }) {
  const { dictionary } = useLanguage();
  const t = dictionary.projects.argo;
  const [tree, setTree] = useState<ArgoTree | null>(null);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<ArgoTreeNode | null>(null);

  // New app => reset view state.
  useEffect(() => {
    setTree(null);
    setSelected(null);
    setExpanded(new Set());
  }, [app]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/argocd/tree?app=${encodeURIComponent(app)}`, { cache: 'no-store' })
      .then((res) => (res.ok ? (res.json() as Promise<ArgoTree>) : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (cancelled) return;
        setTree(data);
        setFailed(false);
        // Keep the details panel in sync with fresh data.
        setSelected((current) => (current ? data.nodes.find((n) => n.id === current.id) ?? null : null));
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [app, refreshKey]);

  const items = useMemo(() => (tree ? buildGraph(tree) : []), [tree]);
  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (failed && !tree) return <p className="text-sm text-rose-500">{t.graphError}</p>;
  if (!tree)
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        {t.loading}
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="overflow-auto rounded-xl border border-border/60 bg-[radial-gradient(circle,hsl(var(--border))_1px,transparent_1px)] [background-size:18px_18px] p-4 max-h-[560px]">
        <div className="flex w-max items-center">
          <NodeCard
            root
            kind="Application"
            title={tree.app}
            subtitle={`${tree.nodes.length} ${t.resources}`}
            health={tree.health}
            sync={tree.sync}
          />
          <Children items={items} expanded={expanded} toggle={toggle} selectedId={selected?.id ?? null} select={setSelected} />
        </div>
      </div>
      {selected && <Details node={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
