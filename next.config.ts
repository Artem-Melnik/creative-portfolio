import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  // basePath: "/creative-portfolio",
  // assetPrefix: "/creative-portfolio",
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  output: "export",
  allowedDevOrigins: ['192.168.0.237:3000'],
  env: {
    NEXT_PUBLIC_URL: "/creative-portfolio",
    // PUBLIC_URL: "https://artem-melnik.github.io/creative-portfolio",
  },
};

export default nextConfig;