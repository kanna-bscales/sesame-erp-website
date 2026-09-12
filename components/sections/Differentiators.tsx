"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { differentiators } from "@/content/home";

type Item = (typeof differentiators.items)[number];

export function Differentiators() {
  return (
    <section aria-labelledby="differentiators-heading" className="page-container py-24 lg:py-36">
      <h2 id="differentiators-heading" className="heading-section max-w-4xl">
        {differentiators.heading}
      </h2>

      <div className="mt-14">
        <div
          aria-hidden
          className="hidden grid-cols-12 gap-10 border-b-2 border-ink pb-3 text-sm font-medium text-ink-soft md:grid"
        >
          <span className="col-span-3">What matters</span>
          <span className="col-span-4">A typical ERP project</span>
          <span className="col-span-5">Working with us</span>
        </div>
        <ul className="border-t-2 border-ink md:border-t-0">
          {differentiators.items.map((item) => (
            <DifferenceRow key={item.title} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

// The "typical" answer gets struck through with a pen line as the row scrolls in.
function DifferenceRow({ item }: { item: Item }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.5"] });
  const strike = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <li ref={ref} className="relative grid gap-2 border-b border-rule py-7 md:grid-cols-12 md:gap-10">
      <h3 className="font-semiwide text-2xl font-extrabold md:col-span-3">{item.title}</h3>
      <p className="self-center text-ink-soft md:col-span-4">
        <span className="sr-only">A typical ERP project: </span>
        <span className="relative inline-block">
          {item.typical}
          <motion.span
            aria-hidden
            style={{ scaleX: strike }}
            className="absolute inset-x-[-4px] top-[55%] h-0.5 origin-left -rotate-2 rounded-full bg-ballpoint motion-reduce:transform-none!"
          />
        </span>
      </p>
      <p className="self-center text-lg font-medium md:col-span-5">
        <span className="sr-only">Working with us: </span>
        {item.body}
      </p>
    </li>
  );
}
