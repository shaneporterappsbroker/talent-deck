/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/callback/kantata",
        destination: "/api/kantata/callback",
      },
    ];
  },
};

module.exports = nextConfig;
