import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, CircleAlert, Clock, Download, Info, ShieldCheck, X } from "lucide-react";
import { EventFaq } from "@/components/chicago-event/EventFaq";
import { PrintButton } from "@/components/chicago-event/PrintButton";
import { TermsToc } from "@/components/chicago-event/TermsToc";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  campaignHref,
  pdf,
  termsContact,
  termsFaq,
  termsHero,
  termsMeta,
  termsReadingMinutes,
  termsSections,
  termsSeo,
  termsStatus,
  termsSummary,
  type Callout,
  type TermsSection,
} from "@/content/plma-2026-terms";

export const metadata: Metadata = {
  title: termsSeo.title,
  description: termsSeo.description,
  alternates: { canonical: termsSeo.url },
  // Out of search results until the business signs off for launch (termsStatus.indexable).
  robots: termsStatus.indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: termsSeo.title,
    description: termsSeo.description,
    url: termsSeo.url,
    siteName: "SesameERP",
    type: "article",
  },
};

const readingMinutes = termsReadingMinutes();

// Printing keeps only the terms: no site header, footer, navigation or buttons, and always light ink on paper.
const printCss = `
@media print {
  header, footer, .lamplight, [data-print="hide"] { display: none !important; }
  :root, :root[data-theme="dark"] {
    --color-ink: #16171b; --color-ink-soft: #4d4f57; --color-paper: #ffffff; --color-sheet: #ffffff;
    --color-rule: #d9d9dd; --color-ballpoint-ink: #c8000c; --color-highlight: #ffd84d;
  }
  html, body { background: #fff !important; }
  #terms-faq { display: none !important; }
  aside, article ol ol > li, .print-avoid { break-inside: avoid; }
  article h2 { break-after: avoid; }
  a { text-decoration: none; }
}`;

