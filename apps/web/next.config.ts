import type { NextConfig } from 'next';

/**
 * DhakaFin web — Next.js configuration (Phase 1 · DF-P1-002)
 *
 * Notes:
 * - `allowedDevOrigins` permits the sandbox/preview proxy host to request the dev server
 *   (required so the live preview works). Add your own preview/deploy hosts here.
 * - Security headers are applied globally from Phase 1; the CSP is tightened with nonces
 *   in Phase 5 (DF-P5-017) when the portal and third-party scripts are wired in.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Dev-server origins allowed to load resources (preview proxies, LAN devices).
  allowedDevOrigins: ['*.e2b.app', 'localhost', '127.0.0.1'],

  experimental: {
    optimizePackageImports: ['@dhakafin/tokens'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), geolocation=(), microphone=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
