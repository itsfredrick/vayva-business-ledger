
import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Add other config here if needed
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  }
};

export default withSerwist(nextConfig);
