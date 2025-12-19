import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "54.80.119.79",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
