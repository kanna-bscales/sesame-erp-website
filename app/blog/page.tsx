import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogIndex, blogPath, postUrl, visiblePosts } from "@/content/blog/posts";
import { siteOrigin } from "@/content/chicago-event";

export const metadata: Metadata = {
  title: blogIndex.seoTitle,
  description: blogIndex.description,
  alternates: { canonical: `${siteOrigin}${blogPath}` },
  openGraph: {
    title: blogIndex.seoTitle,
    description: blogIndex.description,
    url: `${siteOrigin}${blogPath}`,
    siteName: "SesameERP",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: blogIndex.seoTitle, description: blogIndex.description },
};

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default function BlogIndexPage() {
  const posts = visiblePosts();
  return (
    <main id="main">
      <section id="top" className="border-b border-rule pt-28 pb-12 sm:pt-32 lg:pb-16">
        <div className="page-container">
          <p className="font-semibold text-ballpoint-ink">SesameERP blog</p>
          <h1 className="font-wide mt-4 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] font-extrabold">{blogIndex.heading}</h1>
          <p className="mt-5 max-w-[40rem] text-lg leading-relaxed text-ink-soft">{blogIndex.intro}</p>
        </div>
      </section>

      <section aria-label="Articles" className="page-container py-12 lg:py-16">
        <ul className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug} className="flex flex-col rounded-lg bg-sheet p-7 ring-1 ring-ink/10">
              <p className="text-sm text-ink-soft">
                {post.status === "draft" && <span className="mr-2 rounded-full bg-canary px-2 py-0.5 font-semibold text-night">Draft</span>}
                <time dateTime={post.published}>{longDate(post.published)}</time> · {post.readingMinutes} min read
              </p>
              <h2 className="font-semiwide mt-3 text-xl leading-snug font-extrabold">
                <Link href={postUrl(post.slug)} className="hover:text-ballpoint-ink hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{post.excerpt}</p>
              <Link
                href={postUrl(post.slug)}
                aria-label={`Read: ${post.title}`}
                className="mt-5 inline-flex items-center gap-1.5 font-semibold text-ballpoint-ink hover:underline"
              >
                Read the article
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
