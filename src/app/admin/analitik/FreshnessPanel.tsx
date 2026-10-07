'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, Clock } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import type { FreshnessHistoryItem, FreshnessReport, FreshnessStatus } from '@/lib/contentFreshness';

const STATUS: Record<FreshnessStatus, { label: string; cls: string }> = {
  ok: { label: 'Güncel', cls: 'border-lime/50 bg-lime/10 text-lime' },
  refreshed: { label: 'Yenilendi', cls: 'border-solar/50 bg-solar/10 text-solar' },
  stale: { label: 'Eski', cls: 'border-rose/50 bg-rose/10 text-rose' },
  error: { label: 'Hata', cls: 'border-rose/50 bg-rose/10 text-rose' },
};

const fmt = (iso: string) => new Date(iso).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

type FreshnessResult = { report: FreshnessReport; history: FreshnessHistoryItem[] | null } | { error: string };

async function requestFreshness(): Promise<FreshnessResult> {
  try {
    const res = await fetch('/api/analytics/tazelik', { cache: 'no-store', credentials: 'include' });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return (await res.json()) as { report: FreshnessReport; history: FreshnessHistoryItem[] | null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Denetim başarısız' };
  }
}

/** Her gün değişmesi gereken sayfaların (günlük burç, Ay bugün) canlıda güncel olup olmadığını denetler. */
export function FreshnessPanel() {
  const [report, setReport] = useState<FreshnessReport | null>(null);
  const [history, setHistory] = useState<FreshnessHistoryItem[] | null>(null);
  // Panel açılır açılmaz denetim başlar
  const [running, setRunning] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const apply = useCallback((result: FreshnessResult) => {
    if ('error' in result) setError(result.error);
    else {
      setReport(result.report);
      setHistory(result.history);
      setError('');
    }
    setRunning(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const result = await requestFreshness();
      if (!ignore) apply(result);
    })();
    return () => {
      ignore = true;
    };
  }, [apply]);

  const rerun = async () => {
    setRunning(true);
    apply(await requestFreshness());
  };

  const failed = report?.checks.filter((c) => c.status === 'stale' || c.status === 'error').length ?? 0;

  return (
    <div className="relative ticks border border-line bg-ink-2 p-6 space-y-4">
      <Ticks />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-lime" size={16} />
          <h3 className="text-base font-bold text-paper font-mono uppercase tracking-wider">Günlük içerik denetimi</h3>
        </div>
        <div className="flex items-center gap-2">
          {report && (
            <span className={`px-2 py-1 text-[10px] font-mono font-bold border uppercase tracking-wider ${report.ok ? STATUS.ok.cls : STATUS.stale.cls}`}>
              {report.ok ? '✓ Tümü güncel' : `${failed} sayfa güncel değil`}
            </span>
          )}
          <button
            type="button"
            onClick={rerun}
            disabled={running}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-line bg-ink text-paper hover:border-lime hover:text-lime font-mono text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={12} className={running ? 'animate-spin' : ''} />
            <span>{running ? 'Denetleniyor…' : 'Şimdi denetle'}</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-muted">
        Günlük burç (12 sayfa), Ay bugün ve ISS geçişleri sayfaları canlı siteden çekilir; bugünün içeriği yayında mı diye bakılır. Eski sürüm bulunursa denetim
        yenilemeyi tetikler ve sayfayı yeniden kontrol eder.
        {report && <> Son denetim: <span className="text-paper">{fmt(report.checkedAt)}</span>.</>}
      </p>

      {error && (
        <div className="p-3 border border-rose/40 bg-rose/10 text-xs font-mono text-rose flex items-center gap-2">
          <AlertCircle size={14} /> Denetim çalıştırılamadı: {error}
        </div>
      )}

      {!report && running && <div className="py-6 text-center text-xs font-mono text-muted">Sayfalar kontrol ediliyor…</div>}

      {/* Her şey güncelken liste kapalı; sorun varsa kendiliğinden açık */}
      {report && report.ok && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="text-[11px] font-mono text-muted hover:text-paper underline underline-offset-4 cursor-pointer">
          {expanded ? 'Ayrıntıları gizle' : `${report.checks.length} sayfanın ayrıntısını göster`}
        </button>
      )}

      {report && (!report.ok || expanded) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 font-mono text-xs">
          {report.checks.map((c) => (
            <div key={c.path} className="flex items-start justify-between gap-3 p-3 bg-ink border border-line">
              <div className="min-w-0 space-y-1">
                <a href={c.path} target="_blank" rel="noreferrer" className="text-paper font-bold hover:text-lime">
                  {c.label}
                </a>
                <div className="text-[11px] text-muted">{c.note}</div>
                {c.generatedAt && <div className="text-[10px] text-muted/70">Üretildi: {fmt(c.generatedAt)}</div>}
              </div>
              <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${STATUS[c.status].cls}`}>
                {STATUS[c.status].label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted uppercase tracking-wider">
          <Clock size={12} /> Denetim geçmişi
        </div>
        {history === null ? (
          <p className="text-[11px] text-muted">Geçmiş için Redis/KV bağlantısı gerekiyor; bağlı değilken yalnızca anlık denetim görünür.</p>
        ) : history.length === 0 ? (
          <p className="text-[11px] text-muted">Henüz kayıtlı denetim yok.</p>
        ) : (
          <div className="max-h-56 overflow-y-auto space-y-1 font-mono text-[11px] pr-2">
            {history.map((h) => (
              <div key={h.checkedAt + h.source} className="flex items-center justify-between gap-3 px-3 py-2 bg-ink border border-line">
                <span className="flex items-center gap-2">
                  {h.ok ? <CheckCircle2 size={12} className="text-lime" /> : <AlertCircle size={12} className="text-rose" />}
                  <span className="text-paper">{fmt(h.checkedAt)}</span>
                  <span className="text-muted">{h.source === 'cron' ? 'otomatik' : 'panel'}</span>
                </span>
                <span className={h.ok ? 'text-lime' : 'text-rose truncate'}>{h.ok ? `${h.total}/${h.total} güncel` : h.failed.join(', ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
