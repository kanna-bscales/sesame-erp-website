"use client";

import type { MouseEvent } from "react";
import { useLenis } from "lenis/react";
import { HEADER_OFFSET } from "@/lib/site";

type Item = { id: string; title: string };

// "On this page" list for the terms page. Scrolls with Lenis directly to a position measured at
// click time (Lenis' own anchor handling undershot long jumps here), and keeps the URL hash in sync.
export function TermsToc({ items }: { items: Item[] }) {
  const lenis = useLenis();

  const onClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!lenis || !target) return; // fall back to the browser's own anchor jump
    event.preventDefault();
    event.stopPropagation();
    // Absolute position measured from the window, so a stale Lenis scroll value cannot skew it.
    const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - margin + HEADER_OFFSET;
    lenis.scrollTo(Math.max(0, top));
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <ol className="mt-4 space-y-1 border-l-2 border-rule text-[0.95rem]">
      {items.map((item, index) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={(event) => onClick(event, item.id)}
            className="-ml-0.5 flex gap-2 border-l-2 border-transparent py-1.5 pl-4 text-ink-soft transition-colors hover:border-ballpoint hover:text-ink"
          >
            <span className="tabular-nums">{index + 1}.</span>
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  );
}
