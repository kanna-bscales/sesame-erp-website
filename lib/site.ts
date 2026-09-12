// Placeholder brand and contact details — see docs/placeholders.md before launch.
export const site = {
  name: "SesameERP",
  description:
    "Custom ERP systems built around how your business works, with AI agents built in. A working system delivered in as little as seven weeks.",
  consultationHref: "mailto:hello@example.com?subject=ERP%20consultation",
  email: "hello@example.com",
  phoneDisplay: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  address: ["Office address line 1", "City, State 000000"],
  copyrightYear: 2026,
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "X", href: "#" },
  ],
};

// Each service needs a matching route in app/ and a content file in content/.
export const services = [
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
