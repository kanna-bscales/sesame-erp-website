// Approved homepage copy. Mirrors docs/content-homepage.md — keep wording in sync.

export const hero = {
  eyebrow: "AI-powered custom ERP development",
  headline: ["Custom ERP systems,", "built fast."],
  headlineSecond: "Powered by AI agents.",
  subheadline:
    "We design and build ERP systems around how your business actually works — not the other way around. Every system we ship comes with AI agents built in, and a working system is delivered in a few weeks.",
  primaryCta: "Schedule a consultation",
  secondaryCta: "See how it works",
};

export const stats = [
  "Delivered in a few weeks, not months",
  "100% custom-built — not a template",
  "AI agents included, not an add-on",
  "Direct support from the team that builds it",
];

export const whyUs = {
  headingLead: "Built around your business, not",
  headingFlip: "the other way around",
  items: [
    {
      title: "Fast delivery",
      body: "Most ERP rollouts run for six months or more. We scope, build, and deliver a working system in a few weeks — so you're running on it, not waiting on it.",
    },
    {
      title: "Fully custom",
      body: "No forced workflows or unused modules. We build exactly what your business needs, matched to how your team already operates.",
    },
    {
      title: "AI agents built in",
      body: "Every system we build includes AI agents that handle repetitive work automatically — quotations, stock alerts, data entry, and customer replies — so your team spends less time on busywork.",
    },
    {
      title: "Direct ongoing support",
      body: "You work directly with the team that built your system, so changes and fixes happen fast, without layers of support tickets.",
    },
  ],
};

export type ProcessStep = {
  title: string;
  weeks: string;
  span: [number, number];
  body: string;
};

export const howWeWork: { heading: string; steps: ProcessStep[] } = {
  heading: "From consultation to live system in a few weeks",
  steps: [
    {
      title: "Discovery call",
      weeks: "Week 1",
      span: [1, 1],
      body: "We learn your workflow, current bottlenecks, and what a good system looks like for your business.",
    },
    {
      title: "Design & planning",
      weeks: "Week 2",
      span: [2, 2],
      body: "We map out the modules, data flow, and AI agents your system needs.",
    },
    {
      title: "Build & AI integration",
      weeks: "Weeks 3 and 4",
      span: [3, 4],
      body: "We build the full system and wire in the AI agents for the tasks you want automated.",
    },
    {
      title: "Deploy & launch",
      weeks: "Weeks x1 to x3",
      span: [5, 7],
      body: "Your system goes live, your team gets a walkthrough, and we stay on for support.",
    },
  ],
};

export type AgentId = "sales" | "inventory" | "support" | "data-entry" | "reports";

export const agents: {
  heading: string;
  intro: string;
  items: { id: AgentId; name: string; body: string }[];
} = {
  heading: "Not just software — a system that works for you",
  intro:
    "Every ERP we build can include AI agents that actively do work inside your system, not just store data.",
  items: [
    {
      id: "sales",
      name: "AI Sales Assistant",
      body: "Drafts quotations and responds to RFQs automatically based on your pricing rules.",
    },
    {
      id: "inventory",
      name: "AI Inventory Forecaster",
      body: "Flags low stock and predicts reorder points before you run out.",
    },
    {
      id: "support",
      name: "AI Customer Support Agent",
      body: "Answers common customer questions about orders and stock status.",
    },
    {
      id: "data-entry",
      name: "AI Data Entry Agent",
      body: "Reads incoming purchase orders, invoices, or vendor quotes and enters them into the system automatically.",
    },
    {
      id: "reports",
      name: "AI Report Generator",
      body: "Turns your raw data into plain-language summaries for sales, stock, and purchasing on demand.",
    },
  ],
};

export type ManufacturingNeed = "pricing" | "rfq" | "conversions" | "bundles";

export const manufacturingNeeds: Record<ManufacturingNeed, { label: string; tag: string }> = {
  pricing: {
    label: "Raw material → semi-finished → finished goods pricing chains",
    tag: "Pricing chains",
  },
  rfq: { label: "RFQ-driven procurement for multiple vendors", tag: "Multi-vendor RFQs" },
  conversions: {
    label: "Stock tracking across manufacturing conversions",
    tag: "Conversion tracking",
  },
  bundles: {
    label: "Composite/bundled product structures for finished goods",
    tag: "Bundled products",
  },
};

export type ErpModule = { name: string; body: string; manufacturing?: ManufacturingNeed };

