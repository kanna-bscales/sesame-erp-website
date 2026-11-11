import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { EventFaq } from "@/components/chicago-event/EventFaq";
import { eventIcons } from "@/components/chicago-event/icons";
import { OfferCard } from "@/components/chicago-event/OfferCard";
import { ZohoLeadForm } from "@/components/chicago-event/ZohoLeadForm";
import { PlmaHeadline } from "@/components/chicago-event/PlmaHeadline";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import {
  aboutSection,
  anchors,
  audienceSection,
  campaignChrome,
  capabilitiesSection,
  caseStudies,
  cta,
  eventSection,
  formSection,
  howSection,
  offerTerms,
  plmaEvent,
  plmaFaq,
  plmaHero,
  plmaSeo,
  whySection,
} from "@/content/chicago-event";
import { plmaDisclaimer, plmaLanding, plmaLandingFaq, plmaPagePath } from "@/content/plma-2026";
import { termsLinkLabel, termsPath } from "@/content/plma-2026-terms";

export const metadata: Metadata = {
  title: plmaSeo.title,
  description: plmaSeo.description,
  keywords: plmaSeo.keywords,
  alternates: { canonical: plmaSeo.url },
  openGraph: {
    title: plmaSeo.title,
    description: plmaSeo.description,
    url: plmaSeo.url,
    siteName: "SesameERP",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: plmaSeo.title,
    description: plmaSeo.description,
  },
};

const formHref = `#${anchors.form}`;
const eventHref = `#${anchors.event}`;

// Section rhythm: tighter than the homepage so the campaign reads as one focused page.
const band = "py-20 lg:py-28";
const sectionTitle = "heading-section text-[clamp(2rem,3.6vw,3.5rem)]";

