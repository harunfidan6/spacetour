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
    Mobil: <Smartphone size={14} className="text-amber-400" />,
    Masaüstü: <Monitor size={14} className="text-cyan-400" />,
    Tablet: <Tablet size={14} className="text-purple-400" />
  };

  return (
    <div className="min-h-screen bg-black/60 text-white p-4 sm:p-8 lg:p-12 relative z-10 space-y-8 max-w-7xl mx-auto">
      {/* Top Mission Control Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
              NASA MISSION CONTROL • GERÇEK ZAMANLI TELEMETRİ
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ziyaretçi & Trafik{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Analiz Paneli
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            spacetour.com.tr üzerindeki anlık canlı ziyaretçiler, sayfa görüntülemeleri, coğrafi şehir dağılımı ve cihaz verileri.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Demo vs Real Toggle */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 rounded-2xl text-xs font-mono">
            <button
              onClick={() => {
                setIsDemoMode(false);
                fetchStats(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isDemoMode
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${!isDemoMode ? 'bg-black' : 'bg-emerald-400'}`} />
              <span>%100 Gerçek Canlı Veri</span>
            </button>

            <button
              onClick={() => {
                setIsDemoMode(true);
                fetchStats(true);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isDemoMode
                  ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>🧪 Örnek Simülasyon</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-neutral-400 text-[11px]">Son Güncelleme:</span>
              <span className="text-white font-bold">{lastUpdated || 'Yükleniyor...'}</span>
            </div>

            <div className="flex items-center gap-1 border-l border-white/10 pl-2">
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
                      ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              <button
                onClick={() => fetchStats()}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
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
            ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
            : 'border-purple-500/30 bg-purple-950/20 text-purple-300'
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
          <div className="text-neutral-300 text-[11px]">
            💡 <em>Telefonunuzdan veya başka sekmeden siteye girdiğiniz an canlı akışta anında belireceksiniz!</em>
          </div>
        )}
      </div>

      {/* 4 Big Real-Time KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Visitors Now */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-black/40 to-black/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              ŞU AN CANLI (ONLINE)
            </span>
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono">
              {stats?.activeVisitorsNow ?? 1}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">Kişi Sitede</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            Son 3 dakika içinde sayfalar arasında gezinen aktif ziyaretçiler.
          </p>
        </div>

        {/* KPI 2: Total Pageviews */}
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-black/40 to-black/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              TOPLAM SAYFA GÖRÜNTÜLEME
            </span>
            <Eye size={18} className="text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono">
              {stats?.totalPageviews ?? 0}
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">Hit</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            Tüm modüller ve sayfalar genelinde kaydedilen toplam gösterim.
          </p>
        </div>

        {/* KPI 3: Unique Visitors */}
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-black/40 to-black/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
              TEKİL ZİYARETÇİ
            </span>
            <Users size={18} className="text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono">
              {stats?.uniqueVisitors ?? 0}
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold">Benzersiz Kişi</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            Gizlilik korumalı benzersiz IP oturumları üzerinden hesaplanır.
          </p>
        </div>

        {/* KPI 4: Avg Dwell Time */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-black/40 to-black/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              ORTALAMA SÜRE
            </span>
            <Clock size={18} className="text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono">
              {Math.floor((stats?.avgDurationSeconds ?? 142) / 60)}d {(stats?.avgDurationSeconds ?? 142) % 60}s
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">Derin Odak</span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            Kullanıcıların 3D planetaryum ve astrolojide geçirdiği süre.
          </p>
        </div>
      </div>

      {/* 24-Hour Timeline Visualizer */}
      <div className="rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-cyan-400" size={18} />
              24 Saatlik Ziyaret & Trafik Dağılımı
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Günün saatlerine göre sayfa gösterim yoğunluğu.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">Canlı Zaman Serisi</span>
        </div>

        {/* Bar chart grid */}
        <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 border-b border-white/10">
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
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 border border-white/20 text-[10px] font-mono px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-xl">
                  {item.hour} • <strong>{item.views} Hit</strong> ({item.uniques} tekil)
                </div>

                {/* Animated Bar */}
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isPeak
                      ? 'bg-gradient-to-t from-cyan-600 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                      : 'bg-white/20 group-hover:bg-cyan-400/80'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Hours Label Bar */}
        <div className="flex justify-between text-[9px] font-mono text-neutral-500 pt-1">
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
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="text-amber-400" size={16} />
                En Çok Ziyaret Edilen Sayfalar
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Kullanıcıların en fazla ilgi gösterdiği modüller.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Sıralama</span>
          </div>

          <div className="space-y-3">
            {stats?.topPages?.map((page, idx) => (
              <div key={page.path} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="h-5 w-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px] text-amber-300">
                      {idx + 1}
                    </span>
                    <Link
                      href={page.path}
                      target="_blank"
                      className="text-white hover:text-cyan-400 transition-colors truncate flex items-center gap-1"
                    >
                      <span>{page.path}</span>
                      <ExternalLink size={10} className="text-neutral-500" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-neutral-400">{page.views} hit</span>
                    <span className="font-bold text-amber-300 w-9 text-right">%{page.percentage}</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${page.percentage}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Geolocation Cities & Countries (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="text-rose-400" size={16} />
                Şehir & Coğrafi Dağılım
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Ziyaretçilerin bağlandığı iller ve ülkeler.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Konum</span>
          </div>

          <div className="space-y-3">
            {stats?.topCities?.map((loc) => (
              <div key={loc.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-medium flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{loc.city}</span>
                    <span className="text-[10px] text-neutral-500">({loc.country})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">{loc.count} kişi</span>
                    <span className="font-bold text-rose-300 w-8 text-right">%{loc.percentage}</span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${loc.percentage}%` }}
                    className="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full"
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
        <div className="rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-2xl space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
            <Smartphone size={16} className="text-amber-400" />
            Cihaz Türü
          </h4>
          <div className="space-y-2 pt-2">
            {stats?.deviceBreakdown?.map((d) => (
              <div key={d.device} className="flex items-center justify-between text-xs font-mono bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  {deviceIcons[d.device as keyof typeof deviceIcons] || <Monitor size={14} />}
                  <span>{d.device}</span>
                </div>
                <span className="font-bold text-amber-300">%{d.percentage} ({d.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Browsers */}
        <div className="rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-2xl space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
            <Globe2 size={16} className="text-cyan-400" />
            Tarayıcı Dağılımı
          </h4>
          <div className="space-y-2 pt-2">
            {stats?.browserBreakdown?.map((b) => (
              <div key={b.browser} className="flex items-center justify-between text-xs font-mono bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span>{b.browser}</span>
                <span className="font-bold text-cyan-300">%{b.percentage} ({b.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Traffic Sources */}
        <div className="rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-2xl space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
            <TrendingUp size={16} className="text-emerald-400" />
            Trafik Kaynakları
          </h4>
          <div className="space-y-2 pt-2">
            {stats?.trafficSources?.map((src) => (
              <div key={src.source} className="flex items-center justify-between text-xs font-mono bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="truncate pr-2">{src.source}</span>
                <span className="font-bold text-emerald-300 shrink-0">%{src.percentage} ({src.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Stream Terminal */}
      <div className="rounded-3xl border border-white/10 bg-black/80 p-6 backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Canlı Ziyaretçi Akış Terminali (Live Visitor Feed)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-neutral-500 w-16 shrink-0">{timeStr}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-neutral-300">
                    {item.city}, {item.country}
                  </span>
                  <span className="text-cyan-300 font-bold truncate max-w-xs">{item.path}</span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-neutral-400 shrink-0">
                  <span>{item.device} ({item.os})</span>
                  <span>•</span>
                  <span>{item.browser}</span>
                  <span>•</span>
                  <span className="text-neutral-500">{item.screen}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
