import type { NextConfig } from 'next';

/**
 * The browser only ever talks to this Next.js origin. `/api/*` is rewritten to the Express API,
 * so auth cookies stay first-party (no CORS, no third-party cookie blocking).
 */
const API_URL = process.env.API_URL ?? 'http://localhost:4000';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  rewrites() {
    return Promise.resolve([{ source: '/api/:path*', destination: `${API_URL}/api/:path*` }]);
  },
  headers() {
    return Promise.resolve([{ source: '/:path*', headers: securityHeaders }]);
  },
};

export default nextConfig;
