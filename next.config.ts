import type { NextConfig } from "next";

/**
 * When you open the dev server from another device (e.g. http://192.168.x.x:3000),
 * Next.js blocks WebSocket + some /_next dev requests unless the browser origin host
 * is listed here. Set in .env.local, comma-separated if needed:
 *
 * NEXT_DEV_ALLOWED_HOSTS=192.168.1.86
 *
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
 */
const allowedDevOrigins =
  process.env.NEXT_DEV_ALLOWED_HOSTS?.split(",")
    .map((h) => h.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  ...(allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
  /** Native/pdfjs deps break when bundled into Route Handlers on some setups. */
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
};

export default nextConfig;
