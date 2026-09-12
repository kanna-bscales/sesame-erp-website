"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Smartphone, type LucideIcon } from "lucide-react";
import { services } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  "/wireless-erp": Smartphone,
};

export function ServicesMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const pathname = usePathname();
  const onServicePage = services.some((service) => service.href === pathname);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") setOpen(true);
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse") setOpen(false);
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onBlur}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-1.5 transition-colors hover:text-ink ${
          open || onServicePage ? "text-ink" : "text-ink-soft"
        }`}
      >
        Services
        <ChevronDown
          aria-hidden
          className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-1/2 w-[22rem] -translate-x-1/2 pt-4"
          >
            <ul className="rounded-md bg-sheet p-2 shadow-[8px_8px_0_var(--color-canary)] ring-1 ring-rule dark:shadow-[8px_8px_0_var(--color-canary),0_0_60px_-24px_var(--color-canary)]">
              {services.map((service) => {
                const Icon = icons[service.href] ?? Smartphone;
                const current = pathname === service.href;
                return (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      onClick={() => setOpen(false)}
                      aria-current={current ? "page" : undefined}
                      className="flex gap-3 rounded-md p-3 transition-colors hover:bg-paper"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-canary text-night">
                        <Icon aria-hidden className="size-5" />
                      </span>
                      <span>
                        <span className="block font-semibold text-ink">{service.label}</span>
                        <span className="mt-0.5 block text-sm font-normal text-ink-soft">{service.description}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
