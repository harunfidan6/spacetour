import type { NextConfig } from "next";

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
