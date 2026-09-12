"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Check } from "lucide-react";
import { PaperStack } from "@/components/ui/PaperStack";
import { useSequence } from "@/hooks/useSequence";

// Illustrative demo data only — see docs/placeholders.md.
const imeis = [
  "356938035643809",
  "356938035641127",
  "356938035646650",
  "356938035642214",
  "356938035649031",
  "356938035640578",
];

const STEPS = imeis.length + 1;

const formatImei = (imei: string) =>
  `${imei.slice(0, 2)} ${imei.slice(2, 8)} ${imei.slice(8, 14)} ${imei.slice(14)}`;

const barcode = (() => {
  let x = 0;
  return "35693803564380911276650"
    .split("")
    .map(Number)
    .map((digit) => {
      const bar = { x, width: 1 + (digit % 3) };
      x += bar.width + 1 + ((digit + 1) % 2);
      return bar;
    });
})();
const barcodeWidth = barcode[barcode.length - 1].x + barcode[barcode.length - 1].width;

export function DeviceBoxLabel() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const { step } = useSequence(STEPS, { stepMs: 420, delayMs: 1300, enabled: inView });
  const verified = Math.min(step, imeis.length);
  const done = step >= STEPS;

  return (
    <figure ref={ref} className="relative mx-auto w-full max-w-[38rem]">
      <figcaption className="sr-only">Example: a box of phones being checked in one IMEI at a time.</figcaption>

      <PaperStack>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-5">
          <div>
            <p className="font-semiwide text-2xl font-extrabold sm:text-[1.75rem]">Packing list</p>
            <p className="mt-1 text-sm text-ink-soft">Box BX-12, received into retailer stock</p>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm font-medium">
            <span aria-hidden className={`size-2 rounded-full ${done ? "bg-ballpoint" : "pulse-dot bg-canary"}`} />
            {done ? `${imeis.length} of ${imeis.length} IMEIs verified` : `Scanning ${verified} of ${imeis.length}`}
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-4 border-b border-rule py-5 text-sm">
          <div>
            <dt className="text-ink-soft">Model</dt>
            <dd className="mt-1 font-semibold">Galaxy A15</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Storage</dt>
            <dd className="mt-1 font-semibold">128 GB</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Quantity</dt>
            <dd className="mt-1 font-semibold">{imeis.length} devices</dd>
          </div>
        </dl>

        <div aria-hidden className="relative mt-5 overflow-hidden rounded-sm">
          <svg viewBox={`0 0 ${barcodeWidth} 40`} preserveAspectRatio="none" className="h-14 w-full">
            {barcode.map((bar) => (
              <rect key={bar.x} x={bar.x} y="0" width={bar.width} height="40" fill="var(--color-ink)" />
            ))}
          </svg>
          {inView && !done && (
            <motion.span
              className="absolute top-0 bottom-0 w-0.5 bg-ballpoint shadow-[0_0_14px_4px_var(--color-ballpoint)] motion-reduce:hidden"
              initial={{ left: "0%" }}
              animate={{ left: ["0%", "100%", "0%"] }}
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
            />
          )}
        </div>

        <ol className="mt-4">
          {imeis.map((imei, index) => {
            const ok = verified > index;
            return (
              <li key={imei} className="flex items-center justify-between gap-3 border-t border-rule py-2.5 text-sm">
                <span className="flex items-center gap-3">
                  <span className="w-4 text-ink-soft tabular-nums">{index + 1}</span>
                  <span className="tracking-wide tabular-nums">
                    {ok ? <span className="marker">{formatImei(imei)}</span> : formatImei(imei)}
                  </span>
                </span>
                <span
                  className={`inline-flex size-6 items-center justify-center rounded-full transition-colors duration-300 ${
                    ok ? "bg-ballpoint text-on-ballpoint" : "bg-rule text-transparent"
                  }`}
                >
                  <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  <span className="sr-only">{ok ? "Verified" : "Not scanned yet"}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, scale: 1.7, rotate: -18 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ type: "spring", stiffness: 360, damping: 17 }}
              className="font-semiwide pointer-events-none absolute right-6 bottom-8 rounded-md border-[3px] border-ballpoint-ink px-3 py-1 text-base font-extrabold text-ballpoint-ink mix-blend-multiply sm:right-10 dark:mix-blend-normal"
            >
              Checked in
            </motion.p>
          )}
        </AnimatePresence>
      </PaperStack>
    </figure>
  );
}
