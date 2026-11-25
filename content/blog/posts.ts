// SesameERP blog: one entry per article. The article body is the Markdown file
// content/blog/<slug>.md (rendered by lib/blog/markdown.tsx). Process, link rules and the link map
// are in docs/blog.md. Only entries with status "published" are built, listed and put in the
// sitemap. "draft" entries exist only under `npm run dev` (for review, marked Draft and noindex);
// a production build never contains them.

export type BlogFaq = { q: string; a: string };
export type BlogSource = { label: string; href: string; note: string };

export type BlogPost = {
  slug: string;
  status: "draft" | "published";
  /** H1 on the page. */
  title: string;
  /** <title> (the layout does not append the brand, so it is included here). Keep under 60 characters. */
  seoTitle: string;
  /** Meta description, 140–160 characters. */
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  cluster: "private-label" | "custom-erp" | "industry";
  author: string;
  /** ISO dates (yyyy-mm-dd). */
  published: string;
  updated: string;
  readingMinutes: number;
  /** Short summary shown at the top of the article and on the blog index. */
  excerpt: string;
  keyTakeaways: string[];
  /** Shown on the page AND in FAQPage structured data (never one without the other). */
  faq: BlogFaq[];
  sources: BlogSource[];
  /** Slugs of other PUBLISHED posts; checked at build time. */
  related: string[];
  cta: { heading: string; body: string; label: string; href: string };
};

export const blogPath = "/blog";

export const blogIndex = {
  seoTitle: "SesameERP Blog: ERP for Manufacturers",
  description:
    "Practical ERP guides for private label, food and contract manufacturers: requirements checklists, traceability, custom ERP modules and AI agents.",
  heading: "Insights",
  intro:
    "Practical guides for manufacturers choosing, replacing or extending an ERP system. Written by the SesameERP team; every factual claim is linked to its source.",
};

