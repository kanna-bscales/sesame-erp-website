"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { howWeWork, type ProcessStep } from "@/content/home";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"];
const WEEKS = weekLabels.length;

const colStart: Record<number, string> = {
  1: "lg:col-start-1",
  2: "lg:col-start-2",
  3: "lg:col-start-3",
  4: "lg:col-start-4",
  5: "lg:col-start-5",
  6: "lg:col-start-6",
  7: "lg:col-start-7",
};

// Desktop: the section pins while scroll moves a "today" line across a 7-week plan.
export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 64rem)");
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const weeks = useTransform(scrollYProgress, [0.06, 0.9], [0, WEEKS], { clamp: true });
  const todayLeft = useTransform(weeks, (d) => `${(d / WEEKS) * 100}%`);
  const todayLabel = useTransform(weeks, (d) => weekLabels[Math.min(WEEKS, Math.max(1, Math.ceil(d))) - 1]);

  return (
    <section id="process" aria-labelledby="process-heading" className="relative">
      <div ref={trackRef} className="relative lg:h-[260vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center">
          <div className="page-container py-24 lg:pt-20 lg:pb-0">
            <h2 id="process-heading" className="heading-section max-w-4xl">
              {howWeWork.heading}
            </h2>

            <div className="relative mt-12 lg:mt-16">
              <div
                aria-hidden
                className="hidden grid-cols-7 border-b-2 border-ink pb-3 text-sm font-medium text-ink-soft lg:grid"
              >
                {weekLabels.map((label) => (
                  <span key={label} className="pl-3">
                    {label}
                  </span>
                ))}
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-10 bottom-0 hidden grid-cols-7 lg:grid"
              >
                {Array.from({ length: WEEKS }, (_, i) => (
                  <span key={i} className="border-l border-rule" />
                ))}
              </div>

              <ol className="relative">
                {howWeWork.steps.map((step, index) => (
                  <StepRow key={step.title} step={step} index={index} weeks={weeks} scrollLinked={isDesktop} />
                ))}
              </ol>

              <motion.div
                aria-hidden
                style={{ left: todayLeft }}
                className="absolute top-0 bottom-0 hidden w-0.5 bg-ballpoint lg:block dark:shadow-[0_0_18px_3px_var(--color-ballpoint)]"
              >
                <motion.span className="absolute -top-8 left-0 -translate-x-1/2 rounded bg-ballpoint px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-on-ballpoint">
                  {todayLabel}
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type StepRowProps = {
  step: ProcessStep;
  index: number;
  weeks: MotionValue<number>;
  scrollLinked: boolean;
};

function StepRow({ step, index, weeks, scrollLinked }: StepRowProps) {
  const [start, end] = step.span;
  const fill = useTransform(weeks, [start - 1, end], [0, 1], { clamp: true });
  const opacity = useTransform(weeks, [start - 1.3, start - 0.9], [0.32, 1], { clamp: true });
  const barWidth = { "--bar": `${((end - start + 1) / (WEEKS - start + 1)) * 100}%` } as CSSProperties;

  return (
    <motion.li
      style={scrollLinked ? { opacity } : undefined}
      className="relative border-b border-rule py-6 last:border-b-0 lg:grid lg:grid-cols-7 lg:border-b-0 lg:py-3.5"
    >
      <div className={`${colStart[start]} lg:col-end-8 lg:pl-3`}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-semiwide text-sm font-extrabold text-ballpoint-ink">{index + 1}</span>
          <h3 className="font-semiwide text-xl font-extrabold">{step.title}</h3>
          <span className="text-sm text-ink-soft">{step.weeks}</span>
        </div>
        <div style={barWidth} className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-rule lg:w-(--bar)">
          <motion.span
            style={scrollLinked ? { scaleX: fill } : undefined}
            className="absolute inset-0 origin-left rounded-full bg-ballpoint"
          />
        </div>
        <p className="mt-3 max-w-[46ch] text-[0.97rem] leading-relaxed text-ink-soft">{step.body}</p>
      </div>
    </motion.li>
  );
}
