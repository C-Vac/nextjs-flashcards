import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
