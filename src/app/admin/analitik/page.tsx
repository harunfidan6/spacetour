'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Eye,
  Activity,
  Compass,
  Clock,
  Globe2,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Shield,
  Layers,
  Flame,
  Radio,
  BarChart3,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { AnalyticsStatsResponse } from '@/types/analytics';
import { SplitReveal } from '@/components/motion/SplitReveal';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState<number>(5);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const fetchStats = useCallback(async (demoState?: boolean) => {
    try {
      setIsRefreshing(true);
      const useDemo = typeof demoState === 'boolean' ? demoState : isDemoMode;
      const res = await fetch(`/api/analytics/stats?demo=${useDemo}`, { cache: 'no-store' });
      if (res.ok) {
        const data: AnalyticsStatsResponse = await res.json();
        setStats(data);
        setLastUpdated(new Date().toLocaleTimeString('tr-TR'));
      }
    } catch (err) {
      console.error('Failed to fetch analytics stats:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [isDemoMode]);

  // Initial fetch
  useEffect(() => {
    fetchStats(isDemoMode);
  }, [fetchStats, isDemoMode]);

  // Periodic Auto-refresh
  useEffect(() => {
    if (autoRefreshSecs <= 0) return;
    const interval = setInterval(() => {
      fetchStats();
    }, autoRefreshSecs * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshSecs, fetchStats]);

  const deviceIcons = {
    Mobil: <Smartphone size={14} className="text-gold" />,
    Masaüstü: <Monitor size={14} className="text-primary" />,
    Tablet: <Tablet size={14} className="text-violet" />
  };

  return (
    <div className="module relative space-y-8 px-[var(--gutter)] pb-28 pt-28 text-paper sm:pt-32" style={{ '--page-accent': 'var(--lime)' } as React.CSSProperties}>
      {/* Mission control title card */}
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="label text-lime">(06)</span>
            <span className="label text-paper">Canlı telemetri</span>
            <span className="live-dot ml-1" />
          </div>
          <SplitReveal as="h1" trigger="intro" effect="tilt" className="display text-[clamp(2.8rem,8vw,8rem)] text-paper">
            Görev <span className="serif-i text-lime">kontrol</span>
          </SplitReveal>
          <p className="mt-4 max-w-xl text-sm text-paper/60">
            spacetour.com.tr üzerindeki anlık ziyaretçiler, sayfa görüntülemeleri, coğrafi dağılım ve cihaz verileri.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Demo vs Real Toggle */}
          <div className="flex items-center gap-1 bg-paper/5 border border-paper/10 p-1.5 rounded-2xl text-xs font-mono">
            <button
              onClick={() => {
                setIsDemoMode(false);
                fetchStats(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isDemoMode
                  ? 'bg-lime text-ink shadow-[0_0_15px_rgba(212,255,61,0.3)]'
                  : 'text-muted hover:text-paper'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${!isDemoMode ? 'bg-ink' : 'bg-lime'}`} />
              <span>%100 Gerçek Canlı Veri</span>
            </button>

            <button
              onClick={() => {
                setIsDemoMode(true);
                fetchStats(true);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isDemoMode
                  ? 'bg-violet text-paper shadow-[0_0_15px_rgba(122,92,255,0.3)]'
                  : 'text-muted hover:text-paper'
              }`}
            >
              <span>🧪 Örnek Simülasyon</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-paper/5 border border-paper/10 p-2 rounded-2xl text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2">
              <span className="h-2 w-2 rounded-full bg-lime animate-ping" />
              <span className="text-muted text-[11px]">Son Güncelleme:</span>
              <span className="text-paper font-bold">{lastUpdated || 'Yükleniyor...'}</span>
            </div>

            <div className="flex items-center gap-1 border-l border-paper/10 pl-2">
              {[
                { label: '5sn', val: 5 },
                { label: '15sn', val: 15 },
                { label: 'Durdur', val: 0 }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setAutoRefreshSecs(opt.val)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    autoRefreshSecs === opt.val
                      ? 'bg-lime text-ink shadow-[0_0_10px_rgba(212,255,61,0.3)]'
                      : 'text-muted hover:text-paper'
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              <button
                onClick={() => fetchStats()}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg text-paper/75 hover:text-paper hover:bg-paper/10 transition-colors ml-1 cursor-pointer"
                title="Şimdi Yenile"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Mode Notice Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          !isDemoMode
            ? 'border-lime/30 bg-lime/10 text-lime'
            : 'border-violet/30 bg-violet/10 text-violet'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>{!isDemoMode ? '⚡' : '🧪'}</span>
          <span>
            {!isDemoMode
              ? 'CANLI GERÇEK MOD AKTİF: Yalnızca siteye giren GERÇEK ziyaretçi ve IP telemetrisi görüntüleniyor.'
              : 'SİMÜLASYON MODU AKTİF: Grafikleri ve rapor yapısını incelemek için örnek test verileri görüntüleniyor.'}
          </span>
        </div>
        {!isDemoMode && (
          <div className="text-paper/75 text-[11px]">
            💡 <em>Telefonunuzdan veya başka sekmeden siteye girdiğiniz an canlı akışta anında belireceksiniz!</em>
          </div>
        )}
      </div>

      {/* 4 Big Real-Time KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Visitors Now */}
        <div className="rounded-3xl border border-lime/30 bg-gradient-to-br from-lime/10 via-ink/40 to-ink/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-lime font-bold uppercase tracking-wider">
              ŞU AN CANLI (ONLINE)
            </span>
            <span className="h-3 w-3 rounded-full bg-lime animate-ping" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-paper font-mono">
              {stats?.activeVisitorsNow ?? 1}
            </span>
            <span className="text-xs font-mono text-lime font-bold">Kişi Sitede</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Son 3 dakika içinde sayfalar arasında gezinen aktif ziyaretçiler.
          </p>
        </div>

        {/* KPI 2: Total Pageviews */}
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-ink/40 to-ink/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
              TOPLAM SAYFA GÖRÜNTÜLEME
            </span>
            <Eye size={18} className="text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-paper font-mono">
              {stats?.totalPageviews ?? 0}
            </span>
            <span className="text-xs font-mono text-primary font-bold">Hit</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Tüm modüller ve sayfalar genelinde kaydedilen toplam gösterim.
          </p>
        </div>

        {/* KPI 3: Unique Visitors */}
        <div className="rounded-3xl border border-violet/30 bg-gradient-to-br from-violet/10 via-ink/40 to-ink/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-violet font-bold uppercase tracking-wider">
              TEKİL ZİYARETÇİ
            </span>
            <Users size={18} className="text-violet" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-paper font-mono">
              {stats?.uniqueVisitors ?? 0}
            </span>
            <span className="text-xs font-mono text-violet font-bold">Benzersiz Kişi</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Gizlilik korumalı benzersiz IP oturumları üzerinden hesaplanır.
          </p>
        </div>

        {/* KPI 4: Avg Dwell Time */}
        <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-ink/40 to-ink/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">
              ORTALAMA SÜRE
            </span>
            <Clock size={18} className="text-gold" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-paper font-mono">
              {Math.floor((stats?.avgDurationSeconds ?? 142) / 60)}d {(stats?.avgDurationSeconds ?? 142) % 60}s
            </span>
            <span className="text-xs font-mono text-gold font-bold">Derin Odak</span>
          </div>
          <p className="text-xs text-muted mt-2">
            Kullanıcıların 3D planetaryum ve astrolojide geçirdiği süre.
          </p>
        </div>
      </div>

      {/* 24-Hour Timeline Visualizer */}
      <div className="rounded-3xl border border-paper/10 bg-ink/60 p-6 backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-paper flex items-center gap-2">
              <BarChart3 className="text-primary" size={18} />
              24 Saatlik Ziyaret & Trafik Dağılımı
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Günün saatlerine göre sayfa gösterim yoğunluğu.
            </p>
          </div>
          <span className="text-xs font-mono text-muted">Canlı Zaman Serisi</span>
        </div>

        {/* Bar chart grid */}
        <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 border-b border-paper/10">
          {stats?.hourlyTimeline?.map((item, idx) => {
            const maxViews = Math.max(...(stats.hourlyTimeline.map((h) => h.views) || [1]), 1);
            const heightPct = Math.max(Math.round((item.views / maxViews) * 100), 8);
            const isPeak = item.views === maxViews && item.views > 0;

            return (
              <div
                key={item.hour}
                className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-2 border border-paper/20 text-[10px] font-mono px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-xl">
                  {item.hour} • <strong>{item.views} Hit</strong> ({item.uniques} tekil)
                </div>

                {/* Animated Bar */}
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isPeak
                      ? 'bg-gradient-to-t from-primary to-lime shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                      : 'bg-paper/20 group-hover:bg-primary/80'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Hours Label Bar */}
        <div className="flex justify-between text-[9px] font-mono text-muted pt-1">
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
        <div className="lg:col-span-7 rounded-3xl border border-paper/10 bg-ink/60 p-6 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-paper/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-paper flex items-center gap-2">
                <Compass className="text-gold" size={16} />
                En Çok Ziyaret Edilen Sayfalar
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Kullanıcıların en fazla ilgi gösterdiği modüller.
              </p>
            </div>
            <span className="text-xs font-mono text-muted">Sıralama</span>
          </div>

          <div className="space-y-3">
            {stats?.topPages?.map((page, idx) => (
              <div key={page.path} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="h-5 w-5 rounded-md bg-paper/5 border border-paper/10 flex items-center justify-center font-bold text-[10px] text-gold">
                      {idx + 1}
                    </span>
                    <Link
                      href={page.path}
                      target="_blank"
                      className="text-paper hover:text-primary transition-colors truncate flex items-center gap-1"
                    >
                      <span>{page.path}</span>
                      <ExternalLink size={10} className="text-muted" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-muted">{page.views} hit</span>
                    <span className="font-bold text-gold w-9 text-right">%{page.percentage}</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-1.5 w-full bg-paper/5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${page.percentage}%` }}
                    className="h-full bg-gradient-to-r from-gold to-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Geolocation Cities & Countries (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-paper/10 bg-ink/60 p-6 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-paper/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-paper flex items-center gap-2">
                <MapPin className="text-rose-signal" size={16} />
                Şehir & Coğrafi Dağılım
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Ziyaretçilerin bağlandığı iller ve ülkeler.
              </p>
            </div>
            <span className="text-xs font-mono text-muted">Konum</span>
          </div>

          <div className="space-y-3">
            {stats?.topCities?.map((loc) => (
              <div key={loc.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-paper font-medium flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{loc.city}</span>
                    <span className="text-[10px] text-muted">({loc.country})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">{loc.count} kişi</span>
                    <span className="font-bold text-rose-signal w-8 text-right">%{loc.percentage}</span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-paper/5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${loc.percentage}%` }}
                    className="h-full bg-gradient-to-r from-rose-signal to-violet rounded-full"
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
        <div className="rounded-3xl border border-paper/10 bg-ink/60 p-6 backdrop-blur-2xl space-y-3">
          <h4 className="text-sm font-bold text-paper flex items-center gap-2 font-mono uppercase tracking-wider">
            <Smartphone size={16} className="text-gold" />
            Cihaz Türü
          </h4>
          <div className="space-y-2 pt-2">
            {stats?.deviceBreakdown?.map((d) => (
              <div key={d.device} className="flex items-center justify-between text-xs font-mono bg-paper/5 p-2.5 rounded-xl border border-paper/5">
                <div className="flex items-center gap-2">
                  {deviceIcons[d.device as keyof typeof deviceIcons] || <Monitor size={14} />}
                  <span>{d.device}</span>
                </div>
                <span className="font-bold text-gold">%{d.percentage} ({d.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Browsers */}
        <div className="rounded-3xl border border-paper/10 bg-ink/60 p-6 backdrop-blur-2xl space-y-3">
          <h4 className="text-sm font-bold text-paper flex items-center gap-2 font-mono uppercase tracking-wider">
            <Globe2 size={16} className="text-primary" />
            Tarayıcı Dağılımı
          </h4>
          <div className="space-y-2 pt-2">
            {stats?.browserBreakdown?.map((b) => (
              <div key={b.browser} className="flex items-center justify-between text-xs font-mono bg-paper/5 p-2.5 rounded-xl border border-paper/5">
                <span>{b.browser}</span>
                <span className="font-bold text-primary">%{b.percentage} ({b.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Traffic Sources */}
        <div className="rounded-3xl border border-paper/10 bg-ink/60 p-6 backdrop-blur-2xl space-y-3">
          <h4 className="text-sm font-bold text-paper flex items-center gap-2 font-mono uppercase tracking-wider">
            <TrendingUp size={16} className="text-lime" />
            Trafik Kaynakları
          </h4>
          <div className="space-y-2 pt-2">
            {stats?.trafficSources?.map((src) => (
              <div key={src.source} className="flex items-center justify-between text-xs font-mono bg-paper/5 p-2.5 rounded-xl border border-paper/5">
                <span className="truncate pr-2">{src.source}</span>
                <span className="font-bold text-lime shrink-0">%{src.percentage} ({src.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Stream Terminal */}
      <div className="rounded-3xl border border-paper/10 bg-ink/80 p-6 backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-paper/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-lime animate-ping" />
            <h3 className="text-base font-bold text-paper font-mono uppercase tracking-wider">
              Canlı Ziyaretçi Akış Terminali (Live Visitor Feed)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted">
            Son 20 İşlem Kaydı
          </span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs pr-2">
          {stats?.recentStream?.map((item) => {
            const timeAgo = Math.max(Math.floor((Date.now() - item.timestamp) / 1000), 1);
            let timeStr = `${timeAgo} sn önce`;
            if (timeAgo > 60) timeStr = `${Math.floor(timeAgo / 60)} dk önce`;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-paper/[0.03] border border-paper/5 hover:border-paper/15 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted w-16 shrink-0">{timeStr}</span>
                  <span className="px-2 py-0.5 rounded-md bg-paper/5 text-[10px] text-paper/75">
                    {item.city}, {item.country}
                  </span>
                  <span className="text-primary font-bold truncate max-w-xs">{item.path}</span>
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
