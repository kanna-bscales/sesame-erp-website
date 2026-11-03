// PLMA 2026 Free ERP Module Offer — Promotion Terms for /plma-2026-terms.
// Mirrors docs/content-plma-2026-terms.md — keep wording in sync.
//
// Commercial and legal choices made by the business on 3 November 2026: sponsor Business Scales LLC,
// Delaware governing law, no fixed closing date, liability capped at US$5,000,
// contact info@business-scales.com. Legal review before launch is still recommended
// (see docs/plma-2026-terms-approval-checklist.md).
//
// Search engines: the page stays `noindex` until `termsStatus.indexable` is set to true.
// PDF: public/legal/plma-2026-offer-terms.pdf is a snapshot of this page. Regenerate it whenever
// these terms change (instructions in the checklist) and update `pdf.version`.

export const termsPath = "/plma-2026-terms";
export const campaignHref = "/chicago-event";

export const termsStatus = {
  indexable: false,
};

export const termsLinkLabel = "PLMA Offer Terms & Conditions";

// Clickwrap acceptance in the request form (components/chicago-event/ZohoLeadForm.tsx).
export const termsAcceptance = {
  before: "I have read and accept the",
  link: "PLMA 2026 Free ERP Module Offer Terms & Conditions",
  error: "Please accept the offer terms to submit your request.",
};

export const termsMeta = {
  updated: "November 3, 2026",
  effective: "November 3, 2026",
  sponsor: "Business Scales LLC",
  product: "SesameERP",
};

export const termsHero = {
  breadcrumb: "Offer terms",
  eyebrow: "Promotion terms",
  title: "PLMA 2026 Free ERP Module Offer Terms & Conditions",
  summary:
    "These terms explain who can apply, what the offer includes, how applications are reviewed and the conditions that apply to development work delivered through the offer.",
  badges: ["US$5,000 development value", "One custom ERP module", "PLMA exclusive offer", "Reviewed individually"],
  backToCampaign: "Back to the PLMA 2026 offer",
  request: "Request your free ERP module",
  print: "Print",
  downloadPdf: "Download PDF",
};

export const pdf = {
  href: "/legal/plma-2026-offer-terms.pdf",
  fileName: "SesameERP-PLMA-2026-Offer-Terms.pdf",
  version: "November 3, 2026",
};

export const termsSummary = {
  title: "Offer at a glance",
  items: [
    "Eligible PLMA 2026 participants can apply for development services valued up to US$5,000 for one approved ERP module.",
    "The offer is development effort only. It has no cash value and cannot be exchanged, refunded or transferred.",
    "Every application is reviewed individually. Approval is at the sole discretion of Business Scales.",
    "Hosting, infrastructure, third-party licences and integration costs are not included.",
  ],
};

export type Callout = { tone: "important" | "limitation" | "approval"; title: string; text?: string; items?: string[] };

type Block =
  | { type: "p"; text: string }
  | { type: "list"; lead?: string; items: string[] }
  | { type: "includes"; title: string; items: string[] }
  | { type: "excludes"; title: string; items: string[] }
  | { type: "steps"; items: { title: string; body: string }[] }
  | { type: "callout"; callout: Callout }
  | { type: "contact" };

export type TermsSection = { id: string; title: string; blocks: Block[] };

export const termsContact = {
  company: "Business Scales LLC",
  website: { label: "business-scales.com", href: "https://business-scales.com/" },
  product: { label: "sesameerp.ai", href: "https://sesameerp.ai/" },
  email: "info@business-scales.com",
};

