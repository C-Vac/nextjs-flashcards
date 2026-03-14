import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  crossOrigin: "anonymous",
  allowedDevOrigins: [
    "http://goblian.lan",
    "https://goblian.lan",
    "http://localhost:3000",
    "https://localhost:3000",
  ],
  trailingSlash: true,
  basePath: "",
  async rewrites() {
    return [
      {
        source: "/api/generate-flashcards/:path*",
        destination: "http://localhost:3001/api/generate-flashcards/:path*",
      },
      {
        source: "/api/suggest-improvements/:path*",
        destination: "http://localhost:3001/api/suggest-improvements/:path*",
      },
    ];
  },
};

export default nextConfig;
