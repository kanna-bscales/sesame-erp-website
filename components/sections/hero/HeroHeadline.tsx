"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = { eyebrow: string; lines: string[]; second: string };

export function HeroHeadline({ eyebrow, lines, second }: Props) {
  const rows = [...lines.map((text) => ({ text, light: false })), { text: second, light: true }];

  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="inline-flex items-center gap-2.5 rounded-full border border-rule bg-sheet px-3.5 py-1.5 text-[0.9rem] font-medium"
      >
        <span aria-hidden className="size-2 rounded-full bg-canary ring-4 ring-canary/30" />
        {eyebrow}
      </motion.p>

      <h1 className="font-wide mt-7 text-[clamp(2.5rem,5.4vw,5.9rem)] leading-[0.96] text-balance">
        {/* Spaces between the row blocks keep the H1's text readable for search engines
            ("Custom ERP systems, built fast."), invisible in the block layout (SEO audit, Nov 24, 2026). */}
        {rows.map((row, index) => [
          index > 0 ? " " : null,
          <span key={row.text} className="block overflow-hidden pb-[0.07em]">
            <motion.span
              className={`block ${row.light ? "font-light" : "font-extrabold"}`}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.95, ease, delay: 0.12 + index * 0.12 }}
            >
              {row.text}
            </motion.span>
          </span>,
        ])}
      </h1>
    </div>
  );
}
