/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: { domains: ["images.unsplash.com"], formats: ['image/avif', 'image/webp'], },
}

export default nextConfig