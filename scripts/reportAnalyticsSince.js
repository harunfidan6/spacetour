// reportAnalyticsSince.js – prints analytics data from 2026-10-03 22:00 (UTC+3) onward
// This script reproduces the demo seeding logic from src/lib/analyticsStore.ts
// and then filters records/events that occurred after the cutoff.

// Helper: random integer in [0, max)
function randInt(max) {
  return Math.floor(Math.random() * max);
}

// Seed data generation (mirrors getBaselineRecords)
function generateBaselineRecords() {
  const sampleCities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Kocaeli', 'Gaziantep'];
  const samplePages = [
    { path: '/', title: 'SpaceTour TR • Ana Sayfa' },
    { path: '/astroloji', title: 'Astroloji & Doğum Haritası' },
    { path: '/harita', title: '3D İnteraktif Gökyüzü Haritası' },
    { path: '/ansiklopedi', title: 'Güneş Sistemi Ansiklopedisi' },
    { path: '/ansiklopedi/dunya', title: 'Dünya • 3D Hologram' },
    { path: '/ansiklopedi/mars', title: 'Mars • Kızıl Gezegen' },
    { path: '/takvim', title: 'Kozmik Gökyüzü Olay Takvimi' },
    { path: '/gozlemevi', title: 'Gözlemevi & Uzay Telemetrisi' }
  ];
  const sampleBrowsers = ['Chrome', 'Safari', 'Chrome', 'Edge', 'Firefox'];
  const sampleDevices = ['Mobil', 'Mobil', 'Masaüstü', 'Masaüstü', 'Tablet'];

  const now = Date.now();
  const records = [];
  for (let i = 0; i < 48; i++) {
    const ageMs = Math.random() * (24 * 60 * 60 * 1000); // within last 24h
    const p = samplePages[randInt(samplePages.length)];
    const dev = sampleDevices[randInt(sampleDevices.length)];
    const os = dev === 'Mobil' ? (Math.random() > 0.4 ? 'iOS' : 'Android') : 'Windows';
    records.push({
      id: `seed-${i}`,
      timestamp: now - ageMs,
      path: p.path,
      title: p.title,
      referrer: Math.random() > 0.5 ? 'direct' : 'https://www.google.com',
      ipHash: `usr-${i % 22}`,
      country: 'Türkiye',
      city: sampleCities[randInt(sampleCities.length)],
      device: dev,
      browser: sampleBrowsers[randInt(sampleBrowsers.length)],
      os,
      screen: dev === 'Mobil' ? '390x844' : '1920x1080',
      sessionId: `sess-${i % 25}`,
      // optional duration field not used in report
    });
  }
  // sort newest first
  records.sort((a, b) => b.timestamp - a.timestamp);
  return records;
}

// Generate demo records (no persistent storage).
const records = generateBaselineRecords();

// No custom events in demo seed – create empty array.
const customEvents = [];

// Cutoff: 2026-10-03 22:00 (UTC+3) => 2026-10-03T19:00:00Z
const cutoffMs = new Date('2026-10-03T19:00:00Z').getTime();

const recentRecords = records.filter(r => r.timestamp >= cutoffMs);
const recentEvents = customEvents.filter(e => e.timestamp >= cutoffMs);

function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] ?? 'Diğer';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

const report = {
  from: '2026-10-03 22:00 (UTC+3)',
  to: new Date().toISOString(),
  totalPageViews: recentRecords.length,
  uniqueVisitors: new Set(recentRecords.map(r => r.ipHash)).size,
  deviceBreakdown: countBy(recentRecords, 'device'),
  browserBreakdown: countBy(recentRecords, 'browser'),
  osBreakdown: countBy(recentRecords, 'os'),
  topPages: (() => {
    const map = countBy(recentRecords, 'path');
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));
  })(),
  recentCustomEvents: recentEvents.slice(0, 20).map(e => ({
    id: e.id,
    type: e.type,
    label: e.label,
    path: e.path,
    timestamp: new Date(e.timestamp).toISOString(),
    metadata: e.metadata || null
  }))
};

console.log(JSON.stringify(report, null, 2));
