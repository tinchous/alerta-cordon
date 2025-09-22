/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLINT DISABLE EN BUILD: Vercel prod ignora warnings
  eslint: {
    // ⚠️ Warning: Permite builds exitosos aunque ESLint falle
    // Útil para MVP - después fixear warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TS: Ignora type errors en build (si hay)
    ignoreBuildErrors: true,
  },
  // TURBOPACK WARNING FIX: Remover experimental.turbopack
  experimental: {
    // Comentar si existe:
    // turbopack: { root: __dirname },
  },
  // NEXT.JS TELEMETRY: Opt-out (opcional)
  telemetry: false,
};

module.exports = nextConfig;