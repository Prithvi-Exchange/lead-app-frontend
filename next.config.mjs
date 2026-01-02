/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export a static site so the GitHub Action can upload ./out to S3
  output: 'export',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
