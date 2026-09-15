"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { PaperStack } from "@/components/ui/PaperStack";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSequence } from "@/hooks/useSequence";
import type { IndustryDoc } from "@/content/industries";

// A record filling itself in, in the vocabulary of the industry on the page.
export function DocumentCard({ doc }: { doc: IndustryDoc }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const steps = doc.rows.length + 1;
  const { step } = useSequence(steps, { stepMs: 560, delayMs: 900, enabled: inView });
  const done = step >= steps;

  return (
    <figure ref={ref} className="relative mx-auto w-full max-w-[38rem]">
      <figcaption className="sr-only">
        Example: {doc.title.toLowerCase()} handled by an AI agent inside the system.
      </figcaption>

      <PaperStack>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-5">
          <div>
            <p className="font-semiwide text-2xl font-extrabold sm:text-[1.75rem]">{doc.title}</p>
            <p className="mt-1 text-sm text-ink-soft">{doc.subtitle}</p>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm font-medium">
            <span aria-hidden className={`size-2 rounded-full ${done ? "bg-ballpoint" : "pulse-dot bg-canary"}`} />
            {done ? doc.finished : doc.working}
          </p>
        </div>

        <table className="mt-4 w-full text-left text-[0.95rem]">
          <thead>
            <tr className="text-ink-soft">
              <th scope="col" className="pb-2 font-medium">
                {doc.columns[0]}
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                {doc.columns[2]}
              </th>
            </tr>
          </thead>
          <tbody>
            {doc.rows.map((row, index) => {
              const filled = step >= index + 1;
              return (
                <tr key={row.item} className="border-t border-rule align-top">
                  <td className="py-3 pr-4">
                    {filled ? (
                      <>
                        <span className="marker font-semibold">{row.item}</span>
                        <span className="block text-sm text-ink-soft">{row.detail}</span>
                      </>
                    ) : (
                      <>
                        <Skeleton className="w-32" />
                        <span className="mt-2 block">
                          <Skeleton className="w-24" />
                        </span>
                      </>
                    )}
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">
                    {filled ? row.value : <Skeleton className="w-16" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="mt-5 border-t-2 border-ink pt-4 text-[0.95rem] text-ink-soft">
          {done ? doc.note : " "}
        </p>
      </PaperStack>
    </figure>
  );
}
