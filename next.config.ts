import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        // destination: 'http://localhost:5000/:path*',
        destination: 'http://127.0.0.1:5000/:path*',
      },
    ];
  },
};

export default nextConfig;
