'use client';

import { useCallback, useEffect, useState } from 'react';
import { GitCommitHorizontal, RefreshCw } from 'lucide-react';

import { useLanguage } from '@/components/language-provider';
import type { ArgoStatus } from '@/lib/argocd';
import { cn } from '@/lib/utils';

const POLL_MS = 30_000;

const syncTone: Record<string, string> = {
  Synced: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  OutOfSync: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  Declared: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
};

const healthTone: Record<string, string> = {
  Healthy: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  Progressing: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
  Degraded: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
  Missing: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
  Suspended: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30'
};

const neutralTone = 'bg-muted/60 text-muted-foreground border-border/70';

function Pill({ value, tones }: { value: string; tones: Record<string, string> }) {
  return (
    <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium', tones[value] ?? neutralTone)}>
      {value}
    </span>
  );
}

export function ArgoCdLivePanel({ initial }: { initial: ArgoStatus | null }) {
  const { dictionary, locale } = useLanguage();
  const t = dictionary.projects.argo;
  const [status, setStatus] = useState<ArgoStatus | null>(initial);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/argocd', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setStatus((await res.json()) as ArgoStatus);
      setFailed(false);
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
                isLive ? syncTone.Synced : neutralTone
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

      {status && status.apps.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="py-2 pr-3 font-medium">{t.app}</th>
                <th className="py-2 pr-3 font-medium">{t.source}</th>
                <th className="py-2 pr-3 font-medium">{t.sync}</th>
                <th className="py-2 font-medium">{t.health}</th>
              </tr>
            </thead>
            <tbody>
              {status.apps.map((app) => (
                <tr key={app.name} className="border-b border-border/40 last:border-0">
                  <td className="py-2.5 pr-3">
                    <div className="font-medium">{app.name}</div>
                    {app.namespace && <div className="text-xs text-muted-foreground">ns/{app.namespace}</div>}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">
                    {app.source}
                    {app.revision && <span className="ml-1.5 opacity-70">@{app.revision}</span>}
                  </td>
                  <td className="py-2.5 pr-3">
                    <Pill value={app.sync} tones={syncTone} />
                  </td>
                  <td className="py-2.5">
                    <Pill value={app.health} tones={healthTone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
