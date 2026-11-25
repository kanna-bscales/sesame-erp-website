import type { Metadata } from "next";
import { IndustryPage } from "@/components/industry/IndustryPage";
import { industries } from "@/content/industries";
import { hiddenPageRobots, site } from "@/lib/site";

const industry = industries.retail;

export const metadata: Metadata = {
  title: `${industry.title} | ${site.name}`,
  description: industry.summary,
  alternates: { canonical: "/retail" },
  robots: hiddenPageRobots,
};

export default function RetailPage() {
  return <IndustryPage industry={industry} />;
}
