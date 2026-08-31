/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Use relative asset prefix or empty string for GitHub Pages static export
  // GitHub Pages handles base paths automatically when assets use relative links or assetPrefix: '.'
};

export default nextConfig;
