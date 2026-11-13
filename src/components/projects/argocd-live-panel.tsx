'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GitCommitHorizontal, RefreshCw } from 'lucide-react';

import { useLanguage } from '@/components/language-provider';
import { ArgoCdResourceGraph, HealthIcon, SyncIcon } from '@/components/projects/argocd-resource-graph';
import type { ArgoStatus } from '@/lib/argocd';
import { cn } from '@/lib/utils';

const POLL_MS = 30_000;
const PREFERRED_DEFAULT_APP = 'loki';

export function ArgoCdLivePanel({ initial }: { initial: ArgoStatus | null }) {
  const { dictionary, locale } = useLanguage();
  const t = dictionary.projects.argo;
  const [status, setStatus] = useState<ArgoStatus | null>(initial);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/argocd', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setStatus((await res.json()) as ArgoStatus);
      setFailed(false);
      setRefreshKey((key) => key + 1);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initial) void refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [initial, refresh]);

  const isLive = status?.mode === 'live';
  const apps = useMemo(() => status?.apps ?? [], [status]);

  // Default to a small, readable app; keep the user's choice across refreshes.
  useEffect(() => {
    if (!apps.length) return;
    if (selectedApp && apps.some((app) => app.name === selectedApp)) return;
    setSelectedApp(apps.find((app) => app.name === PREFERRED_DEFAULT_APP)?.name ?? apps[0].name);
  }, [apps, selectedApp]);

  const timeFormat = new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', { timeStyle: 'medium' });
  const dateFormat = new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', { dateStyle: 'medium' });

  return (
    <div className="space-y-5 rounded-2xl border border-border/70 bg-background/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-lg font-semibold">{t.title}</h3>
          {status && (
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                isLive
                  ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'border-border/70 bg-muted/60 text-muted-foreground'
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', isLive ? 'animate-pulse bg-emerald-500' : 'bg-muted-foreground')} />
              {isLive ? t.live : t.snapshot}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {status && (
            <span>
              {t.updated}: {timeFormat.format(new Date(status.fetchedAt))}
            </span>
          )}
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 px-3 py-1.5 font-medium text-primary transition-colors hover:bg-accent/45 disabled:opacity-60"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
            {t.refresh}
          </button>
        </div>
      </div>

      {!isLive && status && <p className="text-sm text-muted-foreground">{t.snapshotNote}</p>}
      {failed && !status && <p className="text-sm text-rose-500">{t.error}</p>}
      {!status && !failed && <p className="text-sm text-muted-foreground">{t.loading}</p>}

      {apps.length > 0 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.app}>
          {apps.map((app) => {
            const active = isLive && app.name === selectedApp;
            return (
              <button
                key={app.name}
                type="button"
                role="tab"
                aria-selected={active}
                disabled={!isLive}
                onClick={() => setSelectedApp(app.name)}
                title={[app.source, app.namespace && `ns/${app.namespace}`, app.revision && `@${app.revision}`].filter(Boolean).join(' · ')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border/70 bg-background/75 text-muted-foreground enabled:hover:border-primary/40 enabled:hover:text-foreground',
                  !isLive && 'cursor-default'
                )}
              >
                <HealthIcon status={isLive ? app.health : undefined} className="h-3.5 w-3.5" />
                <SyncIcon status={isLive ? app.sync : undefined} className="h-3.5 w-3.5" />
                {app.name}
              </button>
            );
          })}
        </div>
      )}

      {status && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.graph}</h4>
            {isLive && <p className="text-xs text-muted-foreground">{t.graphHint}</p>}
          </div>
          {isLive && selectedApp ? (
            <ArgoCdResourceGraph app={selectedApp} refreshKey={refreshKey} />
          ) : (
            <p className="rounded-xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">{t.graphOffline}</p>
          )}
        </div>
      )}

      {status && status.commits.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.commits}</h4>
          <ul className="space-y-1.5">
            {status.commits.map((commit) => (
              <li key={commit.sha} className="flex items-start gap-2 text-sm">
                <GitCommitHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={commit.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 hover:text-primary">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{commit.sha}</span>
                  {commit.message}
                </a>
                {commit.date && (
                  <span className="shrink-0 text-xs text-muted-foreground">{dateFormat.format(new Date(commit.date))}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
