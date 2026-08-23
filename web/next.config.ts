import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  typescript: { ignoreBuildErrors: true },
  // @ts-ignore
  allowedDevOrigins: [
    '192.168.29.36',
    'localhost:3000',
    '127.0.0.1:3000'
  ]
};

export default nextConfig;
