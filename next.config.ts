import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      {
        protocol: 'http',  // or 'https' depending on the protocol of your image URL
        hostname: '54.80.119.79',  // the domain or IP address of the image source
        pathname: '/image/**',  // the path pattern that matches the image URL
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
