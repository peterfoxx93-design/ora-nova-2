const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "x-vercel-ai-enabled",
            value: "false",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
