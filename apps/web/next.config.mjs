/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@codeguard/types',
    '@codeguard/policy',
    '@codeguard/commitment',
    '@codeguard/scanner',
    '@codeguard/contract'
  ]
};

export default nextConfig;
