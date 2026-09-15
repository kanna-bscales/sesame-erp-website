"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { RotateCcw } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PaperStack } from "@/components/ui/PaperStack";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSequence } from "@/hooks/useSequence";
import { formatMoney } from "@/lib/format";

type Line = { item: string; qty: number; rate: number };
type Draft = {
  number: string;
  rfq: string;
  customer: string;
  rule: string;
  seconds: number;
  lines: Line[];
};

const drafts: Draft[] = [
  {
    number: "QT-2041",
    rfq: "RFQ-0187",
    customer: "Kaveri Engineering Works",
    rule: "Distributor list, 8% sales tax",
    seconds: 38,
    lines: [
      { item: "MS sheet 2 mm, laser cut", qty: 120, rate: 42 },
      { item: "Bracket, powder coated", qty: 400, rate: 8 },
      { item: "Assembly and packing", qty: 1, rate: 950 },
    ],
  },
  {
    number: "QT-2042",
    rfq: "RFQ-0191",
    customer: "Nila Textiles",
    rule: "Project pricing, 8% sales tax",
    seconds: 41,
    lines: [
      { item: "Steel storage rack, 5 tier", qty: 24, rate: 1050 },
      { item: "Bin set, 12 pieces", qty: 24, rate: 145 },
      { item: "Delivery and installation", qty: 1, rate: 1200 },
    ],
  },
];

const TAX = 0.08;
const STEPS = 6;

export function QuotationStack() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const { step, restart } = useSequence(STEPS, { stepMs: 520, delayMs: 900, enabled: inView });
  const [draftIndex, setDraftIndex] = useState(0);

  const draft = drafts[draftIndex];
  const subtotal = draft.lines.reduce((sum, line) => sum + line.qty * line.rate, 0);
  const tax = Math.round(subtotal * TAX);
  const done = step >= STEPS;

  const draftAnother = () => {
    setDraftIndex((index) => (index + 1) % drafts.length);
    restart();
  };

  return (
    <figure ref={ref} className="relative mx-auto w-full max-w-[42rem]">
      <figcaption className="sr-only">
        Example: the AI Sales Assistant drafting a quotation from an incoming request for quotation.
      </figcaption>

      <PaperStack>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-5">
          <div>
            <p className="font-semiwide text-2xl font-extrabold sm:text-[1.75rem]">Quotation</p>
            <p className="mt-1 text-sm text-ink-soft">
              {draft.number}, replying to {draft.rfq}
            </p>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm font-medium">
            <span
              aria-hidden
              className={`size-2 rounded-full ${done ? "bg-ballpoint" : "pulse-dot bg-canary"}`}
            />
            {done ? `Drafted by AI Sales Assistant in ${draft.seconds} seconds` : "AI Sales Assistant is drafting"}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-b border-rule py-5 text-sm">
          <div>
            <dt className="text-ink-soft">Customer</dt>
            <dd className="mt-1 font-semibold">
              {step >= 1 ? <span className="marker">{draft.customer}</span> : <Skeleton className="w-36" />}
            </dd>
          </div>
          <div>
            <dt className="text-ink-soft">Pricing rule</dt>
            <dd className="mt-1 font-semibold">
              {step >= 1 ? <span className="marker">{draft.rule}</span> : <Skeleton className="w-28" />}
            </dd>
          </div>
        </dl>

        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-ink-soft">
              <th scope="col" className="pb-2 font-medium">Item</th>
              <th scope="col" className="pb-2 text-right font-medium">Qty</th>
              <th scope="col" className="hidden pb-2 text-right font-medium sm:table-cell">Rate</th>
              <th scope="col" className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {draft.lines.map((line, index) => {
              const filled = step >= 2 + index;
              return (
                <tr key={line.item} className="border-t border-rule">
                  <td className="py-3 pr-3">
                    {filled ? <span className="marker">{line.item}</span> : <Skeleton className="w-40" />}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {filled ? line.qty : <Skeleton className="w-8" />}
                  </td>
                  <td className="hidden py-3 text-right tabular-nums sm:table-cell">
                    {filled ? formatMoney(line.rate) : <Skeleton className="w-14" />}
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">
                    {filled ? formatMoney(line.qty * line.rate) : <Skeleton className="w-16" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-1 space-y-1.5 border-t-2 border-ink pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Subtotal</span>
            <span className="tabular-nums">{step >= 5 ? formatMoney(subtotal) : <Skeleton className="w-20" />}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Sales tax 8%</span>
            <span className="tabular-nums">{step >= 5 ? formatMoney(tax) : <Skeleton className="w-16" />}</span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <span className="font-semibold">Total</span>
            <span className="font-semiwide text-2xl font-extrabold sm:text-3xl">
              {step >= 5 ? (
                <AnimatedNumber from={0} value={subtotal + tax} format={formatMoney} />
              ) : (
                <Skeleton className="w-28" />
              )}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, scale: 1.7, rotate: -16 }}
              animate={{ opacity: 1, scale: 1, rotate: -7 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 17 }}
              className="font-semiwide pointer-events-none absolute bottom-7 left-5 rounded-md border-[3px] border-ballpoint-ink px-3 py-1 text-sm font-extrabold text-ballpoint-ink mix-blend-multiply sm:left-8 dark:mix-blend-normal"
            >
              Ready for your approval
            </motion.p>
          )}
        </AnimatePresence>
      </PaperStack>

      <div className="mt-3 flex min-h-11 items-center">
        <AnimatePresence>
          {done && (
            <motion.button
              type="button"
              onClick={draftAnother}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2 rounded-md py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              <RotateCcw aria-hidden className="size-4" />
              Draft another quotation
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </figure>
  );
}
