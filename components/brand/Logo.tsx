import { site } from "@/lib/site";

// SesameERP: three sesame seeds, stacked at an offset like the copies of a carbon form.
export function Logo({ tone = "ink" }: { tone?: "ink" | "light" }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${tone === "light" ? "text-white" : "text-ink"}`}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="8" fill="var(--color-ballpoint)" />
        <g fill="#ffffff">
          <ellipse cx="11" cy="11.5" rx="4.3" ry="2.3" transform="rotate(-32 11 11.5)" />
          <ellipse cx="16" cy="16" rx="4.3" ry="2.3" transform="rotate(-32 16 16)" />
          <ellipse cx="21" cy="20.5" rx="4.3" ry="2.3" transform="rotate(-32 21 20.5)" />
        </g>
      </svg>
      <span className="font-semiwide text-[1.1rem] font-extrabold tracking-tight">{site.name}</span>
    </span>
  );
}
