// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      root: __dirname, // Fuerza el root correcto
    },
  },
};

module.exports = nextConfig;
