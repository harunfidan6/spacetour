import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yönetici Telemetrisi',
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsLayout({ children }: LayoutProps<'/admin/analitik'>) {
  return children;
}
