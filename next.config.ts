import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/threejs-demo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/threejs-demo' : '',
  output: 'standalone',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
