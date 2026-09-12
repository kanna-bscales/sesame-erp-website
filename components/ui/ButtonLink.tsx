"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type Variant = "primary" | "secondary";

// One colour per button: the action red, with its own darker shade as the offset copy shadow.
const variants: Record<Variant, string> = {
  primary:
    "bg-ballpoint text-on-ballpoint shadow-[5px_5px_0_var(--color-ballpoint-deep)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_var(--color-ballpoint-deep)]",
  secondary: "border border-ink/25 text-ink hover:border-ink hover:bg-sheet",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  magnetic?: boolean;
  block?: boolean;
  className?: string;
  onClick?: () => void;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  magnetic = false,
  block = false,
  className = "",
  onClick,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const x = useSpring(pullX, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(pullY, { stiffness: 220, damping: 16, mass: 0.4 });

  const onPointerMove = (event: PointerEvent) => {
    if (!magnetic || reduceMotion || event.pointerType !== "mouse" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    pullX.set((event.clientX - (box.left + box.width / 2)) * 0.28);
    pullY.set((event.clientY - (box.top + box.height / 2)) * 0.38);
  };

  const release = () => {
    pullX.set(0);
    pullY.set(0);
  };

  return (
    <motion.span
      className={block ? "block" : "inline-block"}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={release}
    >
      <a
        ref={ref}
        href={href}
        onClick={onClick}
        className={`inline-flex h-13 items-center justify-center gap-2 rounded-[10px] px-6 text-base font-semibold transition-[translate,box-shadow,background-color,border-color] duration-200 ease-press ${
          block ? "w-full" : ""
        } ${variants[variant]} ${className}`}
      >
        {children}
      </a>
    </motion.span>
  );
}
