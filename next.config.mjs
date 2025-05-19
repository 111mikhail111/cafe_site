/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Игнорировать ESLint при сборке
  },
};

export default nextConfig;
