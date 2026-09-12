import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type Options = { stepMs?: number; delayMs?: number; enabled?: boolean };

// Steps 0..total on a timer; jumps straight to `total` for reduced-motion users.
export function useSequence(total: number, { stepMs = 600, delayMs = 300, enabled = true }: Options = {}) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const timers = reduceMotion
      ? [window.setTimeout(() => setStep(total), 0)]
      : Array.from({ length: total }, (_, i) =>
          window.setTimeout(() => setStep(i + 1), delayMs + i * stepMs),
        );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [enabled, reduceMotion, total, stepMs, delayMs, run]);

  const restart = useCallback(() => {
    setStep(0);
    setRun((value) => value + 1);
  }, []);

  return { step, restart };
}
