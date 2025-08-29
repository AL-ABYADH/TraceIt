import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_BASE_URL + "/:path*",
      },
      {
        source: "/socket.io/:path*",
        destination: process.env.API_BASE_URL + "/socket.io/:path*",
      },
    ];
  },
};

export default nextConfig;
