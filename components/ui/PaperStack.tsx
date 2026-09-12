"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// A white original resting on a canary and a carbon copy; the copies fan out with the cursor.
export function PaperStack({ children }: { children: ReactNode }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 18 });
  const sheetX = useTransform(smoothX, (v) => v * -5);
  const sheetY = useTransform(smoothY, (v) => v * -5);
  const canaryX = useTransform(smoothX, (v) => v * 9);
  const canaryY = useTransform(smoothY, (v) => v * 9);
  const carbonX = useTransform(smoothX, (v) => v * 18);
  const carbonY = useTransform(smoothY, (v) => v * 18);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 2);
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY]);

  return (
    <div className="relative pr-7 pb-7">
      <motion.div
        aria-hidden
        style={{ x: carbonX, y: carbonY }}
        className="absolute inset-0 top-7 left-7 rounded-md bg-carbon motion-reduce:transform-none!"
      />
      <motion.div
        aria-hidden
        style={{ x: canaryX, y: canaryY }}
        className="absolute inset-3.5 rounded-md bg-canary motion-reduce:transform-none! dark:shadow-[0_0_90px_-20px_var(--color-canary)]"
      />
      <motion.div
        style={{ x: sheetX, y: sheetY }}
        className="relative overflow-hidden rounded-md bg-sheet p-5 ring-1 ring-ink/5 sm:p-8 motion-reduce:transform-none!"
      >
        {children}
      </motion.div>
    </div>
  );
}
