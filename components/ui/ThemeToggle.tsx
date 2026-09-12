"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, saveTheme, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);
  const reduceMotion = useReducedMotion();

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    const commit = () => {
      applyTheme(next);
      saveTheme(next);
    };

    if (reduceMotion || typeof document.startViewTransition !== "function") {
      commit();
      return;
    }

    const box = event.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(commit);
    transition.ready.then(
      () => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      },
      () => {
        // The browser skipped the transition (e.g. tab hidden); commit() has still applied the theme.
      },
    );
  };

  const label = theme === null ? "Change color theme" : `Switch to ${theme === "dark" ? "light" : "dark"} theme`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="relative inline-flex size-11 items-center justify-center overflow-hidden rounded-full border border-ink/15 transition-colors hover:border-ink/40 hover:bg-sheet"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {theme && (
          <motion.span
            key={theme}
            initial={{ y: 18, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -18, rotate: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="flex"
          >
            {theme === "dark" ? <Sun aria-hidden className="size-5" /> : <Moon aria-hidden className="size-5" />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