export const modules: {
  heading: string;
  groups: { title: string; items: ErpModule[] }[];
  custom: { heading: string; body: string; cta: string };
} = {
  heading: "Every module your business needs, custom-fit",
  custom: {
    heading: "Need a module that isn't listed?",
    body: "Tell us how your team works, and we'll design and build that module into your system.",
    cta: "Schedule a consultation",
  },
  groups: [
    {
      title: "Customers and vendors",
      items: [
        {
          name: "Customer & Vendor Management",
          body: "A complete database of customers and vendors for efficient communication and transaction tracking.",
        },
        {
          name: "Vendor Portal",
          body: "A dedicated space for vendors to manage orders, view purchase history, and update product info.",
        },
        {
          name: "Customer Portal",
          body: "Customers can check order status, track shipments, and browse product info securely online.",
        },
      ],
    },
    {
      title: "Selling and pricing",
      items: [
        {
          name: "Product Catalog & Pricing",
          body: "A detailed, centralized list of products and pricing kept consistent and accurate across the system.",
          manufacturing: "pricing",
        },
        {
          name: "Automated Price Update Chain",
          body: "Product prices update automatically when raw material costs change, keeping semi-finished and finished goods pricing in sync.",
          manufacturing: "pricing",
        },
        {
          name: "Quotations",
          body: "Generate professional, accurate quotations that communicate pricing and product details clearly to customers.",
        },
        {
          name: "Sales Orders",
          body: "Convert quotations into orders and track them from confirmation through fulfillment.",
        },
      ],
    },
    {
      title: "Buying",
      items: [
        {
          name: "Request for Quotation (RFQ)",
          body: "Send RFQs to vendors and compare quotes side by side to choose the best supplier.",
          manufacturing: "rfq",
        },
        {
          name: "Indent Management",
          body: "Raise and track internal material requests so procurement always has visibility into what's needed and when.",
        },
        {
          name: "Purchase Orders",
          body: "Create and track purchase orders for raw materials and inventory, with full control over procurement.",
          manufacturing: "rfq",
        },
      ],
    },
    {
      title: "Stock",
      items: [
        {
          name: "Inventory Management",
          body: "Track raw materials, semi-finished, and finished goods to avoid stockouts and excess inventory.",
          manufacturing: "conversions",
        },
        {
          name: "Real-Time Stock Updates",
          body: "Live visibility into stock movement from purchases, sales, manufacturing, and adjustments.",
          manufacturing: "conversions",
        },
        {
          name: "Composite & Bundled Products",
          body: "Handle multi-part or bundled products with accurate inventory and pricing across the whole structure.",
          manufacturing: "bundles",
        },
        {
          name: "Stock Adjustment",
          body: "Correct inventory levels for discrepancies or damage while keeping records accurate.",
        },
      ],
    },
  ],
};

export const manufacturing: {
  heading: string;
  intro: string;
  lead: string;
  needs: ManufacturingNeed[];
} = {
  heading: "Example: what we build for manufacturing",
  intro:
    "Unlock the full potential of your manufacturing operation with an ERP built specifically for how your shop floor, sales, and procurement teams actually work.",
  lead: "Manufacturing businesses we work with get all of the core modules above, tuned specifically for:",
  needs: ["pricing", "rfq", "conversions", "bundles"],
};

export const differentiators = {
  heading: "Why choose us",
  items: [
    {
      title: "Speed",
      typical: "Rollouts that run six months or more",
      body: "Full systems delivered in a few weeks, not six months.",
    },
    {
      title: "True customization",
      typical: "A template with your logo on it",
      body: "Every system is built for your workflow, never a repackaged template.",
    },
    {
      title: "AI-first",
      typical: "AI bolted on afterward",
      body: "AI agents are part of the build, not a bolt-on afterward.",
    },
    {
      title: "One team, start to finish",
      typical: "Layers of support tickets",
      body: "You talk to the people actually building your system.",
    },
    {
      title: "Transparent process",
      typical: "Surprise phases",
      body: "Clear scope, clear timeline, no surprise phases.",
    },
  ],
};

export const faq = {
  heading: "Frequently asked questions",
  items: [
    {
      q: "How can you deliver a full ERP in a few weeks?",
      a: "We keep scope tight and focused on what your business actually needs, use a proven module library as the foundation, and customize on top of it — instead of building everything from zero.",
    },
    {
      q: "Is it really custom, or a template with my logo on it?",
      a: "Every system is built around your specific workflow, data, and pricing rules. The AI agents and modules are configured for your business, not reused as-is.",
    },
    {
      q: "Do you support the system after launch?",
      a: "Yes — you work directly with the team that built it for fixes, changes, and new features as your business grows.",
    },
    {
      q: "What industries do you build for?",
      a: "Manufacturing is a strong fit today, and the same core system adapts to distribution, retail, and service-based businesses with their own workflows.",
    },
    {
      q: "What does “AI agents in the ERP” actually mean?",
      a: "It means parts of the system act on your behalf — drafting quotations, flagging low stock, answering routine customer questions — instead of just storing data for you to act on manually.",
    },
  ],
};

export const finalCta = {
  headline: "Ready to build your ERP?",
  subtext:
    "Tell us how your business runs today — we'll show you what a custom system with AI agents built in looks like, and how fast we can deliver it.",
  cta: "Schedule a consultation",
};
