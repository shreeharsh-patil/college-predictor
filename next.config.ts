import type { NextConfig } from "next";

// Both routes are static. Deploy out/ to a CDN; no Node server is required.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default nextConfig;
