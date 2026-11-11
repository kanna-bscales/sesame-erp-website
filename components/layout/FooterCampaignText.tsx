"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCampaign } from "@/lib/campaign";

// Footer lines that a campaign page can replace (see lib/campaign.ts). Defaults are unchanged.

export function FooterTagline({ children }: { children: string }) {
  const campaign = getCampaign(usePathname());
  return <>{campaign?.footerTagline ?? children}</>;
}

// Public brand is SesameERP. Parent company: Business Scales (attribution and PLMA offer
// sponsorship confirmed by the owner, Nov 11, 2026). Campaign routes may set their own line.
export function FooterAttribution() {
  const attribution = getCampaign(usePathname())?.attribution ?? {
    prefix: "A product of",
    label: "Business Scales",
    href: "https://businessscales.com/",
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

// Contact column. Campaign routes show the offer sponsor's company information instead of the
// site's general contact email.
export function FooterContactColumn({ email }: { email: string }) {
  const info = getCampaign(usePathname())?.companyInfo;
  const link = "underline-offset-4 transition-colors hover:text-white hover:underline";

  if (!info) {
    return (
      <div className="md:col-span-2">
        <h2 className="text-sm font-semibold">Contact</h2>
        <ul className="mt-4 space-y-2 text-night-soft">
          <li>
            <a href={`mailto:${email}`} className="transition-colors hover:text-white">
              {email}
            </a>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="md:col-span-6 lg:col-span-5">
      <h2 className="text-sm font-semibold">Company information</h2>
      <dl className="mt-4 grid gap-x-8 gap-y-3 text-night-soft sm:grid-cols-2">
        <div>
          <dt className="text-sm">{info.sponsorLabel}</dt>
          <dd className="font-semibold text-white">{info.sponsor}</dd>
        </div>
        {info.links.map((item) => (
          <div key={item.label}>
            <dt className="text-sm">{item.label}</dt>
            <dd>
              <a
                href={item.href}
                {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`font-medium text-white ${link}`}
              >
                {item.text}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
