"use client";

import { Fragment, useRef, useState } from "react";
import { LayoutGroup, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight } from "lucide-react";
import { wirelessErp } from "@/content/wireless-erp";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AllocationBoard } from "./AllocationBoard";

// Desktop: the board stays pinned while each feature scrolls past the middle of the screen.
export function WirelessFeatures() {
  const stepsRef = useRef<HTMLOListElement>(null);
  const isDesktop = useMediaQuery("(min-width: 64rem)");
  const [active, setActive] = useState(0);
  const count = wirelessErp.features.length;

  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(value * count))));
  });

  return (
    <section id="features" aria-labelledby="features-heading" className="page-container py-24 lg:py-36">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="features-heading" className="heading-section">
          {wirelessErp.featuresHeading}
        </h2>
        <p className="flex flex-wrap items-center gap-2 text-ink-soft">
          <span>Devices move from</span>
          {wirelessErp.flow.map((role, index) => (
            <Fragment key={role}>
              {index > 0 && <ArrowRight aria-label="to" className="size-4" />}
              <span className="rounded-full border border-rule bg-sheet px-3 py-1 text-sm font-medium text-ink">
                {role}
              </span>
            </Fragment>
          ))}
        </p>
      </div>

      <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="hidden lg:col-span-7 lg:block">
          <div className="sticky top-24 flex h-[calc(100svh-8rem)] items-center">
            <LayoutGroup id="allocation-board">
              <AllocationBoard step={active} />
            </LayoutGroup>
          </div>
        </div>

        <ol ref={stepsRef} className="relative lg:col-span-5">
          <span aria-hidden className="absolute top-0 bottom-0 left-[1.075rem] hidden w-0.5 bg-rule lg:block" />
          <motion.span
            aria-hidden
            style={{ scaleY: scrollYProgress }}
            className="absolute top-0 bottom-0 left-[1.075rem] hidden w-0.5 origin-top bg-ballpoint lg:block"
          />

          {wirelessErp.features.map((feature, index) => {
            const reached = !isDesktop || index <= active;
            return (
              <li
                key={feature.id}
                className="relative border-b border-rule py-12 first:pt-0 last:border-b-0 lg:flex lg:min-h-[80svh] lg:items-center lg:border-0 lg:py-0 lg:pl-14"
              >
                <span
                  className={`font-semiwide flex size-9 items-center justify-center rounded-full text-sm font-extrabold transition-colors duration-300 lg:absolute lg:top-1/2 lg:left-0 lg:-translate-y-1/2 ${
                    reached ? "bg-ballpoint text-on-ballpoint" : "bg-sheet text-ink ring-1 ring-rule"
                  }`}
                >
                  {index + 1}
                </span>

                <div>
                  <motion.div
                    animate={{ opacity: isDesktop && index !== active ? 0.3 : 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="font-semiwide mt-5 text-3xl font-extrabold lg:mt-0">{feature.title}</h3>
                    <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink-soft">{feature.body}</p>
                  </motion.div>

                  <div className="mt-8 lg:hidden">
                    <LayoutGroup id={`allocation-board-${feature.id}`}>
                      <AllocationBoard step={index} />
                    </LayoutGroup>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
