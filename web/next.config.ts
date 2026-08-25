import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  typescript: { ignoreBuildErrors: true },
  // @ts-ignore
  allowedDevOrigins: [
    '192.168.29.36',
    '172.16.45.34',
    '10.180.254.52',
    'localhost:3000',
    '127.0.0.1:3000',
    '172.16.67.228',
    '172.16.67.228:3000',
    '10.0.2.2',
    '10.0.2.2:3000'
  ]
};

export default nextConfig;
