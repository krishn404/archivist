import "@quarter/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  transpilePackages: ["@repo/ui", "@quarter/db"],
};

export default nextConfig;
