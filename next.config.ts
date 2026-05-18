import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'nnolxbvirgbxwovgnbzn.supabase.co' },
    ],
  },
};

export default nextConfig;
