/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export a fully static site that can be loaded via file://
  output: 'export',
  // Use default asset paths (absolute /_next). We serve them via app:// protocol.
  // assetPrefix is intentionally omitted to avoid next/font constraints.
  // Ensure routes are directories so file:// lookups work
  trailingSlash: true,
  // Disable image optimization to avoid /_next/image requests
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
