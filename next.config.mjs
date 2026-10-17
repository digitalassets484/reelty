/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "reelty"; // GitHub Pages project path: digitalassets484.github.io/<repo>

const nextConfig = {
  output: "export", // static site for GitHub Pages
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
};

export default nextConfig;
