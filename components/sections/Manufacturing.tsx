"use client";

import { useLenis } from "lenis/react";
import { Check } from "lucide-react";
import { manufacturing, manufacturingNeeds } from "@/content/home";
import { HEADER_OFFSET } from "@/lib/site";
import { PriceChain } from "./manufacturing/PriceChain";
import { useModuleFocus } from "./modules/ModuleFocus";

export function Manufacturing() {
  const { setFocus } = useModuleFocus();
  const lenis = useLenis();

  const highlightModules = () => {
    setFocus("manufacturing");
    const target = document.getElementById("modules");
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: HEADER_OFFSET });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section aria-labelledby="manufacturing-heading" className="border-y border-rule bg-sheet">
      <div className="page-container grid gap-14 py-24 lg:grid-cols-12 lg:gap-10 lg:py-36">
        <div className="lg:col-span-5">
          <h2
            id="manufacturing-heading"
            className="font-wide text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.04] font-extrabold text-balance"
          >
            {manufacturing.heading}
          </h2>
          <p className="mt-6 text-lg text-ink-soft">{manufacturing.intro}</p>
          <p className="mt-6 font-medium">{manufacturing.lead}</p>
          <ul className="mt-4 space-y-3">
            {manufacturing.needs.map((need) => (
              <li key={need} className="flex gap-3">
                <Check aria-hidden className="mt-1 size-5 shrink-0 text-ballpoint-ink" />
                {manufacturingNeeds[need].label}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={highlightModules}
            className="mt-9 inline-flex h-12 items-center rounded-[10px] border border-ink/25 px-5 font-semibold transition-colors hover:border-ink hover:bg-paper"
          >
            Highlight these in the module list
          </button>
        </div>

        <div className="lg:col-span-7">
          <PriceChain />
        </div>
      </div>
    </section>
  );
}