export const blogPosts: BlogPost[] = [
  {
    slug: "erp-for-private-label-manufacturers-checklist",
    status: "published",
    title: "ERP for Private Label Manufacturers: A Practical Requirements Checklist",
    seoTitle: "ERP for Private Label Manufacturers: Checklist | SesameERP",
    description:
      "ERP for private label manufacturers: a practical checklist for retailer specifications, formulas, lot traceability, inventory, planning, quality and costing.",
    primaryKeyword: "erp for private label manufacturers",
    secondaryKeywords: ["private label ERP software", "ERP for private label manufacturing", "private label manufacturing software"],
    cluster: "private-label",
    author: "SesameERP Team",
    published: "2026-11-20",
    updated: "2026-11-20",
    readingMinutes: 9,
    excerpt:
      "Ten requirements to test any ERP system against before you buy or upgrade, from customer-specific specifications and lot traceability to costing by customer and SKU.",
    keyTakeaways: [
      "Start from your customers' requirements (specifications, lot codes, documents), not from a vendor's feature list.",
      "Lot traceability from supplier lot to customer shipment is the requirement customers and auditors are most likely to test.",
      "Ask every vendor to demonstrate with your own products, two customer versions and one trace exercise.",
      "Packaged ERP covers standard processes; custom modules make sense where your process or your customers' requirements are different.",
    ],
    faq: [
      {
        q: "What is ERP for private label manufacturers?",
        a: "It is ERP software that runs a private label plant's purchasing, production, inventory, quality, sales and finance while keeping each customer's specifications, item numbers, labels and documents separate. The same base product can then be made, traced and costed for several customers without spreadsheets in between.",
      },
      {
        q: "Which ERP feature matters most for a private label manufacturer?",
        a: "It depends on your customers, but lot traceability and customer-specific specifications are usually the first things customers and auditors check. If you cannot trace a finished lot back to its supplier lots and forward to every customer shipment, start there.",
      },
      {
        q: "Does the FDA Food Traceability Rule (FSMA 204) apply to private label food manufacturers?",
        a: "It applies to companies that manufacture, process, pack or hold foods on FDA's Food Traceability List, whatever brand is on the label. FDA has said it will not enforce the rule before July 20, 2028, following a directive from Congress. Check the list for your products and ingredients. This is general information, not legal advice.",
      },
      {
        q: "Should a private label manufacturer choose packaged ERP or custom ERP modules?",
        a: "Choose packaged ERP where your processes are standard, and consider custom modules where your process is a competitive advantage or a customer requirement is not covered. Many manufacturers combine both: packaged software for accounting and standard functions, custom modules for the rest.",
      },
    ],
    sources: [
      {
        label: "7-Eleven, Vendor/Supplier Guidelines (last updated June 1, 2026)",
        href: "https://www.7-eleven.com/legal/vendor-supplier-guidelines",
        note: "Lot or batch identification, lot codes on the smallest pack size, formula and ingredient information and change records.",
      },
      {
        label: "The Hershey Company, Supplier Quality Expectations Manual (August 11, 2025)",
        href: "https://www.thehersheycompany.com/content/dam/hersheyterms/supplier-code-of-conduct/supplier-quality-expectations-manual-english.pdf",
        note: "Lot tracking from receipt through usage, Certificates of Analysis and approval of changes before implementation.",
      },
      {
        label: "U.S. FDA, FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods",
        href: "https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods",
        note: "Food Traceability List, Key Data Elements, Critical Tracking Events, traceability plan, 24-hour sortable spreadsheet and the July 20, 2028 enforcement date.",
      },
    ],
    related: ["erp-for-co-packers-contract-manufacturers", "packaged-erp-vs-custom-erp"],
    cta: {
      heading: "Found gaps in your current system?",
      body: "SesameERP builds custom ERP systems with AI agents built in. We can review your requirements with you and suggest which modules to build first.",
      label: "Schedule a consultation",
      href: "/contact",
    },
  },
  {
    slug: "erp-for-co-packers-contract-manufacturers",
    status: "published",
    title: "ERP for Co-Packers and Contract Manufacturers: A Practical Guide",
    seoTitle: "ERP for Co-Packers and Contract Manufacturers | SesameERP",
    description:
      "ERP for co-packers: how ERP helps co-packers manage customer orders, customer-owned stock, production scheduling, quality, traceability and costing.",
    primaryKeyword: "erp for co-packers",
    secondaryKeywords: ["ERP for contract manufacturers", "co-packer ERP software", "contract manufacturing ERP software"],
    cluster: "private-label",
    author: "SesameERP Team",
    published: "2026-11-20",
    updated: "2026-11-20",
    readingMinutes: 9,
    excerpt:
      "What co-packers and contract manufacturers need from an ERP system: customer-owned stock, shared-line scheduling, traceability across customers, and quote-versus-actual costing.",
    keyTakeaways: [
      "A co-packer runs a slightly different business for every customer, so customer rules, items and records must be kept separate in one system.",
      "Customer-owned (toll or consigned) materials need ownership on every lot, separate reporting and reconciliation.",
      "Quote from actual run data and compare quote with actual cost for every run.",
      "Test vendors with your own week of orders, a customer-supplied material and a trace across two customers.",
    ],
    faq: [
      {
        q: "What is ERP software for co-packers?",
        a: "It is ERP software that runs a co-packing plant's quoting, purchasing, receiving, scheduling, production, quality, shipping and invoicing while keeping each customer's items, materials, rules and records separate.",
      },
      {
        q: "What is the difference between a co-packer and a contract manufacturer?",
        a: "The terms overlap. A co-packer (contract packer) usually manufactures and/or packs finished products for other brands; contract manufacturer is the broader term for producing goods for another company to its specifications. Many plants do both.",
      },
      {
        q: "How does ERP manage customer-owned inventory?",
        a: "Each lot is recorded with its owner when it is received. Customer-owned materials can then only be used for that customer's orders, are reported back to the customer with usage, waste and remaining balances, and can be accounted for in line with your agreements and your accountant's advice.",
      },
      {
        q: "Can ERP manage multiple customer production orders on the same lines?",
        a: "Yes. A suitable ERP shows every customer's runs on one schedule, checks that materials (including customer-supplied ones) are available, and makes changeovers such as allergen cleans visible, so that changes to one order can be planned around the others.",
      },
      {
        q: "How does ERP help co-packers with batch and lot traceability?",
        a: "It records which supplier and customer-supplied lots were used in each batch and where every finished lot was shipped. One search can then show the contents and destinations of a lot across all customers.",
      },
      {
        q: "Can a co-packer use custom ERP modules?",
        a: "Yes. Many co-packers keep accounting and standard functions on packaged software and add custom modules where their process is different, such as customer stock reporting, quoting from their own line-time data or a customer portal.",
      },
    ],
    sources: [
      {
        label: "7-Eleven, Vendor/Supplier Guidelines (last updated June 1, 2026)",
        href: "https://www.7-eleven.com/legal/vendor-supplier-guidelines",
        note: "Proprietary Product Suppliers Addendum (suppliers of 7-Eleven's own-brand products): records documenting the use of co-packers or third-party manufacturers; current lists of ingredient suppliers.",
      },
      {
        label: "U.S. FDA, FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods",
        href: "https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods",
        note: "Applies to businesses that manufacture, process, pack or hold foods on the Food Traceability List, unless exempt; FDA will not enforce it before July 20, 2028.",
      },
    ],
    related: ["erp-for-private-label-manufacturers-checklist", "customer-owned-inventory-tracking"],
    cta: {
      heading: "Managing many customers' orders, stock and production?",
      body: "Talk to SesameERP about ERP built around your manufacturing operations, from customer-owned stock to quote-versus-actual costing.",
      label: "Discuss your ERP requirements",
      href: "/contact",
    },
  },
  {
    slug: "packaged-erp-vs-custom-erp",
    status: "published",
    title: "Packaged ERP vs Custom ERP Modules: How to Decide",
    seoTitle: "Packaged ERP vs Custom ERP: How to Decide | SesameERP",
    description:
      "Packaged ERP vs custom ERP modules: when each fits, the real trade-offs in cost, fit and upgrades, and a simple way to decide process by process.",
    primaryKeyword: "packaged erp vs custom erp",
    secondaryKeywords: ["off-the-shelf vs custom ERP", "best ERP for private label manufacturers", "hybrid ERP"],
    cluster: "custom-erp",
    author: "SesameERP Team",
    published: "2026-11-25",
    updated: "2026-11-25",
    readingMinutes: 8,
    excerpt:
      "When packaged ERP fits, when custom modules make more sense, and a six-step way to decide process by process instead of all at once.",
    keyTakeaways: [
      "Packaged ERP vs custom ERP is rarely one decision: decide process by process.",
      "Keep packaged software for standard work such as accounting and payroll.",
      "Consider custom modules where your process is your advantage, a customer requires it, or spreadsheets have become the real system.",
      "Start with the one module that removes the most manual work, and agree who maintains it before you build.",
    ],
    faq: [
      {
        q: "What is the difference between packaged and custom ERP?",
        a: "Packaged ERP is built once by a vendor for many companies and configured for each one. Custom ERP is built around one company's processes, either as a full system or as individual modules that run alongside packaged software.",
      },
      {
        q: "Is custom ERP more expensive than packaged ERP?",
        a: "It depends on scope. Building only the modules a package cannot cover is usually a smaller project than replacing everything. Compare the total cost over several years, including implementation, integrations, training and support, not only the first-year price.",
      },
      {
        q: "Can I use packaged ERP and custom modules together?",
        a: "Yes. Many manufacturers keep accounting and other standard functions on a package and add custom modules for the processes that set them apart. Agree which system holds each record and how data moves between them.",
      },
      {
        q: "What is the best ERP for private label manufacturers?",
        a: "The one that passes a demo with your own products, two customer versions and a trace exercise. Often that is a package for the standard functions plus custom modules for customer-specific requirements.",
      },
    ],
    sources: [],
    related: ["erp-for-private-label-manufacturers-checklist", "erp-for-co-packers-contract-manufacturers"],
    cta: {
      heading: "Not sure which processes need a custom module?",
      body: "SesameERP builds custom ERP systems with AI agents built in. We can go through your processes with you and suggest which module to build first.",
      label: "Schedule a consultation",
      href: "/contact",
    },
  },
  {
    slug: "customer-owned-inventory-tracking",
    status: "published",
    title: "Customer-Owned Inventory: How Co-Packers Track Toll and Consigned Materials",
    seoTitle: "Customer-Owned Inventory Tracking for Co-Packers | SesameERP",
    description:
      "Customer-owned inventory tracking for co-packers: how to record ownership on every lot, track usage and waste per run, and reconcile toll and consigned stock.",
    primaryKeyword: "customer owned inventory tracking",
    secondaryKeywords: ["toll manufacturing inventory", "consigned inventory tracking", "customer-owned inventory software"],
    cluster: "private-label",
    author: "SesameERP Team",
    published: "2026-11-25",
    updated: "2026-11-25",
    readingMinutes: 8,
    excerpt:
      "How co-packers keep customer-supplied materials separate: ownership on every lot, usage and waste per run, reconciliation and stock reports each customer can trust.",
    keyTakeaways: [
      "Make the owner part of every lot record, so customer-owned stock can only be used for that customer's orders.",
      "Record issued, used, waste and returned quantities for every run, by lot.",
      "Reconcile on a schedule and send each customer a stock report in its own item numbers.",
      "Agree the accounting treatment with your accountant; the ERP's job is reliable quantities by owner.",
    ],
    faq: [
      {
        q: "What is customer-owned inventory?",
        a: "It is material that a customer supplies to a co-packer or contract manufacturer, such as ingredients, packaging or labels, and that usually remains the customer's property under the agreement while it is stored and used at the manufacturer's plant.",
      },
      {
        q: "What is the difference between toll and consigned materials?",
        a: "The terms are often used together. In toll manufacturing the customer supplies materials and pays the manufacturer for the work of processing them. Consigned materials are goods held at your site that still belong to the party that supplied them. In both cases the owner has to be recorded on every lot.",
      },
      {
        q: "How do co-packers track customer-owned inventory?",
        a: "By recording the owner on each lot when it is received, allowing that lot to be issued only to the owner's orders, recording usage, waste and returns for every run, and reconciling and reporting balances to each customer on a regular schedule.",
      },
      {
        q: "How often should customer-owned stock be reconciled?",
        a: "On a regular schedule agreed with each customer, and after every physical count. Regular reconciliation finds differences while the runs that caused them can still be checked.",
      },
      {
        q: "Can ERP software report stock back to each customer?",
        a: "Yes. A suitable ERP produces a report per customer showing opening balance, receipts, usage by run, waste and closing balance by item and lot, using the customer's own item numbers.",
      },
    ],
    sources: [
      {
        label: "7-Eleven, Vendor/Supplier Guidelines (last updated June 1, 2026)",
        href: "https://www.7-eleven.com/legal/vendor-supplier-guidelines",
        note: "Proprietary Product Suppliers Addendum (suppliers of 7-Eleven's own-brand products): records documenting the use of co-packers or third-party manufacturers.",
      },
    ],
    related: ["erp-for-co-packers-contract-manufacturers", "packaged-erp-vs-custom-erp"],
    cta: {
      heading: "Holding materials for several customers?",
      body: "Talk to SesameERP about ERP built around your plant, with ownership on every lot and stock reports your customers can rely on.",
      label: "Discuss your ERP requirements",
      href: "/contact",
    },
  },
];

// Newest first; on the same date, the post added later to blogPosts counts as newer.
const newestFirst = (a: BlogPost, b: BlogPost) =>
  b.published.localeCompare(a.published) || blogPosts.indexOf(b) - blogPosts.indexOf(a);

export const publishedPosts = () => blogPosts.filter((p) => p.status === "published").sort(newestFirst);

/** Posts that exist in this build: published ones, plus drafts under `npm run dev` only. */
export const visiblePosts = () =>
  blogPosts
    .filter((p) => p.status === "published" || process.env.NODE_ENV === "development")
    .sort(newestFirst);

export const postUrl = (slug: string) => `${blogPath}/${slug}`;
