import { Agents } from "@/components/sections/Agents";
import { Differentiators } from "@/components/sections/Differentiators";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Manufacturing } from "@/components/sections/Manufacturing";
import { Modules } from "@/components/sections/Modules";
import { ModuleFocusProvider } from "@/components/sections/modules/ModuleFocus";
import { Process } from "@/components/sections/Process";
import { StatsTicker } from "@/components/sections/StatsTicker";
import { WhyUs } from "@/components/sections/WhyUs";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <StatsTicker />
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
