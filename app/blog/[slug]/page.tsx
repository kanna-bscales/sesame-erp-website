import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { blogPath, postUrl, visiblePosts } from "@/content/blog/posts";
import { siteOrigin } from "@/content/chicago-event";
import { Markdown } from "@/lib/blog/markdown";
import { loadPost } from "@/lib/blog/posts.server";

// Only published posts exist (drafts too under `npm run dev`); any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return visiblePosts().map((p) => ({ slug: p.slug }));
}

const find = (slug: string) => visiblePosts().find((p) => p.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = find((await params).slug);
  if (!post) return {};
  const url = `${siteOrigin}${postUrl(post.slug)}`;
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: url },
    authors: [{ name: post.author }],
    ...(post.status === "draft" ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: post.seoTitle,
      description: post.description,
      url,
      siteName: "SesameERP",
      type: "article",
      locale: "en_US",
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: [post.author],
    },
    twitter: { card: "summary_large_image", title: post.seoTitle, description: post.description },
  };
}

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = find((await params).slug);
  if (!post) notFound();
  const { blocks, headings } = loadPost(post);
  const url = `${siteOrigin}${postUrl(post.slug)}`;
  const related = visiblePosts().filter((p) => post.related.includes(p.slug));

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      url,
      mainEntityOfPage: url,
      datePublished: post.published,
      dateModified: post.updated,
      inLanguage: "en-US",
      keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(", "),
      author: { "@type": "Organization", name: post.author, url: siteOrigin },
      publisher: { "@id": `${siteOrigin}/#organization` },
      image: `${url}/opengraph-image`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteOrigin}${blogPath}` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    // FAQPage only because the same questions and answers are visible on the page.
    ...(post.faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
  ];

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />

      <article>
        <header id="top" className="border-b border-rule pt-28 pb-12 sm:pt-32 lg:pb-16">
          <div className="page-container">
            {post.status === "draft" && (
              <p role="note" className="mb-5 inline-flex rounded-full bg-canary px-3 py-1 text-sm font-semibold text-night">
                Draft for review: only visible with npm run dev, not published
              </p>
            )}
            <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li>
                  <Link href="/" className="hover:text-ink hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href={blogPath} className="hover:text-ink hover:underline">
                    Blog
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink">
                  {post.title}
                </li>
              </ol>
            </nav>
            <h1 className="font-wide mt-6 max-w-4xl text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-extrabold">{post.title}</h1>
            <p className="mt-5 max-w-[42rem] text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
            <p className="mt-6 text-sm text-ink-soft">
              By <span className="font-semibold text-ink">{post.author}</span> ·{" "}
              <time dateTime={post.published}>{longDate(post.published)}</time>
              {post.updated !== post.published && (
                <>
                  {" "}
                  · Updated <time dateTime={post.updated}>{longDate(post.updated)}</time>
                </>
              )}{" "}
              · {post.readingMinutes} min read
            </p>
          </div>
        </header>

        <div className="page-container grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
          <aside className="lg:col-span-4 lg:order-last">
            <div className="lg:sticky lg:top-28">
              <nav aria-label="On this page" className="rounded-lg bg-paper p-5 ring-1 ring-ink/10">
                <p className="text-sm font-semibold">On this page</p>
                <ol className="mt-3 space-y-2 text-[0.95rem] leading-snug">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-ink-soft hover:text-ink hover:underline">
                        {h.text}
                      </a>
                    </li>
                  ))}
                  {post.faq.length > 0 && (
                    <li>
                      <a href="#faq" className="text-ink-soft hover:text-ink hover:underline">
                        Frequently asked questions
                      </a>
                    </li>
                  )}
                </ol>
              </nav>
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-8">
            <section aria-labelledby="key-takeaways" className="rounded-lg border-l-4 border-canary bg-sheet p-6 ring-1 ring-ink/10">
              <h2 id="key-takeaways" className="font-semiwide text-lg font-extrabold">
                Key takeaways
              </h2>
              <ul className="mt-3 space-y-2.5">
                {post.keyTakeaways.map((t) => (
                  <li key={t} className="flex gap-2.5 leading-relaxed">
                    <Check aria-hidden className="mt-1 size-4.5 shrink-0 text-ballpoint-ink" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>

            <div className="max-w-[44rem]">
              <Markdown blocks={blocks} />
            </div>

            {post.faq.length > 0 && (
              <section aria-labelledby="faq" className="mt-16 max-w-[44rem] border-t-2 border-ink pt-8">
                <h2 id="faq" className="font-wide scroll-mt-28 text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-extrabold">
                  Frequently asked questions
                </h2>
                {post.faq.map((f) => (
                  <div key={f.q} className="mt-7">
                    <h3 className="font-semiwide text-lg font-extrabold">{f.q}</h3>
                    <p className="mt-2 text-[1.05rem] leading-[1.7] text-ink-soft">{f.a}</p>
                  </div>
                ))}
              </section>
            )}

            {post.sources.length > 0 && (
              <section aria-labelledby="sources" className="mt-14 max-w-[44rem] rounded-lg bg-paper p-6 ring-1 ring-ink/10">
                <h2 id="sources" className="font-semiwide text-lg font-extrabold">
                  Sources
                </h2>
                <ol className="mt-3 list-decimal space-y-3 pl-5 text-[0.95rem] leading-relaxed text-ink-soft">
                  {post.sources.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} rel="noopener" className="font-semibold text-ink underline underline-offset-4 hover:text-ballpoint-ink">
                        {s.label}
                      </a>
                      . {s.note}
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-sm text-ink-soft">
                  Customer requirements quoted here are examples from individual companies, not universal rules. This article is general
                  information, not legal or regulatory advice.
                </p>
              </section>
            )}

            <section aria-labelledby="post-cta" className="mt-14 max-w-[44rem] rounded-lg bg-night p-8 text-white">
              <h2 id="post-cta" className="font-wide text-2xl font-extrabold">
                {post.cta.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-night-soft">{post.cta.body}</p>
              <div className="mt-6">
                <ButtonLink href={post.cta.href}>{post.cta.label}</ButtonLink>
              </div>
            </section>

            {related.length > 0 && (
              <section aria-labelledby="related" className="mt-14 max-w-[44rem]">
                <h2 id="related" className="font-semiwide text-xl font-extrabold">
                  Related articles
                </h2>
                <ul className="mt-4 space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={postUrl(r.slug)} className="inline-flex items-center gap-1 font-semibold text-ballpoint-ink hover:underline">
                        {r.title}
                        <ArrowUpRight aria-hidden className="size-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
