import type { NextConfig } from "next";

const backendUrl: string = process.env.API_BACKEND_URL || "http://localhost:8081";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
