import { readFileSync } from "node:fs";
import path from "node:path";
import { campaignPath } from "@/content/chicago-event";
import { blogPath, postUrl, visiblePosts, type BlogPost } from "@/content/blog/posts";
import { plmaPagePath } from "@/content/plma-2026";
import { headingsOf, linksOf, parseMarkdown } from "./markdown";

// Pages a blog post may link to: the indexable public pages plus published posts (drafts too, but
// only under `npm run dev`). Hidden pages (industry pages, Wireless ERP, the noindex terms page)
// are deliberately excluded.
const PUBLIC_PAGES = ["/", plmaPagePath, campaignPath, "/about", "/contact", blogPath];

export function allowedInternalPaths() {
  return new Set([...PUBLIC_PAGES, ...visiblePosts().map((p) => postUrl(p.slug))]);
}

/**
 * Build-time link check: throws (and so fails `next build`) when a published post links to an
 * unknown, hidden or draft page, uses a non-https external link, or lists an unpublished related
 * post. Fragments (#…) are allowed on known pages.
 */
function checkLinks(post: BlogPost, source: string) {
  const allowed = allowedInternalPaths();
  const problems: string[] = [];
  const hrefs = [...linksOf(source), ...post.sources.map((s) => s.href), post.cta.href];
  for (const href of hrefs) {
    if (href.startsWith("/")) {
      if (!allowed.has(href.split("#")[0])) problems.push(`internal link to an unpublished or hidden page: ${href}`);
    } else if (!/^https:\/\/[^\s]+$/.test(href)) {
      problems.push(`external link must be https: ${href}`);
    }
  }
  for (const slug of post.related) {
    if (!allowed.has(postUrl(slug))) problems.push(`related post is not published: ${slug}`);
  }
  if (problems.length) throw new Error(`Blog post "${post.slug}":\n- ${problems.join("\n- ")}`);
}

export function loadPost(post: BlogPost) {
  const file = path.join(process.cwd(), "content", "blog", `${post.slug}.md`);
  const source = readFileSync(file, "utf8");
  checkLinks(post, source);
  const blocks = parseMarkdown(source);
  return { blocks, headings: headingsOf(blocks).filter((h) => h.level === 2) };
}
