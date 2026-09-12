"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faq } from "@/content/home";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-t border-rule">
      <div className="page-container grid gap-12 py-24 lg:grid-cols-12 lg:py-36">
        <div className="lg:col-span-4">
          <h2 id="faq-heading" className="heading-section lg:sticky lg:top-28">
            {faq.heading}
          </h2>
        </div>

        <ul className="border-t-2 border-ink lg:col-span-8">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            return (
              <li key={item.q} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    id={`faq-question-${index}`}
                    aria-expanded={open}
                    aria-controls={`faq-answer-${index}`}
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
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pb-7 text-lg text-ink-soft">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
