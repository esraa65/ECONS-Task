/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/clone.html",
        },
      ],
    };
  },
};

export default nextConfig;
