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
  X,
  Download,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Calendar
} from 'lucide-react';
import { AnalyticsStatsResponse } from '@/types/analytics';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Ticks } from '@/components/motion/primitives';
import { useNow } from '@/lib/useNow';
import { FreshnessPanel } from './FreshnessPanel';

async function requestStats(demo: boolean, period: string = 'today'): Promise<{ data: AnalyticsStatsResponse | null; unauthorized?: boolean }> {
  try {
    const res = await fetch(`/api/analytics/stats?demo=${demo}&period=${period}`, {
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
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'yesterday' | '7days' | '30days'>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState<number>(5);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const now = useNow(1000);
  const [isExporting, setIsExporting] = useState<boolean>(false);

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
    requestStats(isDemoMode, selectedPeriod).then(applyStats);
  }, [isDemoMode, selectedPeriod, isAuthenticated, applyStats]);

  // Export current telemetry dataset as JSON
  const handleExportData = useCallback(() => {
    if (!stats) return;
    setIsExporting(true);
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `spacetour-telemetry-${selectedPeriod}-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Export error', e);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  }, [stats, selectedPeriod]);

  // Load on mount, source toggle & period toggle
  useEffect(() => {
    if (!isAuthenticated) return;
    let ignore = false;
    setIsRefreshing(true);
    requestStats(isDemoMode, selectedPeriod).then((result) => {
      if (!ignore) applyStats(result);
    });
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isDemoMode, selectedPeriod, applyStats]);

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
              onClick={handleExportData}
              disabled={isExporting || !stats}
              aria-label="Telemetri Verilerini İndir"
              className="flex items-center gap-1.5 px-2.5 py-1 border border-line bg-ink text-paper hover:border-solar hover:text-solar font-mono text-[11px] font-bold transition-all ml-2 cursor-pointer shadow-[0_0_10px_rgba(255,91,34,0.08)]"
              title="Mevcut Telemetri Verilerini JSON Formatında İndir"
            >
              <Download size={12} className={isExporting ? 'animate-bounce text-solar' : ''} />
              <span>{isExporting ? 'İndiriliyor...' : 'Dışa Aktar'}</span>
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

      {/* Günlük içerik denetimi (günlük burç, Ay bugün) */}
      <FreshnessPanel />

      {/* Time Period Selector Tabs */}
      <div className="relative ticks border border-line bg-ink-2 p-3 sm:p-4">
        <Ticks />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="text-solar" size={16} />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-paper">
              Raporlama Zaman Aralığı:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 font-mono text-xs">
            {[
              { id: 'today', label: 'Bugün (Son 24 Saat)', icon: Clock },
              { id: 'yesterday', label: 'Dün', icon: Calendar },
              { id: '7days', label: 'Son 7 Gün (Haftalık)', icon: BarChart3 },
              { id: '30days', label: 'Son 30 Gün (Aylık)', icon: TrendingUp }
            ].map((p) => {
              const IconComp = p.icon;
              const isActive = selectedPeriod === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPeriod(p.id as any)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 border transition-all cursor-pointer font-bold ${
                    isActive
                      ? 'border-solar bg-solar text-ink shadow-[0_0_15px_rgba(255,91,34,0.3)]'
                      : 'border-line bg-ink text-muted hover:text-paper hover:border-paper/40'
                  }`}
                >
                  <IconComp size={13} className={isActive ? 'text-ink' : 'text-solar'} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Zero Data Notification Banner for Selected Period */}
      {stats && stats.totalPageviews === 0 && (
        <div className="p-4 border border-solar/40 bg-solar/10 text-xs font-mono text-solar flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 text-solar mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider text-paper">
              {selectedPeriod === 'yesterday'
                ? 'DÜN İÇİN HENÜZ GEÇMİŞ VERİ BULUNMUYOR'
                : 'SEÇİLİ DÖNEM İÇİN KAYITLI VERİ BULUNMUYOR'}
            </div>
            <p className="text-paper/80 leading-relaxed">
              {selectedPeriod === 'yesterday'
                ? 'Google Analytics 4 mülkü (#557060847) ve telemetri köprüsü siteye bugün bağlandığı için Google sunucularında dünün verisi sıfırdır. Bugünden itibaren dünün ve geçmiş günlerin verileri düzenli olarak burada birikmeye devam edecektir.'
                : 'Seçili zaman aralığında henüz kaydedilmiş sayfa gösterimi veya ziyaretçi verisi yoktur.'}
            </p>
            <div className="text-[11px] text-muted pt-1">
              💡 <em>"Bugün (Son 24 Saat)" sekmesine geçerek güncel gerçek verileri görebilir veya yukarıdan "Örnek Simülasyon" moduna tıklayarak dün ve geçmiş dönemlerin grafik yapısını test edebilirsiniz.</em>
            </div>
          </div>
        </div>
      )}

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
            Son 3-5 dakika içinde sitede aktif gezinen kullanıcılar.
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
            {selectedPeriod === 'today' && 'Bugün kaydedilen toplam sayfa gösterimi.'}
            {selectedPeriod === 'yesterday' && 'Dün gün boyunca kaydedilen toplam gösterim.'}
            {selectedPeriod === '7days' && 'Son 7 günde kaydedilen toplam sayfa gösterimi.'}
            {selectedPeriod === '30days' && 'Son 30 günde kaydedilen kümülatif gösterim.'}
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
            <span className="text-xs font-mono text-violet font-bold">Tekil Kişi</span>
          </div>
          <p className="text-xs text-muted mt-2">
            {selectedPeriod === 'today' && 'Bugünkü benzersiz tekil ziyaretçi sayısı.'}
            {selectedPeriod === 'yesterday' && 'Dünkü benzersiz tekil ziyaretçi sayısı.'}
            {selectedPeriod === '7days' && 'Son 7 günlük benzersiz tekil ziyaretçi sayısı.'}
            {selectedPeriod === '30days' && 'Son 30 günlük benzersiz tekil ziyaretçi sayısı.'}
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
            Seçili dönemde modüllerde geçirilen ortalama oturum süresi.
          </p>
        </div>
      </div>

      {/* Google Analytics & Live Telemetry Intelligence Deck */}
      <div className="relative ticks border border-lime/40 bg-ink-2 p-6 space-y-6 shadow-[0_0_20px_rgba(74,222,128,0.06)]">
        <Ticks />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-lime/20 text-lime border border-lime/40 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
                CANLI VERİ AKIŞI
              </span>
              <span className="text-xs font-mono text-muted">
                Google Analytics 4 Data API & Kinetik Telemetri Köprüsü
              </span>
            </div>
            <h3 className="text-xl font-bold text-paper mt-1.5 flex items-center gap-2">
              <ShieldCheck className="text-lime" size={20} />
              Sistem Entegrasyonu & Canlı Analitik Merkezi
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportData}
              disabled={isExporting || !stats}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-line bg-ink text-xs font-mono text-paper hover:border-solar hover:text-solar transition-colors cursor-pointer"
            >
              <Download size={13} className={isExporting ? 'animate-bounce text-solar' : ''} />
              <span>{isExporting ? 'Dışa Aktarılıyor...' : 'Raporu JSON Olarak İndir'}</span>
            </button>
          </div>
        </div>

        {/* Integration Telemetry Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-line bg-ink p-4 space-y-1">
            <div className="text-[10px] font-mono text-muted uppercase flex items-center justify-between">
              <span>GA4 Mülk Kimliği</span>
              <CheckCircle2 size={12} className="text-lime" />
            </div>
            <div className="text-lg font-bold text-paper font-mono">
              #557060847
            </div>
            <div className="text-[11px] text-lime font-mono">✓ Aktif & Doğrulandı</div>
          </div>

          <div className="border border-line bg-ink p-4 space-y-1">
            <div className="text-[10px] font-mono text-muted uppercase flex items-center justify-between">
              <span>Ölçüm Kimliği (Tag)</span>
              <CheckCircle2 size={12} className="text-lime" />
            </div>
            <div className="text-lg font-bold text-paper font-mono">
              G-5F797S90G9
            </div>
            <div className="text-[11px] text-muted font-mono">Global CDN Takibi</div>
          </div>

          <div className="border border-line bg-ink p-4 space-y-1">
            <div className="text-[10px] font-mono text-muted uppercase flex items-center justify-between">
              <span>Oturum Derinliği</span>
              <Zap size={12} className="text-solar" />
            </div>
            <div className="text-lg font-bold text-solar font-mono">
              {stats ? `${((stats.totalPageviews || 1) / Math.max(stats.uniqueVisitors || 1, 1)).toFixed(1)} sayfa` : '—'}
            </div>
            <div className="text-[11px] text-muted font-mono">Kullanıcı Başına Ort. Hit</div>
          </div>

          <div className="border border-line bg-ink p-4 space-y-1">
            <div className="text-[10px] font-mono text-muted uppercase flex items-center justify-between">
              <span>Veri Kalıcılığı</span>
              <ShieldCheck size={12} className="text-violet" />
            </div>
            <div className="text-lg font-bold text-violet font-mono">
              Sınırsız / Kalıcı
            </div>
            <div className="text-[11px] text-muted font-mono">Bulut + Audit Log</div>
          </div>
        </div>
      </div>

      {/* Dynamic Timeline Visualizer */}
      <div className="relative ticks border border-line bg-ink-2 p-6 space-y-4">
        <Ticks />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-paper flex items-center gap-2">
              <BarChart3 className="text-solar" size={18} />
              {selectedPeriod === 'today' && 'Bugünün Saatlik Trafik Dağılımı (24 Saat)'}
              {selectedPeriod === 'yesterday' && 'Dünün Saatlik Trafik Dağılımı (24 Saat)'}
              {selectedPeriod === '7days' && 'Son 7 Günün Günlük Dağılımı (Haftalık)'}
              {selectedPeriod === '30days' && 'Son 30 Günün Günlük Dağılımı (Aylık)'}
            </h3>
            <p className="text-xs text-muted mt-0.5">
              {selectedPeriod === 'today' || selectedPeriod === 'yesterday'
                ? 'Günün saatlerine göre sayfa gösterim ve ziyaretçi yoğunluğu.'
                : 'Gün bazında toplam sayfa gösterimi ve tekil ziyaretçi dağılımı.'}
            </p>
          </div>
          <span className="text-xs font-mono text-muted uppercase">
            {selectedPeriod === 'today' || selectedPeriod === 'yesterday'
              ? 'Zaman ekseni (Saatlik UTC+3)'
              : 'Zaman ekseni (Günlük)'}
          </span>
        </div>

        {/* bar columns */}
        <div className="flex items-end gap-1 sm:gap-1.5 h-36 pt-4 border-b border-line px-1">
          {stats?.hourlyTimeline?.map((bucket, idx) => {
            const maxViews = Math.max(...(stats.hourlyTimeline?.map((b) => b.views) || [1]), 1);
            const heightPct = Math.max(Math.round((bucket.views / maxViews) * 100), 6);
            const isHourly = selectedPeriod === 'today' || selectedPeriod === 'yesterday';
            const currentHourStr = `${String(new Date().getHours()).padStart(2, '0')}:00`;
            const isHighlight = isHourly && selectedPeriod === 'today' && bucket.hour === currentHourStr;

            return (
              <div
                key={bucket.hour || idx}
                className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-ink border border-line px-2 py-1 text-[10px] font-mono text-paper whitespace-nowrap pointer-events-none z-10">
                  {bucket.hour} · {bucket.views} gösterim ({bucket.uniques} tekil)
                </div>

                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full transition-all duration-500 ${
                    isHighlight
                      ? 'bg-solar shadow-[0_0_12px_rgba(255,91,34,0.5)]'
                      : 'bg-paper/20 group-hover:bg-lime'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Dynamic Axis Labels */}
        <div className="flex justify-between text-[10px] font-mono text-muted pt-1 px-1">
          {selectedPeriod === 'today' || selectedPeriod === 'yesterday' ? (
            <>
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>23:00</span>
            </>
          ) : stats?.hourlyTimeline && stats.hourlyTimeline.length > 0 ? (
            <>
              <span>{stats.hourlyTimeline[0]?.hour}</span>
              {stats.hourlyTimeline.length > 2 && (
                <span>{stats.hourlyTimeline[Math.floor(stats.hourlyTimeline.length / 2)]?.hour}</span>
              )}
              <span>{stats.hourlyTimeline[stats.hourlyTimeline.length - 1]?.hour}</span>
            </>
          ) : null}
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
                {selectedPeriod === 'today' && 'Bugün kullanıcıların en fazla ilgi gösterdiği sayfalar.'}
                {selectedPeriod === 'yesterday' && 'Dün kullanıcıların en fazla ilgi gösterdiği sayfalar.'}
                {selectedPeriod === '7days' && 'Son 7 günde kullanıcıların en fazla ilgi gösterdiği sayfalar.'}
                {selectedPeriod === '30days' && 'Son 30 günde kullanıcıların en fazla ilgi gösterdiği sayfalar.'}
              </p>
            </div>
            <span className="text-xs font-mono text-muted uppercase">Sıralama</span>
          </div>

          <div className="space-y-3">
            {(!stats?.topPages || stats.topPages.length === 0) ? (
              <div className="py-8 text-center text-xs font-mono text-muted flex flex-col items-center justify-center gap-2 border border-dashed border-line/60 bg-ink/40">
                <Compass className="text-muted/40" size={24} />
                <span>Bu dönem için henüz sayfa ziyareti kaydedilmedi.</span>
                {selectedPeriod === 'yesterday' && (
                  <span className="text-[10px] text-muted/60">Google Analytics bugün kurulduğu için dün verisi boştur.</span>
                )}
              </div>
            ) : (
              stats.topPages.map((page, idx) => (
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
              ))
            )}
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
                {selectedPeriod === 'today' && 'Bugün ziyaretçilerin bağlandığı iller ve ülkeler.'}
                {selectedPeriod === 'yesterday' && 'Dün ziyaretçilerin bağlandığı iller ve ülkeler.'}
                {selectedPeriod === '7days' && 'Son 7 günde ziyaretçilerin bağlandığı iller ve ülkeler.'}
                {selectedPeriod === '30days' && 'Son 30 günde ziyaretçilerin bağlandığı iller ve ülkeler.'}
              </p>
            </div>
            <span className="text-xs font-mono text-muted uppercase">Konum</span>
          </div>

          <div className="space-y-3">
            {(!stats?.topCities || stats.topCities.length === 0) ? (
              <div className="py-8 text-center text-xs font-mono text-muted flex flex-col items-center justify-center gap-2 border border-dashed border-line/60 bg-ink/40">
                <MapPin className="text-muted/40" size={24} />
                <span>Bu dönem için henüz konum verisi kaydedilmedi.</span>
              </div>
            ) : (
              stats.topCities.map((loc) => (
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
              ))
            )}
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
          <div className="space-y-2.5 pt-2">
            {(!stats?.deviceBreakdown || stats.deviceBreakdown.length === 0) ? (
              <div className="py-6 text-center text-xs font-mono text-muted flex flex-col items-center justify-center gap-1.5 border border-dashed border-line/60 bg-ink/40">
                <Smartphone className="text-muted/40" size={18} />
                <span>Cihaz verisi bulunmuyor.</span>
              </div>
            ) : (
              stats.deviceBreakdown.map((d) => (
                <div key={d.device} className="bg-ink p-2.5 border border-line space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {deviceIcons[d.device as keyof typeof deviceIcons] || <Monitor size={14} />}
                      <span className="text-paper">{d.device}</span>
                    </div>
                    <span className="font-bold text-solar">%{d.percentage} <span className="text-muted font-normal">({d.count})</span></span>
                  </div>
                  <div className="h-1 w-full bg-ink-2 overflow-hidden border border-line/40">
                    <div style={{ width: `${Math.max(d.percentage, 2)}%` }} className="h-full bg-solar" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Browsers */}
        <div className="relative ticks border border-line bg-ink-2 p-6 space-y-3">
          <Ticks />
          <h4 className="text-sm font-bold text-paper flex items-center gap-2 font-mono uppercase tracking-wider">
            <Globe2 size={16} className="text-lime" />
            Tarayıcı Dağılımı
          </h4>
          <div className="space-y-2.5 pt-2">
            {(!stats?.browserBreakdown || stats.browserBreakdown.length === 0) ? (
              <div className="py-6 text-center text-xs font-mono text-muted flex flex-col items-center justify-center gap-1.5 border border-dashed border-line/60 bg-ink/40">
                <Globe2 className="text-muted/40" size={18} />
                <span>Tarayıcı verisi bulunmuyor.</span>
              </div>
            ) : (
              stats.browserBreakdown.map((b) => (
                <div key={b.browser} className="bg-ink p-2.5 border border-line space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-paper">{b.browser}</span>
                    <span className="font-bold text-lime">%{b.percentage} <span className="text-muted font-normal">({b.count})</span></span>
                  </div>
                  <div className="h-1 w-full bg-ink-2 overflow-hidden border border-line/40">
                    <div style={{ width: `${Math.max(b.percentage, 2)}%` }} className="h-full bg-lime" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Traffic Sources */}
        <div className="relative ticks border border-line bg-ink-2 p-6 space-y-3">
          <Ticks />
          <h4 className="text-sm font-bold text-paper flex items-center gap-2 font-mono uppercase tracking-wider">
            <TrendingUp size={16} className="text-violet" />
            Trafik Kaynakları
          </h4>
          <div className="space-y-2.5 pt-2">
            {(!stats?.trafficSources || stats.trafficSources.length === 0) ? (
              <div className="py-6 text-center text-xs font-mono text-muted flex flex-col items-center justify-center gap-1.5 border border-dashed border-line/60 bg-ink/40">
                <TrendingUp className="text-muted/40" size={18} />
                <span>Trafik kaynağı verisi bulunmuyor.</span>
              </div>
            ) : (
              stats.trafficSources.map((src) => (
                <div key={src.source} className="bg-ink p-2.5 border border-line space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="truncate pr-2 text-paper">{src.source}</span>
                    <span className="font-bold text-violet shrink-0">%{src.percentage} <span className="text-muted font-normal">({src.count})</span></span>
                  </div>
                  <div className="h-1 w-full bg-ink-2 overflow-hidden border border-line/40">
                    <div style={{ width: `${Math.max(src.percentage, 2)}%` }} className="h-full bg-violet" />
                  </div>
                </div>
              ))
            )}
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
          {(!stats?.recentStream || stats.recentStream.length === 0) ? (
            <div className="py-8 text-center text-xs font-mono text-muted flex flex-col items-center justify-center gap-2 border border-dashed border-line/60 bg-ink/40">
              <Clock className="text-muted/40" size={20} />
              <span>Bu dönem için geçmiş akış kaydı bulunmuyor. Yeni ziyaretçiler siteye girdikçe anlık kaydedilir.</span>
            </div>
          ) : (
            stats.recentStream.map((item) => {
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
