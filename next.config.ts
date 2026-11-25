import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets a Cloudflare quick tunnel (https://*.trycloudflare.com) load the dev server,
  // so the PLMA form can be tested over HTTPS. Has no effect on production builds.
  allowedDevOrigins: ["*.trycloudflare.com", "**.devtunnels.ms", "*.ngrok-free.app", "*.ngrok.app"],
  // Basic security headers on every response (SEO/technical audit, Nov 24, 2026). HSTS is already
  // sent by Vercel. No Content-Security-Policy yet: GTM and the Zoho webform would need an allowlist.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
