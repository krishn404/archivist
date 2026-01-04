import "@archivist/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  transpilePackages: ["@repo/ui", "@archivist/db"],
};

export default nextConfig;
