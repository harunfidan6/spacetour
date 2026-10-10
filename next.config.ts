import type { NextConfig } from "next";
import eventRedirects from "./src/data/eventRedirects.json";

// Burç uyumu ikilileri tek adreste (burç sırasıyla); ters sıra kalıcı olarak yönlenir: aslan-koc → koc-aslan
const SIGNS = ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak', 'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'];
const reversedPairs = SIGNS.flatMap((a, i) =>
  SIGNS.slice(0, i).map((b) => ({ source: `/astroloji/burc-uyumu/${a}-${b}`, destination: `/astroloji/burc-uyumu/${b}-${a}`, permanent: true }))
);

const nextConfig: NextConfig = {
  // www.spacetour.com.tr aynı içeriği ikinci bir adreste sunmasın
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.spacetour.com.tr' }],
        destination: 'https://spacetour.com.tr/:path*',
        permanent: true,
      },
      // Kaldırılan dikey yükseliş simülatörü
      { source: '/yolculuk/atmosfer', destination: '/yolculuk', permanent: true },
      ...reversedPairs,
      // Tarihi düzeltilen gök olayları: eski (yanlış tarihli) adresler doğrusuna
      ...eventRedirects.map((r) => ({ ...r, permanent: true })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
