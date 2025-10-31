import { config } from "dotenv";
import type { NextConfig } from "next";
config();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['media.geeksforgeeks.org','cdn.ttgtmedia.com', 'www.ibm.com'],
  },
};

export default nextConfig;
