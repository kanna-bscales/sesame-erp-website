"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

type Item = { q: string; a: string; confirmed?: boolean };

// Same accordion as the homepage FAQ, driven by props. Answers marked `confirmed: false` carry a
// "Details to be confirmed" note so reviewers can spot them; pass showPending={false} at launch.
type Props = { heading: string; items: Item[]; showPending?: boolean; id?: string; children?: ReactNode };

export function EventFaq({ heading, items, showPending = true, id = "faq", children }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={id} aria-labelledby="event-faq-heading" className="border-t border-rule">
      <div className="page-container grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-4">
          <h2 id="event-faq-heading" className="heading-section lg:sticky lg:top-28">
            {heading}
          </h2>
        </div>

        <div className="lg:col-span-8">
        <ul className="border-t-2 border-ink">
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <li key={item.q} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    id={`event-faq-question-${index}`}
                    aria-expanded={open}
                    aria-controls={`event-faq-answer-${index}`}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-semiwide text-xl font-bold sm:text-2xl">{item.q}</span>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 24 }}
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        open ? "border-ink bg-ink text-paper" : "border-ink/20"
                      }`}
                    >
                      <Plus className="size-5" />
                    </motion.span>
                  </button>
                </h3>
                {/* Every answer is always in the HTML (search engines and the FAQPage structured data
                    need it); closed answers collapse to zero height and are inert, so they are not
                    focusable or read out. The grid-rows transition animates the height. */}
                <div
                  id={`event-faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`event-faq-question-${index}`}
                  inert={!open}
                  className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-7">
                      <p className="max-w-[62ch] text-lg text-ink-soft">{item.a}</p>
                      {showPending && item.confirmed === false && (
                        <p className="mt-3 inline-flex rounded-full border border-ink/20 px-3 py-1 text-sm font-medium">
                          Details to be confirmed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
          {children}
        </div>
      </div>
    </section>
  );
}
