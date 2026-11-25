import type { Metadata } from "next";
import { Agents } from "@/components/sections/Agents";
import { Differentiators } from "@/components/sections/Differentiators";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Manufacturing } from "@/components/sections/Manufacturing";
import { Modules } from "@/components/sections/Modules";
import { ModuleFocusProvider } from "@/components/sections/modules/ModuleFocus";
import { BlogBand } from "@/components/sections/BlogBand";
import { PlmaBand } from "@/components/sections/PlmaBand";
import { Process } from "@/components/sections/Process";
import { StatsTicker } from "@/components/sections/StatsTicker";
import { WhyUs } from "@/components/sections/WhyUs";
import { faq } from "@/content/home";

// Canonical resolves against metadataBase (https://www.sesameerp.ai) in app/layout.tsx.
export const metadata: Metadata = { alternates: { canonical: "/" } };

// FAQPage structured data for the visible homepage FAQ (SEO audit, Nov 24, 2026). "<" escaped so
// the JSON can never close the script element.
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
}).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <Hero />
      <StatsTicker />
      <PlmaBand />
      <BlogBand />
      <WhyUs />
      <Process />
      <Agents />
      <ModuleFocusProvider>
        <Modules />
        <Manufacturing />
      </ModuleFocusProvider>
      <Differentiators />
      <Faq />
      <FinalCta />
    </main>
  );
}
