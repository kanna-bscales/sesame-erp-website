"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Props = { src: string; title: string; heightDesktop: number; heightMobile: number; timeoutMs?: number };

// Official Zoho CRM webform embed (Leads module).
//
// Validation, submission, Lead Source / tag / Credit Offer Status and the success message all
// happen inside Zoho's iframe, exactly as configured in Zoho CRM. This component never shows a
// success message of its own, so a visitor only sees "thank you" after Zoho accepted the lead.
// Browsers do not allow styling inside a cross-origin iframe; fields keep Zoho's own styling.
export function ZohoWebForm({ src, title, heightDesktop, heightMobile, timeoutMs = 15000 }: Props) {
  const [status, setStatus] = useState<"loading" | "loaded" | "slow">("loading");

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("slow"), timeoutMs);
    return () => window.clearTimeout(timer);
  }, [status, timeoutMs]);

  return (
    <div>
      <div
        className="relative h-(--zf-mobile) w-full overflow-hidden rounded-md bg-white md:h-(--zf-desktop)"
        style={{ "--zf-mobile": `${heightMobile}px`, "--zf-desktop": `${heightDesktop}px` } as React.CSSProperties}
      >
        {status !== "loaded" && (
          <div aria-hidden className="absolute inset-0 flex flex-col gap-6 bg-white p-6 sm:p-8">
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index} className="space-y-2.5">
                <span className="block h-2.5 w-28 rounded-full bg-[#d9d9dd]" />
                <span className="block h-10 w-full rounded-md bg-[#efeff0]" />
              </div>
            ))}
          </div>
        )}
        <iframe
          src={src}
          title={title}
          onLoad={() => setStatus("loaded")}
          className="relative block h-full w-full border-0"
        />
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {status === "loading" ? "Loading the request form." : status === "loaded" ? "Request form loaded." : ""}
      </p>

      {status === "slow" && (
        <div role="alert" className="mt-4 rounded-md border border-ink/20 bg-paper p-4 text-[0.95rem]">
          <p className="font-semibold">The form is taking longer than expected to load.</p>
          <p className="mt-1 text-ink-soft">
            A browser extension or network setting may be blocking it.{" "}
            <a href={src} target="_blank" rel="noopener noreferrer" className="font-medium text-ballpoint-ink underline underline-offset-4">
              Open the form in a new tab
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("PLMA 2026 – free ERP module request")}`}
              className="font-medium text-ballpoint-ink underline underline-offset-4"
            >
              {site.email}
            </a>
            .
          </p>
        </div>
      )}

      <p className="mt-4 text-sm text-ink-soft">
        Your details go straight to our team through our secure Zoho CRM form.
      </p>
    </div>
  );
}
