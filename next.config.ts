import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "api.dicebear.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // When Axios hits '/api/login', Next.js sends it to 'localhost:5000/login'
        destination: `${process.env.NEXT_PUBLIC_Backend_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
