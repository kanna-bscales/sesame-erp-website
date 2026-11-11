import { PaperStack } from "@/components/ui/PaperStack";
import { offerCard } from "@/content/chicago-event";
import { site } from "@/lib/site";

// Hero visual: the PLMA 2026 offer as a paper voucher resting on its carbon copies.
// Promotional only — it never shows a submission, CRM status or approval.
export function OfferCard() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <PaperStack>
        <div className="flex items-center justify-between gap-4 border-b border-rule pb-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm font-semibold">
            <span aria-hidden className="size-2 rounded-full bg-ballpoint" />
            {offerCard.label}
          </p>
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
            <rect width="32" height="32" rx="8" fill="var(--color-ballpoint)" />
            <g fill="#ffffff">
              <ellipse cx="11" cy="11.5" rx="4.3" ry="2.3" transform="rotate(-32 11 11.5)" />
              <ellipse cx="16" cy="16" rx="4.3" ry="2.3" transform="rotate(-32 16 16)" />
              <ellipse cx="21" cy="20.5" rx="4.3" ry="2.3" transform="rotate(-32 21 20.5)" />
            </g>
          </svg>
        </div>

        <p className="font-semiwide mt-7 text-[clamp(1.6rem,3.4vw,2.25rem)] leading-tight font-extrabold">
          {offerCard.module}
        </p>
        <div className="@container">
          <p className="font-wide mt-1 text-[clamp(1.6rem,9.5cqi,3.5rem)] leading-[0.95] font-extrabold">
            <span>{offerCard.price}</span>
          </p>
        </div>

        <dl className="mt-7 border-t-2 border-ink">
          <div className="flex items-baseline justify-between gap-4 border-b border-rule py-3.5">
            <dt className="text-ink-soft">Development value</dt>
            <dd className="font-semiwide text-xl font-extrabold tabular-nums">Up to US$5,000</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="text-ink-soft">Available to</dt>
            <dd className="text-right font-semibold">PLMA conference users</dd>
          </div>
        </dl>

        <p className="mt-3 text-sm font-medium text-ink">{offerCard.notCash}</p>
        <p className="mt-1 text-sm text-ink-soft">{site.name} · Custom ERP, AI agents and ERP automation</p>
      </PaperStack>
    </div>
  );
}
