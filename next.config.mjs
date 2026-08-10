/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // canonical URL 唯一化（哥飞 TDH）：统一无尾斜杠，
  // 与 lib/seo.ts 的 buildMetadata 中 path 拼接保持一致。
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "humanphenotypes.net",
      },
      {
        protocol: "https",
        hostname: "thepostnationalmonitor.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
