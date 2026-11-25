import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { WirelessFeatures } from "@/components/wireless/WirelessFeatures";
import { WirelessHero } from "@/components/wireless/WirelessHero";
import { WirelessIntro } from "@/components/wireless/WirelessIntro";
import { wirelessErp } from "@/content/wireless-erp";
import { hiddenPageRobots, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${wirelessErp.title} | ${site.name}`,
  description: wirelessErp.summary,
  alternates: { canonical: "/wireless-erp" },
  robots: hiddenPageRobots,
};

export default function WirelessErpPage() {
  return (
    <main id="main">
      <WirelessHero />
      <WirelessIntro />
      <WirelessFeatures />
      <FinalCta />
    </main>
  );
}