export default function PlmaTermsPage() {
  return (
    <main id="main">
      <style>{printCss}</style>

      {/* Hero */}
      <section id="top" className="border-b border-rule pt-28 pb-12 sm:pt-32 lg:pb-14">
        <div className="page-container">
          <nav aria-label="Breadcrumb" data-print="hide">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={campaignHref} className="transition-colors hover:text-ink">
                  PLMA 2026 offer
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="font-medium text-ink">
                {termsHero.breadcrumb}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-rule bg-sheet px-3.5 py-1.5 text-sm font-medium">
                <ShieldCheck aria-hidden className="size-4 text-ballpoint-ink" />
                {termsHero.eyebrow}
              </p>
              <h1 className="font-wide mt-5 text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.03] font-extrabold text-balance">
                {termsHero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{termsHero.summary}</p>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-md bg-sheet p-5 text-[0.95rem] ring-1 ring-ink/10 lg:col-span-4">
              {[
                ["Offer updated", termsMeta.updated],
                ["Effective date", termsMeta.effective],
                ["Offer sponsor", termsMeta.sponsor],
                ["Product", termsMeta.product],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-ink-soft">{label}</dt>
                  <dd className="mt-0.5 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Offer highlights">
            {termsHero.badges.map((badge) => (
              <li
                key={badge}
                className="flex items-center gap-3 rounded-md bg-sheet px-4 py-3.5 font-semibold ring-1 ring-ink/10"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-canary text-night">
                  <Check aria-hidden className="size-4" strokeWidth={3} />
                </span>
                {badge}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3" data-print="hide">
            <ButtonLink href={campaignHref} variant="secondary" className="h-11 px-4 text-[0.95rem]">
              <ArrowLeft aria-hidden className="size-4" />
              {termsHero.backToCampaign}
            </ButtonLink>
            <PrintButton label={termsHero.print} />
            <a
              href={pdf.href}
              download={pdf.fileName}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-ink/25 px-4 text-[0.95rem] font-semibold transition-colors hover:border-ink hover:bg-sheet"
            >
              <Download aria-hidden className="size-4" />
              {termsHero.downloadPdf}
              <span className="sr-only"> of the offer terms (version {pdf.version})</span>
            </a>
            <p className="flex items-center gap-2 text-sm text-ink-soft sm:ml-2">
              <Clock aria-hidden className="size-4" />
              {readingMinutes} min read · Last updated {termsMeta.updated}
            </p>
          </div>
        </div>
      </section>

      {/* Terms */}
      <div className="page-container grid gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <nav aria-label="On this page" className="lg:col-span-3" data-print="hide">
          <div className="lg:sticky lg:top-28 lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto lg:pb-6">
            <p className="text-sm font-semibold">On this page</p>
            <TermsToc items={termsSections.map(({ id, title }) => ({ id, title }))} />
            <a
              href="#terms-faq"
              className="mt-3 block pl-4 text-[0.95rem] text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Offer terms FAQ
            </a>
          </div>
        </nav>

        <article className="max-w-[48rem] lg:col-span-9">
          <CalloutBox
            callout={{ tone: "important", title: termsSummary.title, items: termsSummary.items }}
            className="mb-12"
          />

          <ol className="space-y-12">
            {termsSections.map((section, index) => (
              <li key={section.id} id={section.id} className="border-t-2 border-ink pt-6">
                <h2 className="font-semiwide flex gap-3 text-2xl font-extrabold sm:text-[1.6rem]">
                  <span className="text-ballpoint-ink tabular-nums">{index + 1}.</span>
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-[1.0625rem] leading-[1.75]">
                  <SectionBody section={section} />
                </div>
              </li>
            ))}
          </ol>
        </article>
      </div>

      {/* Print and PDF only: the FAQ as a plain list (the accordion is hidden when printing). */}
      <section aria-hidden="true" className="page-container hidden pb-10 print:block">
        <h2 className="font-semiwide border-t-2 border-ink pt-6 text-2xl font-extrabold">{termsFaq.heading}</h2>
        <dl className="mt-4 max-w-[48rem] space-y-4">
          {termsFaq.items.map((item) => (
            <div key={item.q} className="print-avoid">
              <dt className="font-semibold">{item.q}</dt>
              <dd className="mt-1 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <EventFaq id="terms-faq" heading={termsFaq.heading} items={termsFaq.items}>
        <div
          data-print="hide"
          className="mt-12 rounded-md bg-sheet p-7 ring-1 ring-ink/10 shadow-[6px_6px_0_var(--color-canary)] dark:shadow-[6px_6px_0_var(--color-canary),0_0_80px_-30px_var(--color-canary)]"
        >
          <p className="font-semiwide text-2xl font-extrabold">Ready to apply?</p>
          <p className="mt-2 text-ink-soft">
            PLMA 2026 attendees can request complimentary development of one approved ERP module, with development services valued up to
            US$5,000, through SesameERP.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <ButtonLink href={`${campaignHref}#register`}>{termsHero.request}</ButtonLink>
            <ButtonLink href={campaignHref} variant="secondary">
              {termsHero.backToCampaign}
            </ButtonLink>
          </div>
        </div>
      </EventFaq>
    </main>
  );
}

const calloutStyles: Record<Callout["tone"], { box: string; icon: typeof Info }> = {
  important: { box: "bg-canary/25 ring-1 ring-canary dark:bg-canary/10", icon: Info },
  limitation: { box: "bg-sheet ring-1 ring-ink/20", icon: CircleAlert },
  approval: { box: "bg-sheet border-l-4 border-ballpoint ring-1 ring-ink/10", icon: ShieldCheck },
};

function CalloutBox({ callout, className = "" }: { callout: Callout; className?: string }) {
  const style = calloutStyles[callout.tone];
  const Icon = style.icon;
  return (
    <aside aria-label={callout.title} className={`rounded-md p-5 sm:p-6 ${style.box} ${className}`}>
      <p className="flex items-center gap-2.5 font-semibold">
        <Icon aria-hidden className="size-5 shrink-0 text-ballpoint-ink" />
        {callout.title}
      </p>
      {callout.text && <p className="mt-2 leading-relaxed">{callout.text}</p>}
      {callout.items && (
        <ul className="mt-3 space-y-2">
          {callout.items.map((item) => (
            <li key={item} className="flex items-start gap-3 leading-relaxed">
              <Check aria-hidden className="mt-1.5 size-4 shrink-0 text-ballpoint-ink" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function SectionBody({ section }: { section: TermsSection }) {
  return (
    <>
      {section.blocks.map((block, index) => {
        switch (block.type) {
          case "p":
            return <p key={index}>{block.text}</p>;
          case "list":
            return (
              <div key={index}>
                {block.lead && <p>{block.lead}</p>}
                <ul className="mt-2 space-y-1.5 pl-1">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "includes":
          case "excludes": {
            const included = block.type === "includes";
            return (
              <div key={index} className="rounded-md bg-sheet p-5 ring-1 ring-ink/10">
                <p className="font-semibold">{block.title}</p>
                <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      {included ? (
                        <Check aria-hidden className="mt-1.5 size-4 shrink-0 text-ballpoint-ink" strokeWidth={3} />
                      ) : (
                        <X aria-hidden className="mt-1.5 size-4 shrink-0 text-ink-soft" strokeWidth={3} />
                      )}
                      <span>
                        <span className="sr-only">{included ? "Included: " : "Not included: "}</span>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          case "steps":
            return (
              <ol key={index} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {block.items.map((step, n) => (
                  <li key={step.title} className="rounded-md bg-sheet p-4 ring-1 ring-ink/10">
                    <span className="font-semiwide text-sm font-extrabold text-ballpoint-ink tabular-nums">
                      Step {n + 1}
                    </span>
                    <p className="mt-1 font-semibold">{step.title}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{step.body}</p>
                  </li>
                ))}
              </ol>
            );
          case "callout":
            return <CalloutBox key={index} callout={block.callout} />;
          case "contact":
            return (
              <div key={index} className="grid gap-4 rounded-md bg-sheet p-6 ring-1 ring-ink/10 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <p className="font-semiwide text-xl font-extrabold">{termsContact.company}</p>
                  <p className="text-sm text-ink-soft">Offer sponsor</p>
                </div>
                <ContactItem label="Website" href={termsContact.website.href} text={termsContact.website.label} external />
                <ContactItem label="SesameERP" href={termsContact.product.href} text={termsContact.product.label} external />
                <ContactItem
                  label="Email"
                  href={`mailto:${termsContact.email}?subject=${encodeURIComponent("PLMA 2026 complimentary ERP module offer")}`}
                  text={termsContact.email}
                />
              </div>
            );
        }
      })}
    </>
  );
}

function ContactItem({ label, href, text, external = false }: { label: string; href: string; text: string; external?: boolean }) {
  return (
    <div>
      <p className="text-sm text-ink-soft">{label}</p>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-medium break-all text-ballpoint-ink underline underline-offset-4"
      >
        {text}
      </a>
    </div>
  );
}
