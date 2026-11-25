import type { Metadata } from "next";
import { IndustryPage } from "@/components/industry/IndustryPage";
import { industries } from "@/content/industries";
import { hiddenPageRobots, site } from "@/lib/site";

const industry = industries.manufacturing;

export const metadata: Metadata = {
  title: `${industry.title} | ${site.name}`,
  description: industry.summary,
  alternates: { canonical: "/manufacturing" },
  robots: hiddenPageRobots,
};

export default function ManufacturingPage() {
  return <IndustryPage industry={industry} />;
}
