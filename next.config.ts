import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets a Cloudflare quick tunnel (https://*.trycloudflare.com) load the dev server,
  // so the PLMA form can be tested over HTTPS. Has no effect on production builds.
  allowedDevOrigins: ["*.trycloudflare.com", "**.devtunnels.ms", "*.ngrok-free.app", "*.ngrok.app"],
  /* config options here */
};

export default nextConfig;
