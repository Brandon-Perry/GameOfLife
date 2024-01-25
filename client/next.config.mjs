/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.externals = {
      canvas: "canvas",
    };
    return config;
  },
};

export default nextConfig;
