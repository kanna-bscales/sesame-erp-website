import type { MetadataRoute } from "next";
import { siteOrigin } from "@/content/chicago-event";

// Crawlers may read every page except the API routes. Pages that must stay out of search results
// (e.g. /plma-2026-terms until approved) use a `noindex` robots meta tag instead, which only
// works if crawlers are allowed to fetch them.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteOrigin}/sitemap.xml`,
    host: siteOrigin,
  };
}
