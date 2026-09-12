"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { Lamplight } from "@/components/ui/Lamplight";
import { HEADER_OFFSET } from "@/lib/site";
import { applyTheme, getPreferredTheme } from "@/lib/theme";

export function Providers({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  // Strict Mode's dev remount clears the data-theme set by the inline script; re-apply before paint.
  useLayoutEffect(() => {
    applyTheme(getPreferredTheme());
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{ lerp: 0.11, anchors: { offset: HEADER_OFFSET }, smoothWheel: !reduceMotion }}
      >
        {children}
      </ReactLenis>
      <Lamplight />
    </MotionConfig>
  );
}
