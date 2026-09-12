import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { WirelessFeatures } from "@/components/wireless/WirelessFeatures";
import { WirelessHero } from "@/components/wireless/WirelessHero";
import { WirelessIntro } from "@/components/wireless/WirelessIntro";
import { wirelessErp } from "@/content/wireless-erp";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${wirelessErp.title} | ${site.name}`,
  description: wirelessErp.summary,
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
