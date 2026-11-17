import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { EventFaq } from "@/components/chicago-event/EventFaq";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { plmaDisclaimer, plmaFacts, plmaPage, plmaPageSeo, plmaPageUrl, plmaSources } from "@/content/plma-2026";

// Informational SEO page. The conversion page (offer + form) stays /chicago-event.

export const metadata: Metadata = {
  title: plmaPageSeo.title,
  description: plmaPageSeo.description,
  keywords: plmaPageSeo.keywords,
  alternates: { canonical: plmaPageUrl },
  openGraph: {
    title: plmaPageSeo.title,
    description: plmaPageSeo.description,
    url: plmaPageUrl,
    siteName: "SesameERP",
    type: "article",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: plmaPageSeo.title, description: plmaPageSeo.description },
};

const band = "py-16 lg:py-24";
const sectionTitle = "heading-section text-[clamp(1.9rem,3.2vw,3rem)]";

function jsonLd() {
  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: plmaFacts.showName,
    description: `PLMA's annual private label trade show in Chicago, themed "${plmaFacts.theme}".`,
    startDate: plmaFacts.startDate,
    endDate: plmaFacts.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: plmaFacts.officialUrl,
    // Trade show floor (Mon–Tue) and Sunday education / keynote breakfasts (PLMA schedule).
    location: [plmaFacts.venue, plmaFacts.educationVenue].map((name) => ({
      "@type": "Place",
      name,
      address: {
        "@type": "PostalAddress",
        addressLocality: plmaFacts.locality,
        addressRegion: plmaFacts.region,
        addressCountry: plmaFacts.country,
      },
    })),
    organizer: { "@type": "Organization", name: plmaFacts.organizer, url: plmaFacts.organizerUrl },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: plmaPage.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  // "<" escaped so the JSON can never close the script element.
  return JSON.stringify([event, faq]).replace(/</g, "\\u003c");
}

