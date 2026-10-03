export interface PageViewRecord {
  id: string;
  timestamp: number;
  path: string;
  title: string;
  referrer: string;
  ipHash: string;
  country: string;
  city: string;
  device: 'Mobil' | 'Masaüstü' | 'Tablet';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Diğer';
  os: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Diğer';
  screen: string;
  sessionId: string;
  duration?: number;
}

export interface CustomEventRecord {
  id: string;
  timestamp: number;
  type: string;
  label: string;
  path: string;
  metadata?: Record<string, unknown>;
  sessionId: string;
}

export interface AnalyticsStatsResponse {
  activeVisitorsNow: number;
  totalPageviews: number;
  uniqueVisitors: number;
  avgDurationSeconds: number;
  topPages: { path: string; title: string; views: number; percentage: number }[];
  topCities: { city: string; country: string; count: number; percentage: number }[];
  topCountries: { country: string; count: number; percentage: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  browserBreakdown: { browser: string; count: number; percentage: number }[];
  osBreakdown: { os: string; count: number; percentage: number }[];
  trafficSources: { source: string; count: number; percentage: number }[];
  recentEvents: CustomEventRecord[];
  recentStream: PageViewRecord[];
  hourlyTimeline: { hour: string; views: number; uniques: number }[];
  isPersistent?: boolean;
}
