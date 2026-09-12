"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type Props = { id: string; lead: string; flip: string };

// "the other way around" starts upside down and turns upright as it scrolls into view.
export function FlipHeading({ id, lead, flip }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.4"] });
  const words = flip.split(" ");

  return (
    <h2 ref={ref} id={id} className="heading-section relative max-w-5xl">
      {lead}{" "}
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <FlipWord word={word} index={index} count={words.length} progress={scrollYProgress} />
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h2>
  );
}

type FlipWordProps = { word: string; index: number; count: number; progress: MotionValue<number> };

function FlipWord({ word, index, count, progress }: FlipWordProps) {
  const start = (index / count) * 0.45;
  const rotate = useTransform(progress, [start, start + 0.55], [180, 0], { clamp: true });

  return (
    <motion.span style={{ rotate }} className="inline-block motion-reduce:transform-none!">
      {word}
    </motion.span>
  );
}