export const termsSections: TermsSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    blocks: [
      {
        type: "p",
        text: "These Promotion Terms (\"Terms\") govern the PLMA 2026 Free ERP Module Offer (the \"Offer\"). The Offer is sponsored by Business Scales LLC (\"Business Scales\", \"we\", \"us\"). SesameERP is a product of Business Scales.",
      },
      {
        type: "p",
        text: "The purpose of the Offer is to help businesses connected with PLMA's 2026 Private Label Trade Show see how a custom ERP module built with SesameERP can improve their operations.",
      },
      {
        type: "p",
        text: "These Terms apply only to this Offer. They are in addition to any other agreement you sign with Business Scales. Business Scales reserves the right to modify or withdraw this promotion at any time.",
      },
    ],
  },
  {
    id: "offer-description",
    title: "Offer description",
    blocks: [
      {
        type: "p",
        text: "Eligible participants may receive development services valued up to US$5,000 for one approved ERP module, delivered by Business Scales using SesameERP.",
      },
      {
        type: "list",
        lead: "The Offer represents development effort only. It is not:",
        items: ["Cash", "A rebate", "Store credit", "Account credit", "A refund", "A discount", "A transferable asset"],
      },
      {
        type: "callout",
        callout: {
          tone: "important",
          title: "Important",
          text: "The US$5,000 figure describes the value of the development effort. Unused value cannot be carried over, exchanged or paid out.",
        },
      },
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    blocks: [
      {
        type: "list",
        lead: "To apply, you must:",
        items: [
          "Represent a legally operating business",
          "Attend or participate in PLMA 2026-related activities",
          "Submit accurate and complete information",
          "Have a genuine business use case for an ERP module",
          "Take part in a discovery discussion if we request one",
        ],
      },
      {
        type: "list",
        lead: "Business Scales may reject applications that:",
        items: [
          "Contain false or fraudulent information",
          "Are incomplete",
          "Fall outside the ERP scope of the Offer",
          "Would violate any law or regulation",
        ],
      },
      {
        type: "callout",
        callout: {
          tone: "approval",
          title: "Approval requirements",
          text: "Meeting the eligibility criteria does not guarantee approval. Each application is assessed individually against the scope and capacity of the Offer.",
        },
      },
    ],
  },
  {
    id: "scope",
    title: "Scope of the offer",
    blocks: [
      {
        type: "p",
        text: "The Offer covers one ERP module: a single functional area of business operations, built as a custom SesameERP module.",
      },
      {
        type: "includes",
        title: "Eligible examples",
        items: [
          "Inventory management",
          "Purchase management",
          "Sales management",
          "Warehouse operations",
          "Vendor management",
          "Production tracking",
          "Reporting dashboard",
          "Approval workflows",
        ],
      },
      {
        type: "excludes",
        title: "Not included",
        items: [
          "A complete ERP platform",
          "Website development",
          "Marketing systems",
          "CRM systems",
          "Mobile applications",
          "Third-party software licences",
          "Infrastructure and hosting fees",
        ],
      },
      {
        type: "p",
        text: "The final scope of the module, and whether requested work falls within the US$5,000 value, is determined solely by Business Scales. Work beyond the approved scope is not part of the Offer and would require a separate agreement.",
      },
    ],
  },
  {
    id: "request-process",
    title: "Request and review process",
    blocks: [
      {
        type: "steps",
        items: [
          { title: "Submit application", body: "Complete the request form on the SesameERP PLMA 2026 page." },
          { title: "Business review", body: "Our team reviews your business details and ERP requirements." },
          { title: "Discovery discussion", body: "We may meet with you to understand your processes." },
          { title: "Scope definition", body: "We define the module and what it will include." },
          { title: "Approval decision", body: "We confirm whether your application is approved." },
          { title: "Development planning", body: "Approved projects move to planning and scheduling." },
        ],
      },
      {
        type: "callout",
        callout: {
          tone: "approval",
          title: "Approval",
          items: ["Submitting an application does not guarantee approval.", "Approval is entirely at the discretion of Business Scales."],
        },
      },
    ],
  },
  {
    id: "validity",
    title: "Offer validity",
    blocks: [
      {
        type: "p",
        text: "No fixed closing date has been set for this Offer. Business Scales may extend, shorten, suspend or cancel the Offer at any time, without notice. If a closing date is introduced, it will be published on this page, and applications must be submitted before it.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Development and delivery",
    blocks: [
      {
        type: "list",
        lead: "Approved projects may require:",
        items: ["Requirement workshops", "Business process discussions", "User approval meetings"],
      },
      {
        type: "list",
        lead: "Estimated delivery timelines depend on:",
        items: ["The complexity of the scope", "Resource availability", "Your responsiveness during the project"],
      },
      {
        type: "p",
        text: "Any timeline shared with you is an estimate. No guaranteed delivery date is provided under this Offer.",
      },
    ],
  },
  {
    id: "customer-responsibilities",
    title: "Customer responsibilities",
    blocks: [
      {
        type: "list",
        lead: "If your application is approved, you agree to:",
        items: [
          "Provide accurate information",
          "Attend scheduled meetings",
          "Review deliverables promptly",
          "Provide access to the systems the module needs",
          "Supply required materials, such as data, documents and sample records",
        ],
      },
      { type: "p", text: "Delays caused by the customer may affect delivery schedules." },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    blocks: [
      {
        type: "p",
        text: "Custom deliverables developed for you through this Offer may be transferred to you following project completion, on the terms set out in your project agreement.",
      },
      {
        type: "p",
        text: "Pre-existing software, frameworks, tools, libraries, AI systems and other proprietary technology used to build the module remain the property of Business Scales.",
      },
    ],
  },
  {
    id: "third-party-services",
    title: "Third-party services",
    blocks: [
      {
        type: "list",
        lead: "Business Scales is not responsible for:",
        items: ["Third-party platforms", "Cloud and hosting vendors", "APIs", "Integration vendors"],
      },
      {
        type: "p",
        text: "Any costs for these services, including hosting, licences, subscriptions and usage fees, remain the customer's responsibility.",
      },
    ],
  },
  {
    id: "no-warranty",
    title: "No warranty",
    blocks: [
      {
        type: "p",
        text: "Except as expressly agreed in a separate written agreement, the Offer and any module delivered through it are provided \"as is\". Business Scales does not warrant uninterrupted or error-free operation, specific business results, or fitness for a particular purpose.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of liability",
    blocks: [
      {
        type: "list",
        lead: "To the fullest extent permitted by law, Business Scales shall not be liable for:",
        items: [
          "Lost profits",
          "Loss of revenue",
          "Business interruption",
          "Loss of data",
          "Indirect damages",
          "Consequential damages",
        ],
      },
      {
        type: "p",
        text: "Business Scales' total liability arising from or relating to this Offer is limited to US$5,000.",
      },
      {
        type: "callout",
        callout: {
          tone: "limitation",
          title: "Limitations",
          text: "Nothing in these Terms limits or excludes liability for fraud, gross negligence, death or personal injury, or any other liability that cannot be limited or excluded under applicable law.",
        },
      },
    ],
  },
  {
    id: "refusal-termination",
    title: "Right to refuse, pause or terminate",
    blocks: [
      {
        type: "list",
        lead: "Business Scales may reject an application, pause development or cancel participation if the customer:",
        items: [
          "Violates these Terms",
          "Misrepresents information",
          "Engages in abusive conduct",
          "Becomes non-responsive",
        ],
      },
    ],
  },
  {
    id: "modifications",
    title: "Modifications",
    blocks: [
      {
        type: "p",
        text: "Business Scales may modify the promotion, the eligibility requirements, the scope or these Terms at any time. Changes take effect when published on this page, and the \"Offer updated\" date will change. Continued participation in the Offer constitutes acceptance of the revised Terms.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy and data use",
    blocks: [
      {
        type: "p",
        text: "Information you submit is used to review your application, contact you about the Offer and the SesameERP services you asked about, and administer the promotion. It is stored in our customer relationship management system (Zoho CRM).",
      },
      {
        type: "p",
        text: "To ask about, correct or delete the information you submitted, email info@business-scales.com.",
      },
    ],
  },
  {
    id: "governing-law",
    title: "Governing law",
    blocks: [
      {
        type: "p",
        text: "These Terms are governed by the laws of the State of Delaware, USA, without regard to its conflict-of-laws principles.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact information",
    blocks: [{ type: "p", text: "Questions about this Offer or these Terms:" }, { type: "contact" }],
  },
  {
    id: "acceptance",
    title: "Acceptance",
    blocks: [
      {
        type: "list",
        lead: "By submitting an application, you acknowledge that:",
        items: [
          "You have read these Terms.",
          "You understand that approval is not guaranteed.",
          "Participation does not create a binding commercial agreement.",
          "Additional agreements may be required before development begins.",
        ],
      },
    ],
  },
];

export const termsFaq = {
  heading: "Offer terms FAQ",
  items: [
    {
      q: "Who qualifies?",
      a: "Legally operating businesses that attend or take part in PLMA 2026-related activities and have a genuine use case for an ERP module. Every application is reviewed individually.",
    },
    {
      q: "What counts as one ERP module?",
      a: "A single functional area such as inventory, purchasing, sales, warehouse operations, vendor management, production tracking, a reporting dashboard or approval workflows. A complete ERP platform is not included. Business Scales determines the final scope.",
    },
    {
      q: "Is approval guaranteed?",
      a: "No. Submitting an application does not guarantee approval, and approval is at the sole discretion of Business Scales.",
    },
    {
      q: "Is hosting included?",
      a: "No. Hosting, infrastructure, third-party licences and integration costs remain the customer's responsibility.",
    },
    {
      q: "Do I own the completed module?",
      a: "Custom deliverables built for you may be transferred following project completion, under your project agreement. Business Scales' pre-existing software, frameworks, tools and AI systems remain its property.",
    },
    {
      q: "Can I request changes?",
      a: "Yes, within the approved scope, during the review points agreed for your project. Changes beyond the approved scope are not part of the Offer and would need a separate agreement.",
    },
  ],
};

export const termsSeo = {
  title: "PLMA 2026 Offer Terms & Conditions | SesameERP",
  description:
    "Review the terms and conditions for the SesameERP PLMA 2026 free ERP module offer, representing US$5,000 worth of development work.",
  path: termsPath,
};

// Rough reading time for the hero, from the words on the page.
export function termsReadingMinutes(): number {
  const parts: string[] = [termsHero.summary, ...termsSummary.items];
  for (const section of termsSections) {
    for (const block of section.blocks) {
      if (block.type === "p") parts.push(block.text);
      if (block.type === "list") parts.push(block.lead ?? "", ...block.items);
      if (block.type === "includes" || block.type === "excludes") parts.push(...block.items);
      if (block.type === "steps") block.items.forEach((s) => parts.push(s.title, s.body));
      if (block.type === "callout") parts.push(block.callout.text ?? "", ...(block.callout.items ?? []));
    }
  }
  termsFaq.items.forEach((item) => parts.push(item.q, item.a));
  const words = parts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
