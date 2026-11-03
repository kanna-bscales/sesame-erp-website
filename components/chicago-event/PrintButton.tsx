"use client";

import { Printer } from "lucide-react";

// Opens the browser's print dialog. The terms page hides the site chrome when printed.
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-ink/25 px-4 text-[0.95rem] font-semibold transition-colors hover:border-ink hover:bg-sheet"
    >
      <Printer aria-hidden className="size-4" />
      {label}
    </button>
  );
}
