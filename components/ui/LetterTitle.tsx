"use client";

import { motion } from "motion/react";

type Props = { text: string; className?: string };

// Page title whose letters rise out of a mask, one word per line.
export function LetterTitle({ text, className = "" }: Props) {
  const words = text.split(" ");
  const offsets = words.map((_, index) => words.slice(0, index).join("").length);

  return (
    <h1 aria-label={text} className={className}>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} aria-hidden className="block overflow-hidden pb-[0.06em]">
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1 + (offsets[wordIndex] + charIndex) * 0.045,
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}
