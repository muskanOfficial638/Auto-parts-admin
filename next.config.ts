import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.autopartsxchange.co.za",
 
      },
    ],
  },
};

export default nextConfig;
