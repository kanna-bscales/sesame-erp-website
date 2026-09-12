"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Dark theme only: a soft pool of light follows the cursor, like a desk lamp over the page.
export function Lamplight() {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!finePointer || reduceMotion) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        ref.current?.style.setProperty("--lx", `${x}px`);
        ref.current?.style.setProperty("--ly", `${y}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [finePointer, reduceMotion]);

  return <div ref={ref} aria-hidden className="lamplight pointer-events-none fixed inset-0 z-40 hidden dark:block" />;
}