export default function Plma2026Page() {
  const p = plmaPage;
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />

      <section id="top" className="pt-28 pb-14 sm:pt-32 lg:pb-20">
        <div className="page-container grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="font-semibold text-ballpoint-ink">{p.hero.eyebrow}</p>
            <h1 className="font-wide mt-4 text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.05] font-extrabold">{p.hero.heading}</h1>
            <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-ink-soft">{p.hero.intro}</p>
            <p className="mt-4 max-w-[38rem] text-sm leading-relaxed text-ink-soft">{plmaDisclaimer}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href={p.hero.ctaHref}>{p.hero.cta}</ButtonLink>
              <a
                href={plmaFacts.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-4"
              >
                {p.hero.secondary}
                <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only"> (opens plma.com in a new tab)</span>
              </a>
            </div>
          </div>
          <aside aria-label="PLMA 2026 at a glance" className="lg:col-span-5">
            <dl className="rounded-xl bg-sheet p-6 ring-1 ring-ink/10 shadow-[6px_6px_0_var(--color-canary)] sm:p-8 dark:shadow-[6px_6px_0_var(--color-canary),0_0_80px_-30px_var(--color-canary)]">
              {p.quickFacts.map((fact) => (
                <div key={fact.label} className="border-b border-rule py-3 first:pt-0 last:border-b-0 last:pb-0">
                  <dt className="text-sm font-semibold text-ink-soft">{fact.label}</dt>
                  <dd className="mt-0.5 font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section aria-labelledby="what-is-plma" className="border-t border-rule">
        <div className={`page-container grid gap-12 lg:grid-cols-2 ${band}`}>
          <div>
            <h2 id="what-is-plma" className={sectionTitle}>
              {p.whatIsPlma.heading}
            </h2>
            {p.whatIsPlma.body.map((para) => (
              <p key={para} className="mt-5 text-lg leading-relaxed text-ink-soft">
                {para}
              </p>
            ))}
          </div>
          <div>
            <h2 className={sectionTitle}>{p.whatIs2026.heading}</h2>
            {p.whatIs2026.body.map((para) => (
              <p key={para} className="mt-5 text-lg leading-relaxed text-ink-soft">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="conference" className="border-y border-rule bg-sheet">
        <div className={`page-container ${band}`}>
          <h2 id="conference" className={sectionTitle}>
            {p.conference.heading}
          </h2>
          <p className="mt-5 max-w-[46rem] text-lg leading-relaxed text-ink-soft">{p.conference.lead}</p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {p.conference.items.map((item) => (
              <li key={item.title} className="rounded-lg bg-paper p-6 ring-1 ring-ink/10">
                <h3 className="font-semiwide text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
          <a
            href={plmaFacts.scheduleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 font-semibold underline underline-offset-4"
          >
            {p.conference.scheduleLink}
            <ArrowUpRight aria-hidden className="size-4" />
            <span className="sr-only"> (opens plma.com in a new tab)</span>
          </a>
        </div>
      </section>

      <section aria-labelledby="who-attends">
        <div className={`page-container grid gap-10 lg:grid-cols-12 ${band}`}>
          <div className="lg:col-span-4">
            <h2 id="who-attends" className={sectionTitle}>
              {p.whoAttends.heading}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{p.whoAttends.body}</p>
          </div>
          <ul className="grid gap-5 lg:col-span-8">
            {p.whoAttends.items.map((item) => (
              <li key={item.title} className="border-b border-rule pb-5">
                <h3 className="font-semiwide text-lg font-extrabold">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="challenges" className="border-t border-rule">
        <div className={`page-container ${band}`}>
          <h2 id="challenges" className={sectionTitle}>
            {p.challenges.heading}
          </h2>
          <p className="mt-5 max-w-[44rem] text-lg leading-relaxed text-ink-soft">{p.challenges.lead}</p>
          <ul className="mt-10 grid gap-x-10 gap-y-7 md:grid-cols-2">
            {p.challenges.items.map((item) => (
              <li key={item.title} className="flex gap-3">
                <Check aria-hidden className="mt-1 size-5 shrink-0 text-ballpoint-ink" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="erp-guide" className="border-t border-rule bg-sheet">
        <div className={`page-container ${band}`}>
          <h2 id="erp-guide" className={`${sectionTitle} max-w-4xl`}>
            {p.erpGuide.heading}
          </h2>
          <p className="mt-5 max-w-[46rem] text-lg leading-relaxed text-ink-soft">{p.erpGuide.intro}</p>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {p.erpGuide.topics.map((topic) => (
              <li key={topic.title} className="flex flex-col rounded-lg bg-paper p-6 ring-1 ring-ink/10">
                <h3 className="font-semiwide text-lg font-extrabold">{topic.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{topic.body}</p>
                <p className="mt-4 text-sm font-semibold">What to look for</p>
                <ul className="mt-2 space-y-2">
                  {topic.lookFor.map((item) => (
                    <li key={item} className="flex gap-2 text-[0.95rem] leading-relaxed">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-ballpoint-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-10 max-w-[46rem] border-l-4 border-ballpoint pl-5">
            <h3 className="font-semiwide text-xl font-extrabold">{p.erpGuide.choosing.heading}</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{p.erpGuide.choosing.body}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="why-erp" className="border-y border-rule">
        <div className={`page-container grid gap-12 lg:grid-cols-12 ${band}`}>
          <div className="lg:col-span-5">
            <h2 id="why-erp" className={sectionTitle}>
              {p.whyErp.heading}
            </h2>
            {p.whyErp.body.map((para) => (
              <p key={para} className="mt-5 text-lg leading-relaxed text-ink-soft">
                {para}
              </p>
            ))}
            <ul className="mt-5 space-y-2.5">
              {p.whyErp.checklist.map((item) => (
                <li key={item} className="flex gap-2.5 leading-relaxed">
                  <Check aria-hidden className="mt-1 size-4.5 shrink-0 text-ballpoint-ink" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <h2 className={sectionTitle}>{p.howWeHelp.heading}</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{p.howWeHelp.lead}</p>
            <ul className="mt-8 grid gap-5">
              {p.howWeHelp.items.map((item) => (
                <li key={item.title} className="rounded-lg bg-paper p-6 ring-1 ring-ink/10">
                  <h3 className="font-semiwide text-lg font-extrabold">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{item.body}</p>
                  <Link href={item.href} className="mt-3 inline-flex items-center gap-1 font-semibold text-ballpoint-ink underline-offset-4 hover:underline">
                    {item.link}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="offer">
        <div className={`page-container ${band}`}>
          <div className="rounded-xl bg-canary p-8 text-night sm:p-10">
            <h2 id="offer" className="font-semiwide text-2xl font-extrabold text-night">
              {p.offer.heading}
            </h2>
            <p className="mt-3 max-w-[46rem] text-lg leading-relaxed">
              {p.offer.body}{" "}
              <Link href={p.offer.linkHref} className="font-semibold underline underline-offset-4">
                {p.offer.linkLabel}
              </Link>{" "}
              {p.offer.linkAfter}
            </p>
          </div>
        </div>
      </section>

      <EventFaq heading={p.faq.heading} items={p.faq.items} showPending={false} id="faq" />

      <section aria-label="Sources" className="border-t border-rule">
        <div className="page-container py-10 text-sm text-ink-soft">
          <p>{p.sourcesLabel}</p>
          <ul className="mt-2 space-y-1">
            {plmaSources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
