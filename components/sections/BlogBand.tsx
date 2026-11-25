import Link from "next/link";
import { blogPath, publishedPosts, postUrl } from "@/content/blog/posts";
import { blogBand } from "@/content/home";

// Slim homepage band linking to the latest published blog article and the blog index.
export function BlogBand() {
  const latest = publishedPosts()[0];
  if (!latest) return null;
  const link = "font-semibold text-ink underline underline-offset-4 hover:text-ballpoint-ink";
  return (
    <section aria-label="Latest article" className="border-b border-rule">
      <p className="page-container flex flex-wrap items-baseline gap-x-3 gap-y-1 py-5 leading-relaxed text-ink-soft">
        <span className="rounded-full bg-ink px-2.5 py-0.5 text-sm font-semibold text-paper">{blogBand.label}</span>
        <span>
          {blogBand.before}{" "}
          <Link href={postUrl(latest.slug)} className={link}>
            {latest.title}
          </Link>{" "}
          {blogBand.middle}{" "}
          <Link href={blogPath} className={link}>
            {blogBand.blogLabel}
          </Link>
          {blogBand.after}
        </span>
      </p>
    </section>
  );
}
