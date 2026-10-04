'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Eye,
  EyeOff,
  Compass,
  Clock,
  Globe2,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  BarChart3,
  TrendingUp,
  MapPin,
  ExternalLink,
  Lock,
  Key,
  LogOut,
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { AnalyticsStatsResponse } from '@/types/analytics';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Ticks } from '@/components/motion/primitives';
import { useNow } from '@/lib/useNow';

async function requestStats(demo: boolean): Promise<{ data: AnalyticsStatsResponse | null; unauthorized?: boolean }> {
  try {
    const res = await fetch(`/api/analytics/stats?demo=${demo}`, {
      cache: 'no-store',
      credentials: 'include'
    });
    if (res.status === 401) {
      return { data: null, unauthorized: true };
    }
    return { data: res.ok ? ((await res.json()) as AnalyticsStatsResponse) : null };
  } catch (err) {
    console.error('Failed to fetch analytics stats:', err);
    return { data: null };
  }
}

function clearStoredKey() {
  try {
    localStorage.removeItem('admin_telemetry_key');
    sessionStorage.removeItem('admin_telemetry_key');
  } catch {
    // storage may be unavailable (private mode); nothing to clear
  }
}

export default function AdminAnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [keyInput, setKeyInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);

  const [stats, setStats] = useState<AnalyticsStatsResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState<number>(5);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const now = useNow(1000);
  // Report state for custom time range
  const [report, setReport] = useState<any>(null);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);

  // Check initial authentication
  useEffect(() => {
    let ignore = false;
    const checkInitialAuth = async () => {
      // Earlier builds kept the raw key in web storage; purge it.
      clearStoredKey();

      // The signed, httpOnly session cookie is the only source of truth
      try {
        const res = await fetch('/api/analytics/auth', { credentials: 'include', cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (!ignore) setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        if (!ignore) setIsAuthenticated(false);
      } finally {
        if (!ignore) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkInitialAuth();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    setIsSubmittingAuth(true);
    setAuthError('');

    try {
      const res = await fetch('/api/analytics/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyInput.trim(), remember: rememberMe }),
        credentials: 'include'
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setIsAuthenticated(true);
        setKeyInput('');
      } else {
        setAuthError(data?.error || 'Yetki anahtarı geçersiz. Erişim engellendi.');
      }
    } catch {
      setAuthError('Sunucu ile iletişim kurulamadı.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/analytics/auth', { method: 'DELETE', credentials: 'include' });
    } catch {
      // ignore
    }
    clearStoredKey();
    setIsAuthenticated(false);
    setStats(null);
  };

  const applyStats = useCallback((result: { data: AnalyticsStatsResponse | null; unauthorized?: boolean }) => {
    if (result.unauthorized) {
      handleLogout();
      return;
    }
    if (result.data) {
      setStats(result.data);
      setLastUpdated(new Date().toLocaleTimeString('tr-TR'));
    }
    setIsRefreshing(false);
  }, []);

  // Manual / scheduled refresh
  const refresh = useCallback(() => {
    if (!isAuthenticated) return;
    setIsRefreshing(true);
    requestStats(isDemoMode).then(applyStats);
  }, [isDemoMode, isAuthenticated, applyStats]);

  // Fetch custom report from 22:00 onward
  const fetchReport = useCallback(async () => {
    setIsLoadingReport(true);
    try {
      const res = await fetch(`/api/analytics/report?from=2026-10-03T19:00:00Z&demo=${isDemoMode}`, {
        cache: 'no-store',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      } else {
        console.error('Failed to fetch report', res.status);
      }
    } catch (e) {
      console.error('Error fetching report', e);
    } finally {
      setIsLoadingReport(false);
    }
  }, [isDemoMode]);

  // Load on mount & source toggle
  useEffect(() => {
    if (!isAuthenticated) return;
    let ignore = false;
    requestStats(isDemoMode).then((result) => {
      if (!ignore) applyStats(result);
    });
    fetchReport();
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isDemoMode, applyStats, fetchReport]);

  // Periodic Auto-refresh
  useEffect(() => {
    if (!isAuthenticated || autoRefreshSecs <= 0) return;
    const interval = setInterval(refresh, autoRefreshSecs * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefreshSecs, refresh]);

  const deviceIcons = {
    Mobil: <Smartphone size={14} className="text-solar" />,
    Masaüstü: <Monitor size={14} className="text-primary" />,
    Tablet: <Tablet size={14} className="text-violet" />
  };

  // 1. Initial Auth Check Screen
  if (isCheckingAuth) {
    return (
      <div className="module relative min-h-screen px-[var(--gutter)] flex items-center justify-center text-paper">
        <div className="flex items-center gap-3 font-mono text-xs text-muted">
          <RefreshCw size={15} className="animate-spin text-solar" />
          <span>Güvenlik yetkisi denetleniyor...</span>
        </div>
      </div>
    );
  }

  // 2. Secret Locked Gate (Shown if unauthorized)
  if (!isAuthenticated) {
    return (
      <div className="module relative min-h-screen px-[var(--gutter)] pb-28 pt-28 flex items-center justify-center text-paper sm:pt-32">
        <div className="relative ticks w-full max-w-md border border-line bg-ink-2 p-6 sm:p-8 space-y-6">
          <Ticks />

          {/* Header Status Bar */}
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-solar" />
              <span className="font-mono text-[10px] text-solar font-bold uppercase tracking-widest">
                KORUMALI SİSTEM · YÖNETİCİ ERİŞİMİ
              </span>
            </div>
            <span className="h-2 w-2 bg-solar animate-ping" />
          </div>

          <div>
            <h2 className="display display-tight text-2xl text-paper sm:text-3xl">
              Kozmik Görev <span className="serif-i text-solar">Kontrolü</span>
            </h2>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              Ziyaretçi trafiği, anlık kullanıcılar ve sistem telemetrisi yalnızca site sahibine özeldir.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-key" className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                Yönetici Erişim Anahtarı (Master Key)
              </label>
              <div className="relative flex items-center">
                <input
                  id="admin-key"
                  name="admin-key"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Erişim anahtarınızı girin..."
                  required
                  autoFocus
                  className="w-full border border-line bg-ink px-3.5 py-2.5 pr-10 font-mono text-xs text-paper placeholder:text-muted/50 focus:border-solar focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted hover:text-paper transition-colors cursor-pointer"
                  title={showPassword ? 'Gizle' : 'Göster'}
                  aria-label={showPassword ? 'Anahtarı gizle' : 'Anahtarı göster'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <label className="flex items-center gap-2 text-muted cursor-pointer select-none hover:text-paper">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-solar cursor-pointer"
                />
                <span className="text-[11px]">Bu cihazda 30 gün hatırla</span>
              </label>
            </div>

            {authError && (
              <div role="alert" className="border border-rose/40 bg-rose/10 p-2.5 text-xs font-mono text-rose flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth || !keyInput.trim()}
              className="w-full border border-solar bg-solar text-ink py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-solar/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmittingAuth ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Doğrulanıyor...</span>
                </>
              ) : (
                <>
                  <Key size={13} />
                  <span>Telemetri Kilidini Aç</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-line flex items-center justify-between text-[11px] font-mono text-muted">
            <Link href="/" className="hover:text-paper transition-colors">
              ← Ana Sayfaya Dön
            </Link>
            <span className="text-[10px] text-muted/60">
              SPACETOUR TR · GÜVENLİ TELEMETRİ
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Telemetry Dashboard
  return (
    <div className="module relative space-y-8 px-[var(--gutter)] pb-28 pt-28 text-paper sm:pt-32" style={{ '--page-accent': 'var(--lime)' } as React.CSSProperties}>
      {/* Mission control title card */}
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="label text-lime">(06)</span>
            <span className="label text-paper">Yönetici telemetrisi</span>
            <span className="live-dot ml-1" />
          </div>
          <SplitReveal as="h1" trigger="intro" effect="tilt" className="display text-[clamp(2.8rem,8vw,8rem)] text-paper">
            Görev <span className="serif-i text-lime">kontrol</span>
          </SplitReveal>
          <p className="mt-4 max-w-xl text-sm text-paper/60">
            spacetour.com.tr üzerindeki anlık ziyaretçiler, sayfa görüntülemeleri, coğrafi dağılım ve cihaz verileri.
          </p>
        </div>

        {/* Live Controls & Logout Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Demo vs Real Toggle */}
          <div className="flex items-center gap-1 bg-ink border border-line p-1 text-xs font-mono">
            <button
              onClick={() => setIsDemoMode(false)}
              aria-pressed={!isDemoMode}
              className={`px-3 py-1.5 font-bold transition-colors cursor-pointer flex items-center gap-1.5 border uppercase tracking-wider ${
                !isDemoMode
                  ? 'border-lime bg-lime text-ink'
                  : 'border-transparent text-muted hover:text-paper'
              }`}
            >
              <span className={`h-2 w-2 ${!isDemoMode ? 'bg-ink' : 'bg-lime'}`} />
              <span>%100 Gerçek Canlı Veri</span>
            </button>

            <button
              onClick={() => setIsDemoMode(true)}
              aria-pressed={isDemoMode}
              className={`px-3 py-1.5 font-bold transition-colors cursor-pointer flex items-center gap-1.5 border uppercase tracking-wider ${
                isDemoMode
                ? 'border-violet bg-violet text-ink font-bold'
                : 'border-transparent text-muted hover:text-paper'
            }`}
          >
            <span>Örnek Simülasyon</span>
          </button>
        </div>

        <div className="flex items-center gap-2 bg-ink border border-line p-1.5 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2">
            <span className="h-2 w-2 bg-lime animate-ping" />
            <span className="text-muted text-[11px] uppercase">Güncelleme:</span>
            <span className="text-paper font-bold">{lastUpdated || 'Yükleniyor...'}</span>
          </div>

          <div className="flex items-center gap-1 border-l border-line pl-2">
            {[
              { label: '5sn', val: 5 },
              { label: '15sn', val: 15 },
              { label: 'Durdur', val: 0 }
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setAutoRefreshSecs(opt.val)}
                className={`px-2 py-1 text-[10px] font-bold transition-colors cursor-pointer border ${
                  autoRefreshSecs === opt.val
                    ? 'border-lime bg-lime text-ink'
                    : 'border-transparent text-muted hover:text-paper'
                }`}
              >
                {opt.label}
              </button>
            ))}

            <button
              onClick={refresh}
              disabled={isRefreshing}
              aria-label="Şimdi yenile"
              className="p-1 border border-line text-muted hover:text-paper hover:border-paper transition-colors ml-1 cursor-pointer"
              title="Şimdi Yenile"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-solar' : ''} />
            </button>
            <button
              onClick={fetchReport}
              disabled={isLoadingReport}
              aria-label="03.10 22:00+ Raporu"
              className="flex items-center gap-1.5 px-2.5 py-1 border border-solar/60 bg-solar/15 text-solar hover:bg-solar hover:text-ink font-mono text-[11px] font-bold transition-all ml-2 cursor-pointer shadow-[0_0_10px_rgba(255,91,34,0.15)]"
              title="03.10.2026 22:00 İtibarıyla Özel Rapor"
            >
              <FileText size={12} className={isLoadingReport ? 'animate-pulse' : ''} />
              <span>{isLoadingReport ? 'Hesaplanıyor...' : '22:00+ Raporu'}</span>
            </button>
          </div>
        </div>

        {/* Secure Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 border border-line bg-ink px-3 py-1.5 font-mono text-xs text-muted hover:border-rose/50 hover:text-rose transition-colors cursor-pointer uppercase tracking-wider"
          title="Güvenli Çıkış Yap"
        >
          <LogOut size={13} />
          <span>Çıkış</span>
        </button>
      </div>
    </div>

    {/* Active Mode & Storage Status Notice Banner */}
    <div
      className={`p-4 border text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        !isDemoMode
          ? 'border-lime/30 bg-lime/10 text-lime'
          : 'border-violet/30 bg-violet/10 text-violet'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-current shrink-0" />
          <span>
            {!isDemoMode
              ? 'CANLI GERÇEK MOD AKTİF: Yalnızca siteye giren GERÇEK ziyaretçi ve IP telemetrisi görüntüleniyor.'
              : 'SİMÜLASYON MODU AKTİF: Grafikleri ve rapor yapısını incelemek için örnek test verileri görüntüleniyor.'}
          </span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider shrink-0 ${
          stats?.isGoogleAnalytics || stats?.isPersistent
            ? 'border-lime/50 bg-lime/20 text-lime'
            : 'border-solar/40 bg-solar/10 text-solar'
        }`}>
          {stats?.isGoogleAnalytics
            ? '✓ GOOGLE ANALYTICS BAĞLI'
            : stats?.isPersistent
            ? '✓ KALICI REDIS/KV BAĞLI'
            : '⚡ SERVERLESS CANLI AKIŞ'}
        </span>
      </div>
      {!isDemoMode && (
        <div className="text-paper/75 text-[11px] flex items-center gap-1.5">
          <span className="text-solar font-bold border border-solar/40 px-1 py-0.2 text-[9px] shrink-0">BİLGİ</span>
          <em>Telefonunuzdan siteye girdiğiniz an canlı akışta anında belireceksiniz!</em>
        </div>
      )}
    </div>

      {/* 4 Big Real-Time KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Visitors Now */}
        <div className="relative ticks border border-lime/30 bg-ink-2 p-6">
          <Ticks />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-lime font-bold uppercase tracking-wider">
              ŞU AN CANLI (ONLINE)
            </span>
            <span className="h-2 w-2 bg-lime animate-ping" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold text-paper font-mono">
              {stats ? stats.activeVisitorsNow : '—'}
            </span>
            <span className="text-xs font-mono text-lime font-bold">Kişi Sitede</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Son 3 dakika içinde sayfalar arasında gezinen aktif ziyaretçiler.
          </p>
        </div>

        {/* KPI 2: Total Pageviews */}
        <div className="relative ticks border border-solar/30 bg-ink-2 p-6">
          <Ticks />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-solar font-bold uppercase tracking-wider">
              TOPLAM SAYFA GÖRÜNTÜLEME
            </span>
            <Eye size={16} className="text-solar" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold text-paper font-mono">
              {stats ? stats.totalPageviews : '—'}
            </span>
            <span className="text-xs font-mono text-solar font-bold">Hit</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Tüm modüller ve sayfalar genelinde kaydedilen toplam gösterim.
          </p>
        </div>

        {/* KPI 3: Unique Visitors */}
        <div className="relative ticks border border-violet/30 bg-ink-2 p-6">
          <Ticks />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-violet font-bold uppercase tracking-wider">
              TEKİL ZİYARETÇİ
            </span>
            <Users size={16} className="text-violet" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold text-paper font-mono">
              {stats ? stats.uniqueVisitors : '—'}
            </span>
            <span className="text-xs font-mono text-violet font-bold">Benzersiz Kişi</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Gizlilik korumalı benzersiz IP oturumları üzerinden hesaplanır.
          </p>
        </div>

        {/* KPI 4: Avg Dwell Time */}
        <div className="relative ticks border border-solar/30 bg-ink-2 p-6">
          <Ticks />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-solar font-bold uppercase tracking-wider">
              ORTALAMA SÜRE
            </span>
            <Clock size={16} className="text-solar" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold text-paper font-mono">
              {stats ? `${Math.floor(stats.avgDurationSeconds / 60)}d ${stats.avgDurationSeconds % 60}s` : '—'}
            </span>
            <span className="text-xs font-mono text-solar font-bold">Derin Odak</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Kullanıcıların 3D planetaryum ve astrolojide geçirdiği süre.
          </p>
        </div>
      </div>

      {/* 03.10.2026 22:00+ Custom Timeframe Telemetry Report */}
      {report ? (
        <div className="relative ticks border border-solar/60 bg-ink-2 p-6 space-y-6 shadow-[0_0_25px_rgba(255,91,34,0.12)]">
          <Ticks />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-solar text-ink uppercase tracking-wider">
                  ÖZEL RAPOR
                </span>
                <span className="text-xs font-mono text-muted">
                  03.10.2026 22:00 (UTC+3) İtibarıyla Filtrelenmiş Canlı Telemetri
                </span>
              </div>
              <h3 className="text-xl font-bold text-paper mt-1 flex items-center gap-2">
                <FileText className="text-solar" size={20} />
                22:00 Sonrası Ziyaretçi & Telemetri Raporu
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchReport}
                disabled={isLoadingReport}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-line bg-ink text-xs font-mono text-paper hover:border-solar hover:text-solar transition-colors cursor-pointer"
              >
                <RefreshCw size={12} className={isLoadingReport ? 'animate-spin text-solar' : ''} />
                <span>Yenile</span>
              </button>
              <button
                type="button"
                onClick={() => setReport(null)}
                className="p-1.5 border border-line bg-ink text-muted hover:text-rose hover:border-rose transition-colors cursor-pointer"
                title="Raporu Gizle"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* KPI Summary for this report */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="border border-line bg-ink p-4">
              <div className="text-[10px] font-mono text-muted uppercase">Toplam Gösterim</div>
              <div className="text-3xl font-bold text-solar font-mono mt-1">
                {report.totalPageViews}
              </div>
              <div className="text-[11px] text-muted mt-0.5">22:00'den beri hit</div>
            </div>

            <div className="border border-line bg-ink p-4">
              <div className="text-[10px] font-mono text-muted uppercase">Tekil Ziyaretçi</div>
              <div className="text-3xl font-bold text-lime font-mono mt-1">
                {report.uniqueVisitors}
              </div>
              <div className="text-[11px] text-muted mt-0.5">Benzersiz IP / Cihaz</div>
            </div>

            <div className="border border-line bg-ink p-4">
              <div className="text-[10px] font-mono text-muted uppercase">Baskın Cihaz</div>
              <div className="text-base sm:text-lg font-bold text-paper font-mono mt-1 truncate">
                {Object.entries(report.deviceBreakdown || {}).sort((a: any, b: any) => (b[1] as number) - (a[1] as number))[0]?.[0] || '—'}
              </div>
              <div className="text-[11px] text-muted mt-0.5 truncate">
                {Object.entries(report.deviceBreakdown || {}).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'Veri yok'}
              </div>
            </div>

            <div className="border border-line bg-ink p-4">
              <div className="text-[10px] font-mono text-muted uppercase">Baskın Tarayıcı</div>
              <div className="text-base sm:text-lg font-bold text-paper font-mono mt-1 truncate">
                {Object.entries(report.browserBreakdown || {}).sort((a: any, b: any) => (b[1] as number) - (a[1] as number))[0]?.[0] || '—'}
              </div>
              <div className="text-[11px] text-muted mt-0.5 truncate">
                {Object.entries(report.browserBreakdown || {}).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'Veri yok'}
              </div>
            </div>
          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages in this window */}
            <div className="border border-line bg-ink p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold text-paper uppercase tracking-wider flex items-center gap-2 border-b border-line pb-2">
                <Compass size={14} className="text-solar" />
                22:00 Sonrası En Çok Gezilen Sayfalar
              </h4>
              <div className="space-y-2">
                {report.topPages && report.topPages.length > 0 ? (
                  report.topPages.map((p: any, idx: number) => (
                    <div key={p.path} className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="text-[10px] text-solar font-bold w-4">{idx + 1}.</span>
                        <Link href={p.path} target="_blank" className="text-paper hover:text-solar truncate flex items-center gap-1">
                          <span>{p.path}</span>
                          <ExternalLink size={10} className="text-muted" />
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-muted">{p.count} hit</span>
                        <span className="font-bold text-solar w-9 text-right">%{p.percentage || 0}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-mono text-muted py-2">
                    Bu zaman aralığında henüz sayfa kaydı bulunmuyor.
                  </div>
                )}
              </div>
            </div>

            {/* City & OS Distribution */}
            <div className="border border-line bg-ink p-4 space-y-4">
              <div>
                <h4 className="text-xs font-mono font-bold text-paper uppercase tracking-wider flex items-center gap-2 border-b border-line pb-2 mb-2">
                  <MapPin size={14} className="text-lime" />
                  Şehir Dağılımı
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {report.cityBreakdown && Object.keys(report.cityBreakdown).length > 0 ? (
                    Object.entries(report.cityBreakdown).map(([city, count]: any) => (
                      <span key={city} className="border border-line bg-ink-2 px-2 py-1 text-xs font-mono text-paper">
                        {city}: <strong className="text-lime">{count}</strong>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-mono text-muted">Şehir verisi yok</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-paper uppercase tracking-wider flex items-center gap-2 border-b border-line pb-2 mb-2">
                  <Monitor size={14} className="text-violet" />
                  İşletim Sistemi (OS)
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {report.osBreakdown && Object.keys(report.osBreakdown).length > 0 ? (
                    Object.entries(report.osBreakdown).map(([os, count]: any) => (
                      <span key={os} className="border border-line bg-ink-2 px-2 py-1 text-xs font-mono text-paper">
                        {os}: <strong className="text-violet">{count}</strong>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-mono text-muted">OS verisi yok</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Visitor Stream in this window */}
          {report.recentStream && report.recentStream.length > 0 && (
            <div className="border border-line bg-ink p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold text-paper uppercase tracking-wider flex items-center gap-2 border-b border-line pb-2">
                <Clock size={14} className="text-solar" />
                22:00 Sonrası Canlı Ziyaret Akışı
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-line text-[10px] text-muted uppercase">
                      <th className="py-1.5 px-2">Zaman</th>
                      <th className="py-1.5 px-2">Sayfa</th>
                      <th className="py-1.5 px-2">Şehir</th>
                      <th className="py-1.5 px-2">Cihaz</th>
                      <th className="py-1.5 px-2">Tarayıcı</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/40">
                    {report.recentStream.map((item: any) => (
                      <tr key={item.id} className="hover:bg-ink-2 transition-colors">
                        <td className="py-1.5 px-2 text-solar">{item.time}</td>
                        <td className="py-1.5 px-2 text-paper truncate max-w-[200px]">{item.path}</td>
                        <td className="py-1.5 px-2 text-muted">{item.city || '—'}</td>
                        <td className="py-1.5 px-2 text-muted">{item.device} ({item.os})</td>
                        <td className="py-1.5 px-2 text-muted">{item.browser}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-solar/30 bg-solar/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-solar">
            <FileText size={16} />
            <span>03.10.2026 22:00 (UTC+3) sonrasına ait özel zaman dilimi raporunu incelemek için:</span>
          </div>
          <button
            type="button"
            onClick={fetchReport}
            disabled={isLoadingReport}
            className="px-3 py-1.5 bg-solar text-ink font-bold hover:bg-solar/90 transition-colors shrink-0 cursor-pointer text-center"
          >
            {isLoadingReport ? 'Yükleniyor...' : '22:00 Raporunu Aç'}
          </button>
        </div>
      )}

      {/* 24-Hour Timeline Visualizer */}
      <div className="relative ticks border border-line bg-ink-2 p-6 space-y-4">
        <Ticks />
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-paper flex items-center gap-2">
              <BarChart3 className="text-solar" size={18} />
              24 Saatlik Ziyaret & Trafik Dağılımı
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Günün saatlerine göre sayfa gösterim yoğunluğu.
            </p>
          </div>
          <span className="text-xs font-mono text-muted uppercase">Zaman ekseni (UTC+3)</span>
        </div>

        {/* 24 bar columns */}
        <div className="flex items-end gap-1.5 h-36 pt-4 border-b border-line px-1">
          {stats?.hourlyTimeline?.map((bucket) => {
            const maxViews = Math.max(...(stats.hourlyTimeline?.map((b) => b.views) || [1]), 1);
            const heightPct = Math.max(Math.round((bucket.views / maxViews) * 100), 6);
            const currentHourStr = `${String(new Date().getHours()).padStart(2, '0')}:00`;
            const isCurrentHour = bucket.hour === currentHourStr;

            return (
              <div
                key={bucket.hour}
                className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-ink border border-line px-2 py-1 text-[10px] font-mono text-paper whitespace-nowrap pointer-events-none z-10">
                  {bucket.hour} · {bucket.views} gösterim ({bucket.uniques} tekil)
                </div>

                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full transition-all duration-500 ${
                    isCurrentHour
                      ? 'bg-solar shadow-[0_0_12px_rgba(255,91,34,0.5)]'
                      : 'bg-paper/20 group-hover:bg-lime'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-muted pt-1 px-1">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Main Grid: Top Pages & Geographic Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Pages (7 cols) */}
        <div className="lg:col-span-7 relative ticks border border-line bg-ink-2 p-6 space-y-4">
          <Ticks />
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="text-base font-bold text-paper flex items-center gap-2">
                <Compass className="text-solar" size={16} />
                En Çok Ziyaret Edilen Sayfalar
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Kullanıcıların en fazla ilgi gösterdiği modüller.
              </p>
            </div>
            <span className="text-xs font-mono text-muted uppercase">Sıralama</span>
          </div>

          <div className="space-y-3">
            {stats?.topPages?.map((page, idx) => (
              <div key={page.path} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="h-5 w-5 bg-ink border border-line flex items-center justify-center font-bold text-[10px] text-solar">
                      {idx + 1}
                    </span>
                    <Link
                      href={page.path}
                      target="_blank"
                      className="text-paper hover:text-solar transition-colors truncate flex items-center gap-1"
                    >
                      <span>{page.path}</span>
                      <ExternalLink size={10} className="text-muted" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-muted">{page.views} hit</span>
                    <span className="font-bold text-solar w-9 text-right">%{page.percentage}</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-1.5 w-full bg-ink border border-line overflow-hidden">
                  <div
                    style={{ width: `${page.percentage}%` }}
                    className="h-full bg-solar"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Geolocation Cities & Countries (5 cols) */}
        <div className="lg:col-span-5 relative ticks border border-line bg-ink-2 p-6 space-y-4">
          <Ticks />
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="text-base font-bold text-paper flex items-center gap-2">
                <MapPin className="text-rose" size={16} />
                Şehir & Coğrafi Dağılım
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Ziyaretçilerin bağlandığı iller ve ülkeler.
              </p>
            </div>
            <span className="text-xs font-mono text-muted uppercase">Konum</span>
          </div>

          <div className="space-y-3">
            {stats?.topCities?.map((loc) => (
              <div key={loc.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-paper font-medium flex items-center gap-1.5">
                    <MapPin size={13} className="text-solar shrink-0" />
                    <span>{loc.city}</span>
                    <span className="text-[10px] text-muted">({loc.country})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">{loc.count} kişi</span>
                    <span className="font-bold text-rose w-8 text-right">%{loc.percentage}</span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-ink border border-line overflow-hidden">
                  <div
                    style={{ width: `${loc.percentage}%` }}
                    className="h-full bg-rose"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device, Browser & Traffic Source 3-Col Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Devices */}
        <div className="relative ticks border border-line bg-ink-2 p-6 space-y-3">
          <Ticks />
          <h4 className="text-sm font-bold text-paper flex items-center gap-2 font-mono uppercase tracking-wider">
            <Smartphone size={16} className="text-solar" />
            Cihaz Türü
          </h4>
          <div className="space-y-2 pt-2">
            {stats?.deviceBreakdown?.map((d) => (
              <div key={d.device} className="flex items-center justify-between text-xs font-mono bg-ink p-2.5 border border-line">
                <div className="flex items-center gap-2">
                  {deviceIcons[d.device as keyof typeof deviceIcons] || <Monitor size={14} />}
                  <span>{d.device}</span>
                </div>
                <span className="font-bold text-solar">%{d.percentage} ({d.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Browsers */}
        <div className="relative ticks border border-line bg-ink-2 p-6 space-y-3">
          <Ticks />
          <h4 className="text-sm font-bold text-paper flex items-center gap-2 font-mono uppercase tracking-wider">
            <Globe2 size={16} className="text-lime" />
            Tarayıcı Dağılımı
          </h4>
          <div className="space-y-2 pt-2">
            {stats?.browserBreakdown?.map((b) => (
              <div key={b.browser} className="flex items-center justify-between text-xs font-mono bg-ink p-2.5 border border-line">
                <span>{b.browser}</span>
                <span className="font-bold text-lime">%{b.percentage} ({b.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Traffic Sources */}
        <div className="relative ticks border border-line bg-ink-2 p-6 space-y-3">
          <Ticks />
          <h4 className="text-sm font-bold text-paper flex items-center gap-2 font-mono uppercase tracking-wider">
            <TrendingUp size={16} className="text-violet" />
            Trafik Kaynakları
          </h4>
          <div className="space-y-2 pt-2">
            {stats?.trafficSources?.map((src) => (
              <div key={src.source} className="flex items-center justify-between text-xs font-mono bg-ink p-2.5 border border-line">
                <span className="truncate pr-2">{src.source}</span>
                <span className="font-bold text-violet shrink-0">%{src.percentage} ({src.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Stream Terminal */}
      <div className="relative ticks border border-line bg-ink-2 p-6 space-y-4">
        <Ticks />
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-lime animate-ping" />
            <h3 className="text-base font-bold text-paper font-mono uppercase tracking-wider">
              Canlı Ziyaretçi Akış Terminali (Live Visitor Feed)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted uppercase">
            Son 20 İşlem Kaydı
          </span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs pr-2">
          {stats?.recentStream?.map((item) => {
            const timeAgo = Math.max(Math.floor(((now?.getTime() ?? item.timestamp) - item.timestamp) / 1000), 1);
            let timeStr = `${timeAgo} sn önce`;
            if (timeAgo > 60) timeStr = `${Math.floor(timeAgo / 60)} dk önce`;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-ink border border-line hover:border-solar/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted w-16 shrink-0">{timeStr}</span>
                  <span className="px-2 py-0.5 border border-line text-[10px] text-paper">
                    {item.city}, {item.country}
                  </span>
                  <span className="text-solar font-bold truncate max-w-xs">{item.path}</span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-muted shrink-0">
                  <span>{item.device} ({item.os})</span>
                  <span>•</span>
                  <span>{item.browser}</span>
                  <span>•</span>
                  <span className="text-muted">{item.screen}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
