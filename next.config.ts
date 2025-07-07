import type { NextConfig } from "next";
import { env } from "./src/config/env.mjs";

const appHost = env.APP_HOST ? new URL(env.APP_HOST).hostname : undefined;

const nextConfig: NextConfig = {
  webpack: (config: any) => {
    // Fix CSS processing issues in Docker
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  allowedDevOrigins: appHost ? [appHost] : [],
};

export default nextConfig;
