/** @type {import('next').NextConfig} */
// Phase 2: real server app (deploy to Vercel). The Phase-1 static export
// config (output:"export" + basePath) lives on the gh-pages snapshot only.
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
