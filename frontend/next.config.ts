import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_CONTRACT_ADDRESS: process.env.NEXT_CONTRACT_ADDRESS,
    NEXT_SIGNER_ADDRESS: process.env.NEXT_SIGNER_ADDRESS,
  },
};

export default nextConfig;
