import Link from "next/link";
import { FinalCta } from "@/components/sections/FinalCta";
import { PriceChain } from "@/components/sections/manufacturing/PriceChain";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LetterTitle } from "@/components/ui/LetterTitle";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import type { Industry } from "@/content/industries";
import { site } from "@/lib/site";
import { DocumentCard } from "./DocumentCard";

export function IndustryPage({ industry }: { industry: Industry }) {
  return (
    <main id="main">
      <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pb-28">
        <div className="page-container grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
                <li>
                  <Link href="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>Solutions</li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="font-medium text-ink">
                  {industry.label}
                </li>
              </ol>
            </nav>

            <LetterTitle
              text={industry.title}
              className="font-wide mt-6 text-[clamp(3rem,6.4vw,6.5rem)] leading-[0.9] font-extrabold"
            />

            <p className="mt-8 max-w-[38rem] text-xl leading-relaxed text-ink-soft">{industry.summary}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink href={site.consultationHref} magnetic>
                Schedule a consultation
              </ButtonLink>
              <ButtonLink href="#modules-list" variant="secondary">
                See the modules
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-6">
            {industry.doc ? <DocumentCard doc={industry.doc} /> : <PriceChain />}
          </div>
        </div>
      </section>

      <section aria-labelledby="industry-intro" className="border-y border-rule bg-sheet">
        <div className="page-container grid gap-10 py-24 lg:grid-cols-12 lg:gap-12 lg:py-32">
          <h2 id="industry-intro" className="heading-section text-[clamp(2rem,3.4vw,3.4rem)] lg:col-span-6">
            {industry.headline}
          </h2>
          <ScrollRevealText
            text={industry.body}
            className="font-semiwide text-2xl leading-snug font-bold sm:text-[2rem] lg:col-span-6 lg:self-end"
          />
        </div>
      </section>

      <section aria-labelledby="industry-needs" className="page-container py-24 lg:py-32">
        <h2 id="industry-needs" className="heading-section max-w-4xl">
          {industry.needsHeading}
        </h2>
        <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {industry.needs.map((need) => (
            <li key={need.title} className="border-t-2 border-ink pt-5">
              <h3 className="font-semiwide text-xl font-extrabold">{need.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{need.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="modules-list" aria-labelledby="industry-modules" className="border-y border-rule bg-sheet">
        <div className="page-container py-24 lg:py-32">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="industry-modules" className="heading-section max-w-3xl">
              {industry.modulesHeading}
            </h2>
            <p className="max-w-md text-lg text-ink-soft">{industry.modulesLead}</p>
          </div>

          <ul className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {industry.modules.map((module) => (
              <li key={module} className="border-b border-rule py-4 font-semibold">
                {module}
              </li>
            ))}
          </ul>

          <p className="mt-10">
            <Link href="/#modules" className="font-medium text-ballpoint-ink underline underline-offset-4">
              See the full module library
            </Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="industry-agents" className="on-ink bg-night text-white">
        <div className="page-container py-24 lg:py-32">
          <h2 id="industry-agents" className="heading-section max-w-3xl">
            {industry.agentsHeading}
          </h2>
          <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {industry.agents.map((agent) => (
              <li key={agent.name} className="border-t-2 border-white/80 pt-5">
                <h3 className="font-semiwide text-xl font-extrabold">{agent.name}</h3>
                <p className="mt-3 leading-relaxed text-night-soft">{agent.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </main>
  );
}
