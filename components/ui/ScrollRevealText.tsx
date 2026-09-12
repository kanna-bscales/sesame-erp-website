"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type Props = { text: string; className?: string };

// Words go from faint to full ink as the paragraph scrolls through the viewport.
export function ScrollRevealText({ text, className = "" }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={`relative ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, index) => (
          <Word
            key={`${word}-${index}`}
            word={word}
            range={[index / words.length, (index + 1) / words.length]}
            progress={scrollYProgress}
          />
        ))}
      </span>
    </p>
  );
}

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="motion-reduce:opacity-100!">
      {word}{" "}
    </motion.span>
  );
}
