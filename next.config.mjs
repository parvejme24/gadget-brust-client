/** @type {import('next').NextConfig} */
const nextConfig = {
  // old URLs from before the role-based dashboard
  async redirects() {
    return [
      { source: "/dashboard/admin-profile", destination: "/dashboard/profile", permanent: true },
      { source: "/profile", destination: "/dashboard/profile", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // hosts used by the seed data in gadget-brust-server/data
      { protocol: 'https', hostname: 'cdn.dummyjson.com', pathname: '/**' },
      { protocol: 'https', hostname: 'fakestoreapi.com', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.simpleicons.org', pathname: '/**' },
      { protocol: 'https', hostname: 'api.dicebear.com', pathname: '/**' },
    ],
    // brand logos from simpleicons are SVG; the CSP sandboxes them so scripts can't run
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
