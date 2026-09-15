// Placeholder brand and contact details — see docs/placeholders.md before launch.
export const site = {
  name: "SesameERP",
  description:
    "Custom ERP systems built around how your business works, with AI agents built in. A working system delivered in a few weeks.",
  consultationHref: "/contact",
  email: "hi@sesamelabs.ai",
  copyrightYear: 2026,
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "X", href: "#" },
  ],
};

// Owner asked to hide the solution pages from navigation for now. The pages still work at their
// URLs; set this to true to show the Solutions menu, mobile list and footer column again.
export const showSolutions = false;

// Each solution needs a matching route in app/ and a content file in content/.
// Industry pages come from content/industries.ts.
export const solutions = [
  {
    label: "Manufacturing",
    href: "/manufacturing",
    description: "Pricing chains, RFQs and stock across raw, semi-finished and finished goods.",
  },
  {
    label: "Restaurant",
    href: "/restaurant",
    description: "Supplier costs, kitchen stock and dish costing across every outlet.",
  },
  {
    label: "Retail",
    href: "/retail",
    description: "Stock, purchasing and pricing across every store and channel.",
  },
  {
    label: "Wireless ERP",
    href: "/wireless-erp",
    description: "Phone and tablet inventory, tracked by IMEI from import to agent.",
  },
];

// Homepage sections. Rendered through SectionLink so they work from any page.
export const navLinks = [
  { label: "How it works", hash: "#process" },
  { label: "AI agents", hash: "#agents" },
  { label: "Modules", hash: "#modules" },
  { label: "FAQ", hash: "#faq" },
];

export const HEADER_OFFSET = -72;
