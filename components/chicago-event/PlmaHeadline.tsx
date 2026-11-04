"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = { eyebrow: string; lines: string[]; second: string };

export function PlmaHeadline({ eyebrow, lines, second }: Props) {
  const rows = [...lines.map((text) => ({ text, light: false })), { text: second, light: true }];

  return (
    <div className="@container">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="inline-flex items-center gap-2.5 rounded-full border border-rule bg-sheet px-3.5 py-1.5 text-[0.9rem] font-medium"
      >
        <span aria-hidden className="size-2 rounded-full bg-canary ring-4 ring-canary/30" />
        {eyebrow}
      </motion.p>

      <h1 className="font-wide mt-7 text-[clamp(2rem,9.5cqi,5.25rem)] leading-[0.96] text-balance">
        {rows.map((row, index) => (
          <span key={row.text} className="block overflow-hidden pb-[0.07em]">
            <motion.span
              className={`block ${row.light ? "font-light" : "font-extrabold"}`}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.95, ease, delay: 0.12 + index * 0.12 }}
            >
              {row.text}
            </motion.span>
          </span>
        ))}
      </h1>
    </div>
  );
}
