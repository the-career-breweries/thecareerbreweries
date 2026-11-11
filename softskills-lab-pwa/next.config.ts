import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/portal",
        destination: "/portal.html",
      },
      {
        source: "/portal-:code",
        destination: "/portal.html",
      },
      {
        source: "/hub",
        destination: "/portal.html",
      },
      {
        source: "/admin",
        destination: "/admin.html",
      },
      {
        source: "/api/:path*",
        destination: "https://tcb-sentinel.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
