"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCampaign } from "@/lib/campaign";

// Footer lines that a campaign page can replace (see lib/campaign.ts). Defaults are unchanged.

export function FooterTagline({ children }: { children: string }) {
  const campaign = getCampaign(usePathname());
  return <>{campaign?.footerTagline ?? children}</>;
}

export function FooterAttribution() {
  const attribution = getCampaign(usePathname())?.attribution ?? {
    prefix: "A product of",
    label: "Sesame Labs",
    href: "https://sesamelabs.ai",
  };
  return (
    <p>
      {attribution.prefix}{" "}
      <a
        href={attribution.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline underline-offset-4 transition-colors hover:text-white"
      >
        {attribution.label}
      </a>
    </p>
  );
}

// Extra footer links for a campaign route (for example the PLMA offer terms). Nothing elsewhere.
export function FooterCampaignLinks() {
  const links = getCampaign(usePathname())?.footerLinks;
  if (!links?.length) return null;
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="font-medium underline underline-offset-4 transition-colors hover:text-white">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
