import type { MetadataRoute } from "next";
import { campaignPath, siteOrigin } from "@/content/chicago-event";
import { blogPath, publishedPosts, postUrl } from "@/content/blog/posts";
import { plmaPagePath } from "@/content/plma-2026";

// Indexable public pages only. Not listed: /plma-2026-terms (noindex until approved), the
// industry and Wireless ERP pages hidden from navigation (showSolutions), and API routes.
// Personal links (?ref=…) are never listed. Blog: the index and every PUBLISHED post (drafts never).
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: `${siteOrigin}${path}`,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "monthly"),
    page(plmaPagePath, 0.9, "weekly"),
    page(campaignPath, 0.9, "weekly"),
    page("/about", 0.6, "monthly"),
    page("/contact", 0.6, "monthly"),
    page(blogPath, 0.7, "weekly"),
    ...publishedPosts().map((p) => ({ ...page(postUrl(p.slug), 0.7, "monthly"), lastModified: p.updated })),
  ];
}