export default function PlmaCampaignPage() {
  return (
    <main id="main">
      {/* Hero */}
      <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pb-24">
        <div className="page-container grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <PlmaHeadline
              eyebrow={plmaHero.eyebrow}
              lines={plmaHero.headline}
              second={plmaHero.headlineSecond}
            />
            <p className="font-semiwide mt-6 text-xl font-extrabold sm:text-2xl">
              <span>{plmaHero.highlight}</span>
            </p>
            <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-ink-soft">{plmaHero.description}</p>

            <ul className="mt-8 grid max-w-[36rem] gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {plmaHero.benefits.map((benefit) => {
                const Icon = eventIcons[benefit.icon];
                return (
                  <li key={benefit.label} className="flex items-center gap-3 font-medium">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sheet ring-1 ring-ink/10">
                      <Icon aria-hidden className="size-4 text-ballpoint-ink" />
                    </span>
                    {benefit.label}
                  </li>
                );
              })}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink href={formHref} magnetic>
                {cta.primary}
              </ButtonLink>
              <ButtonLink href={eventHref} variant="secondary">
                {cta.demo}
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              Offer terms apply.{" "}
              <Link href={termsPath} className="font-medium underline underline-offset-4 hover:text-ink">
                {termsLinkLabel}
              </Link>
            </p>
          </div>

          <div className="lg:col-span-5">
            <OfferCard />
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section id={anchors.form} aria-labelledby="form-heading" className="border-y border-rule bg-sheet">
        <div className={`page-container grid gap-12 lg:grid-cols-12 lg:gap-10 ${band}`}>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <h2 id="form-heading" className={sectionTitle}>
                {formSection.heading}
              </h2>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-soft">{formSection.intro}</p>
              <ul className="mt-8 space-y-3">
                {formSection.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check aria-hidden className="mt-1 size-5 shrink-0 text-ballpoint-ink" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={termsPath}
                className="mt-8 inline-block text-sm font-medium text-ink-soft underline underline-offset-4 hover:text-ink"
              >
                {termsLinkLabel}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ZohoLeadForm />
          </div>
        </div>
      </section>

      {/* About */}
      <section aria-labelledby="about-heading" className={`page-container ${band}`}>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 id="about-heading" className={sectionTitle}>
              {aboutSection.heading}
            </h2>
            <p className="mt-5 text-ink-soft">
              {campaignChrome.attribution.prefix}{" "}
              <a
                href={campaignChrome.attribution.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink underline underline-offset-4"
              >
                {campaignChrome.attribution.label}
              </a>
            </p>
          </div>
          <ScrollRevealText
            text={aboutSection.body}
            className="font-semiwide text-2xl leading-snug font-bold sm:text-[1.9rem] lg:col-span-7"
          />
        </div>
      </section>

      {/* Capabilities and audiences */}
      <section
        id={anchors.capabilities}
        aria-labelledby="capabilities-heading"
        className="border-y border-rule bg-sheet"
      >
        <div className={`page-container ${band}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="capabilities-heading" className={sectionTitle}>
              {capabilitiesSection.heading}
            </h2>
            <p className="max-w-md text-lg text-ink-soft">{capabilitiesSection.lead}</p>
          </div>

          {/* Six-column grid: three cards on the first row, the last two share the second row. */}
          <ul className="mt-12 grid gap-6 md:grid-cols-6">
            {capabilitiesSection.items.map((item, index) => {
              const Icon = eventIcons[item.icon];
              return (
                <li
                  key={item.title}
                  className={`${index < 3 ? "md:col-span-2" : "md:col-span-3"} group flex h-full flex-col rounded-md bg-paper p-7 ring-1 ring-ink/10 transition-[translate,box-shadow] duration-300 ease-press hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-canary)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:p-8`}
                >
                  <span className="flex size-12 items-center justify-center rounded-md bg-canary text-night">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="font-semiwide mt-6 text-2xl font-extrabold">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{item.body}</p>
                  {"learnMore" in item && item.learnMore && (
                    <Link
                      href={item.learnMore}
                      target="_blank"
                      className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 font-semibold text-ballpoint-ink underline-offset-4 hover:underline"
                    >
                      {capabilitiesSection.learnMoreLabel}
                      <span className="sr-only">
                        {" "}
                        about {item.title} (opens in a new tab)
                      </span>
                      <ArrowUpRight aria-hidden className="size-4" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-20 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="font-semiwide text-3xl font-extrabold">{audienceSection.heading}</h3>
            <p className="max-w-md text-ink-soft">{audienceSection.lead}</p>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {audienceSection.items.map((item) => {
              const Icon = eventIcons[item.icon];
              return (
                <li key={item.title} className="flex h-full flex-col border-t-2 border-ink pt-5">
                  <Icon aria-hidden className="size-6 text-ballpoint-ink" />
                  <p className="font-semiwide mt-4 text-lg leading-snug font-extrabold">{item.title}</p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* PLMA 2026 */}
      <section id={anchors.event} aria-labelledby="event-heading" className="on-ink bg-night text-white">
        <div className={`page-container grid gap-12 lg:grid-cols-12 lg:gap-10 ${band}`}>
          <div className="lg:col-span-6">
            <p className="text-night-soft">{eventSection.eyebrow}</p>
            <h2 id="event-heading" className={`${sectionTitle} mt-4`}>
              {eventSection.heading}
            </h2>
            <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-night-soft">{eventSection.body}</p>
            <div className="mt-9">
              <ButtonLink href={formHref} magnetic>
                {cta.productDemo}
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-night-soft">{eventSection.note}</p>
          </div>

          <div className="lg:col-span-6 lg:pt-2">
            <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {[{ label: "Event", value: plmaEvent.name }, ...plmaLanding.eventFacts].map((detail) => (
                <div key={detail.label} className="border-t-2 border-white/80 pt-4">
                  <dt className="text-night-soft">{detail.label}</dt>
                  <dd className="font-semiwide mt-2 text-xl leading-snug font-extrabold">{detail.value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={plmaEvent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 font-medium underline underline-offset-4 hover:text-canary"
            >
              {eventSection.officialLink}
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(opens plma.com in a new tab)</span>
            </a>
            <Link
              href={plmaPagePath}
              className="mt-3 block w-fit font-medium underline underline-offset-4 hover:text-canary"
            >
              {plmaLanding.guideLink}
            </Link>
            <p className="mt-6 max-w-[34rem] text-sm leading-relaxed text-night-soft">{plmaDisclaimer}</p>
          </div>
        </div>
      </section>

      {/* Private-label fit: short, offer-focused copy (the full PLMA guide lives on /plma-2026) */}
      <section aria-labelledby="plma-fit-heading" className="border-b border-rule bg-sheet">
        <div className={`page-container grid gap-12 lg:grid-cols-12 lg:gap-10 ${band}`}>
          <div className="lg:col-span-5">
            <h2 id="plma-fit-heading" className={sectionTitle}>
              {plmaLanding.fitHeading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">{plmaLanding.fitLead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <ButtonLink href={formHref}>{cta.primary}</ButtonLink>
              <Link href={plmaPagePath} className="font-medium underline underline-offset-4 hover:text-ink">
                {plmaLanding.guideLink}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ul className="space-y-5">
              {plmaLanding.fitItems.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <Check aria-hidden className="mt-1 size-5 shrink-0 text-ballpoint-ink" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-soft">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-soft">{plmaLanding.fitNote}</p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section aria-labelledby="why-heading" className={`page-container ${band}`}>
        <h2 id="why-heading" className={sectionTitle}>
          {whySection.heading}
        </h2>
        <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {whySection.items.map((item) => (
            <li key={item.title} className="border-t-2 border-ink pt-6">
              <h3 className="font-semiwide text-xl font-extrabold">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* How the offer works — a real sequence, so the steps are numbered */}
      <section id={anchors.how} aria-labelledby="how-heading" className="border-t border-rule">
        <div className={`page-container ${band}`}>
          <h2 id="how-heading" className={`${sectionTitle} max-w-4xl`}>
            {howSection.heading}
          </h2>
          <ol className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
            {howSection.steps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-ink pt-5">
                <span className="font-semiwide text-3xl font-extrabold text-ballpoint-ink tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semiwide mt-3 text-xl font-extrabold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="on-canary bg-canary text-night">
          <div className="page-container grid items-center gap-8 py-14 lg:grid-cols-12 lg:py-16">
            <div className="lg:col-span-8">
              <h2 className="font-wide text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.02] font-extrabold">
                {howSection.banner.heading}
              </h2>
              <p className="mt-3 max-w-2xl text-lg">{howSection.banner.body}</p>
              <Link href={termsPath} className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">
                {termsLinkLabel}
              </Link>
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <ButtonLink href={formHref} magnetic className="h-15 px-8 text-lg">
                {cta.primary}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Case studies: rendered only when approved SesameERP case studies exist */}
      {caseStudies.length > 0 && (
        <section aria-labelledby="cases-heading" className={`page-container ${band}`}>
          <h2 id="cases-heading" className={sectionTitle}>
            Client success stories
          </h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {caseStudies.map((item) => (
              <li key={item.client} className="rounded-md bg-sheet p-7 ring-1 ring-ink/10">
                <h3 className="font-semiwide text-2xl font-extrabold">{item.client}</h3>
                <p className="mt-3 text-ink-soft">{item.overview}</p>
                <p className="mt-3">{item.solution}</p>
                {item.outcome && <p className="mt-3 font-semibold">{item.outcome}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ, with the offer terms underneath */}
      <EventFaq id={anchors.faq} heading={plmaFaq.heading} items={[...plmaFaq.items, ...plmaLandingFaq]}>
        <details id={anchors.terms} open className="group mt-10 rounded-md bg-sheet ring-1 ring-ink/10">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold [&::-webkit-details-marker]:hidden">
            {offerTerms.summary}
            <ChevronDown aria-hidden className="size-5 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-rule px-6 pt-4 pb-6">
            <ul className="space-y-2">
              {offerTerms.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-ballpoint-ink" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-soft">{offerTerms.pending}</p>
            <Link
              href={termsPath}
              className="mt-4 inline-block font-medium text-ballpoint-ink underline underline-offset-4"
            >
              Read the full {termsLinkLabel}
            </Link>
          </div>
        </details>
      </EventFaq>
    </main>
  );
}
