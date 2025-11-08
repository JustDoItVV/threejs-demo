import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.BASE_PATH || '',
  output: 'standalone',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
