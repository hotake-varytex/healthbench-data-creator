/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable SWC minification for better performance
  swcMinify: true,

  // Optimize images if needed in the future
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // TypeScript configuration
  typescript: {
    // Don't fail production builds on type errors (CI will catch them)
    // In production, you may want to set this to true
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Don't run ESLint during builds (CI will handle this)
    ignoreDuringBuilds: false,
  },

  // Environment variables that should be available on the client
  env: {
    APP_VERSION: process.env.npm_package_version || '0.1.0',
  },
};

export default nextConfig;
