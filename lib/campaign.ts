import { anchors, campaignChrome, campaignPath } from "@/content/chicago-event";
import { termsLinkLabel, termsPath } from "@/content/plma-2026-terms";

// Campaign pages can swap a few header and footer details (CTA, in-page section links, footer
// tagline, attribution and extra footer links). Every other route keeps the defaults from lib/site.ts.

const landing = {
  ...campaignChrome,
  footerLinks: [{ label: termsLinkLabel, href: termsPath }],
};

// The PLMA terms page shares the campaign header and footer; its CTAs lead back to the landing page.
const terms = {
  ...campaignChrome,
  path: termsPath,
  headerPrimary: { ...campaignChrome.headerPrimary, href: `${campaignPath}#${anchors.form}` },
  headerSecondary: { ...campaignChrome.headerSecondary, href: `${campaignPath}#${anchors.event}` },
  sectionLinks: {
    "#process": `${campaignPath}#${anchors.how}`,
    "#faq": `${campaignPath}#${anchors.faq}`,
  } as Record<string, string>,
  footerLinks: [
    { label: "PLMA 2026 offer", href: campaignPath },
    { label: termsLinkLabel, href: termsPath },
  ],
};

const campaigns = [landing, terms];

export type Campaign = (typeof campaigns)[number];

export function getCampaign(pathname: string | null): Campaign | null {
  if (!pathname) return null;
  const path = pathname.replace(/\/$/, "") || "/";
  return campaigns.find((campaign) => campaign.path === path) ?? null;
}
