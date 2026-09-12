"use client";

import { AnimatePresence, motion } from "motion/react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { manufacturingNeeds, modules } from "@/content/home";
import { site } from "@/lib/site";
import { useModuleFocus, type ModuleFocus } from "./modules/ModuleFocus";

const filters: { value: ModuleFocus; label: string }[] = [
  { value: "all", label: "All modules" },
  { value: "manufacturing", label: "Manufacturing focus" },
];

const moduleCount = modules.groups.reduce((sum, group) => sum + group.items.length, 0);

export function Modules() {
  const { focus, setFocus } = useModuleFocus();
  const manufacturingOnly = focus === "manufacturing";

  return (
    <section id="modules" aria-labelledby="modules-heading" className="page-container py-24 lg:py-36">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="modules-heading" className="heading-section max-w-4xl">
            {modules.heading}
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            {moduleCount} modules across {modules.groups.length} areas of your business.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter modules"
          className="inline-flex self-start rounded-[10px] border border-ink/20 bg-sheet p-1 lg:self-auto"
        >
          {filters.map((filter) => {
            const selected = focus === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setFocus(filter.value)}
                className="relative rounded-md px-4 py-2 text-[0.95rem] font-medium"
              >
                {selected && (
                  <motion.span
                    layoutId="module-filter"
                    className="absolute inset-0 rounded-md bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className={`relative transition-colors ${selected ? "text-paper" : "text-ink"}`}>
                  {filter.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2 xl:grid-cols-4">
        {modules.groups.map((group) => (
          <div key={group.title}>
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
              <h3 className="font-semiwide text-lg font-extrabold">{group.title}</h3>
              <span className="text-sm text-ink-soft">{group.items.length} modules</span>
            </div>
            <ul>
              {group.items.map((item) => {
                const need = item.manufacturing;
                const dimmed = manufacturingOnly && !need;
                return (
                  <motion.li
                    key={item.name}
                    animate={{ opacity: dimmed ? 0.38 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-rule py-5"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h4 className="font-semibold">{item.name}</h4>
                      <AnimatePresence>
                        {manufacturingOnly && need && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ type: "spring", stiffness: 420, damping: 26 }}
                            className="rounded-sm bg-canary px-2 py-0.5 text-xs font-semibold text-night"
                          >
                            {manufacturingNeeds[need].tag}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{item.body}</p>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* A blank form: the module that isn't on the list yet */}
      <div className="mt-14 flex flex-col gap-6 rounded-md border-2 border-dashed border-ink/25 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-semiwide text-2xl font-extrabold">{modules.custom.heading}</h3>
          <p className="mt-2 text-lg text-ink-soft">{modules.custom.body}</p>
        </div>
        <ButtonLink href={site.consultationHref} magnetic>
          {modules.custom.cta}
        </ButtonLink>
      </div>
    </section>
  );
}
