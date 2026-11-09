import type { NextConfig } from "next";
import { monetization } from "./src/config/monetization";

const isProduction = process.env.NODE_ENV === "production";
const adsEnabled = Boolean(monetization.adsenseClient && monetization.topAdSlot);

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${adsEnabled ? " https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${adsEnabled ? " https:" : ""}`,
  "font-src 'self' data:",
  `connect-src 'self'${!isProduction ? " ws://localhost:*" : ""}${adsEnabled ? " https:" : ""}`,
  `frame-src ${adsEnabled ? "https://googleads.g.doubleclick.net https://tpc.googlesyndication.com" : "'none'"}`,
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProduction
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
    : []),
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
