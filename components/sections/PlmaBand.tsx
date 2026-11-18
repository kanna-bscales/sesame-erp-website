import Link from "next/link";
import { campaignPath } from "@/content/chicago-event";
import { plmaBand } from "@/content/home";
import { plmaPagePath } from "@/content/plma-2026";

// Slim homepage band linking to the PLMA guide and the PLMA enquiry page.
export function PlmaBand() {
  const link = "font-semibold text-ink underline underline-offset-4 hover:text-ballpoint-ink";
  return (
    <section aria-label={plmaBand.label} className="border-b border-rule bg-sheet">
      <p className="page-container flex flex-wrap items-baseline gap-x-3 gap-y-1 py-5 leading-relaxed text-ink-soft">
        <span className="rounded-full bg-canary px-2.5 py-0.5 text-sm font-semibold text-night">{plmaBand.label}</span>
        <span>
          {plmaBand.before}{" "}
          <Link href={plmaPagePath} className={link}>
            {plmaBand.guideLabel}
          </Link>{" "}
          {plmaBand.middle}{" "}
          <Link href={campaignPath} className={link}>
            {plmaBand.offerLabel}
          </Link>
          {plmaBand.after}
        </span>
      </p>
    </section>
  );
}
