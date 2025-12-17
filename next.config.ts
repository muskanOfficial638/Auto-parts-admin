import type { NextConfig } from "next";
import type { RuleSetRule } from "webpack";

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
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     // issuer: /\.[jt]sx?$/,  //new line
  //     use: ["@svgr/webpack"],
  //   });
  //   return config;
  // },

  webpack(config) {
    // Remove Next.js's built-in SVG handling
    config.module.rules.forEach((rule:RuleSetRule) => {
      if (rule.test?.toString().includes("svg")) {
        rule.exclude = /\.svg$/i;
      }
    });

    // Add SVGR loader
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
