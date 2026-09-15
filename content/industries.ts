// Industry solution pages.
// Manufacturing reuses approved homepage copy. Restaurant and Retail are DRAFT copy written
// during design and need the owner's approval — see docs/content-industries.md.

export type IndustrySlug = "manufacturing" | "restaurant" | "retail";

export type IndustryDoc = {
  title: string;
  subtitle: string;
  working: string;
  finished: string;
  columns: [string, string, string];
  rows: { item: string; detail: string; value: string }[];
  note: string;
};

export type Industry = {
  slug: IndustrySlug;
  label: string;
  menuDescription: string;
  title: string;
  summary: string;
  headline: string;
  body: string;
  needsHeading: string;
  needs: { title: string; body: string }[];
  modulesHeading: string;
  modulesLead: string;
  modules: string[];
  agentsHeading: string;
  agents: { name: string; body: string }[];
  doc?: IndustryDoc;
  draft: boolean;
};

export const industries: Record<IndustrySlug, Industry> = {
  manufacturing: {
    slug: "manufacturing",
    label: "Manufacturing",
    menuDescription: "Pricing chains, RFQs and stock across raw, semi-finished and finished goods.",
    title: "Manufacturing ERP",
    summary:
      "Unlock the full potential of your manufacturing operation with an ERP built specifically for how your shop floor, sales, and procurement teams actually work.",
    headline: "Every module your business needs, tuned for manufacturing",
    body: "Manufacturing businesses we work with get the full core system, tuned for the way material moves through the shop floor: raw material becomes a semi-finished part, the part becomes a finished good, and every price along that chain stays in step.",
    needsHeading: "What we tune for manufacturing",
    needs: [
      {
        title: "Raw material to finished goods pricing",
        body: "Product prices update automatically when raw material costs change, keeping semi-finished and finished goods pricing in sync.",
      },
      {
        title: "RFQ-driven procurement",
        body: "Send RFQs to vendors and compare quotes side by side to choose the best supplier.",
      },
      {
        title: "Stock across conversions",
        body: "Track raw materials, semi-finished, and finished goods to avoid stockouts and excess inventory.",
      },
      {
        title: "Composite and bundled products",
        body: "Handle multi-part or bundled products with accurate inventory and pricing across the whole structure.",
      },
    ],
    modulesHeading: "The modules a manufacturer uses most",
    modulesLead: "You get the full module library. These are the ones your team will live in.",
    modules: [
      "Automated Price Update Chain",
      "Request for Quotation (RFQ)",
      "Purchase Orders",
      "Indent Management",
      "Inventory Management",
      "Composite & Bundled Products",
      "Real-Time Stock Updates",
      "Quotations",
    ],
    agentsHeading: "AI agents on the shop floor",
    agents: [
      {
        name: "AI Sales Assistant",
        body: "Drafts quotations from incoming RFQs using your current material costs and margin rules.",
      },
      {
        name: "AI Inventory Forecaster",
        body: "Flags raw material heading below its reorder point before a production run stalls.",
      },
      {
        name: "AI Data Entry Agent",
        body: "Reads vendor invoices and purchase orders and enters them, so material costs stay current.",
      },
    ],
    draft: false,
  },

  restaurant: {
    slug: "restaurant",
    label: "Restaurant",
    menuDescription: "Supplier costs, kitchen stock and dish costing across every outlet.",
    title: "Restaurant ERP",
    summary:
      "Purchasing, stock and costs across your kitchens, from the supplier invoice to the plate.",
    headline: "Built around your kitchen, not a generic stock system",
    body: "Restaurants lose margin in small places: a supplier price that moved last week, stock that was never counted, a dish that quietly costs more than it sells for. The system keeps all of it in one place, and the AI agents keep it current without anyone typing it in.",
    needsHeading: "What we build for restaurants",
    needs: [
      {
        title: "Supplier prices that move weekly",
        body: "When an invoice arrives with a new price, the cost of every dish using that ingredient moves with it.",
      },
      {
        title: "Stock across kitchen and store",
        body: "Track what is in the walk-in, the dry store and each outlet, so you order what you actually need.",
      },
      {
        title: "Recipes, combos and bundles",
        body: "Handle multi-part items and combo deals with accurate stock and pricing across the whole structure.",
      },
      {
        title: "Wastage and daily counts",
        body: "Correct stock for wastage, spoilage or a miscount, and keep the record straight.",
      },
      {
        title: "Transfers between outlets",
        body: "Move stock from one kitchen to another and see it land, with the value following it.",
      },
      {
        title: "Vendors and purchase orders",
        body: "Raise orders against the suppliers you actually buy from, and track what is due today.",
      },
    ],
    modulesHeading: "The modules a restaurant group uses most",
    modulesLead: "You get the full module library. These are the ones your team will live in.",
    modules: [
      "Inventory Management",
      "Stock Adjustment",
      "Real-Time Stock Updates",
      "Purchase Orders",
      "Customer & Vendor Management",
      "Product Catalog & Pricing",
      "Composite & Bundled Products",
      "Automated Price Update Chain",
    ],
    agentsHeading: "AI agents in the kitchen office",
    agents: [
      {
        name: "AI Data Entry Agent",
        body: "Reads supplier invoices as they arrive and enters them, with the new prices attached.",
      },
      {
        name: "AI Inventory Forecaster",
        body: "Flags ingredients heading below their reorder point before service is affected.",
      },
      {
        name: "AI Report Generator",
        body: "Turns the week into plain language: what sold, what it cost, where the margin went.",
      },
    ],
    doc: {
      title: "Supplier invoice",
      subtitle: "INV-4471, read automatically on arrival",
      working: "AI Data Entry Agent is reading the invoice",
      finished: "Entered, prices updated",
      columns: ["Item", "Quantity", "Amount"],
      rows: [
        { item: "Tomatoes", detail: "40 kg at $1.20", value: "$48.00" },
        { item: "Chicken breast", detail: "25 kg at $6.40", value: "$160.00" },
        { item: "Olive oil", detail: "12 L at $9.50", value: "$114.00" },
      ],
      note: "Two dish costs changed because of this invoice.",
    },
    draft: true,
  },

  retail: {
    slug: "retail",
    label: "Retail",
    menuDescription: "Stock, purchasing and pricing across every store and channel.",
    title: "Retail ERP",
    summary: "Stock, purchasing and pricing across every store and channel, in one system.",
    headline: "One stock position, however many stores you run",
    body: "Retail goes wrong between the stores: stock that exists in one branch and is missing in another, a reorder that was noticed too late, a price that changed everywhere except one shelf. The system holds one live stock position, and the AI agents watch it for you.",
    needsHeading: "What we build for retail",
    needs: [
      {
        title: "Stock across every store",
        body: "Live visibility into stock movement from purchases, sales, transfers and adjustments.",
      },
      {
        title: "Reorder before you run out",
        body: "Reorder points per product and per store, so purchasing sees what is coming before the shelf empties.",
      },
      {
        title: "Prices that update everywhere",
        body: "Change a cost or a rule once and pricing stays consistent and accurate across the system.",
      },
      {
        title: "Kits and bundled products",
        body: "Handle multi-part or bundled products with accurate inventory and pricing across the whole structure.",
      },
      {
        title: "Customer orders and portal",
        body: "Customers can check order status, track shipments, and browse product info securely online.",
      },
      {
        title: "Counts and adjustments",
        body: "Correct inventory levels for discrepancies or damage while keeping records accurate.",
      },
    ],
    modulesHeading: "The modules a retailer uses most",
    modulesLead: "You get the full module library. These are the ones your team will live in.",
    modules: [
      "Inventory Management",
      "Real-Time Stock Updates",
      "Stock Adjustment",
      "Product Catalog & Pricing",
      "Purchase Orders",
      "Sales Orders",
      "Customer Portal",
      "Composite & Bundled Products",
    ],
    agentsHeading: "AI agents behind the counter",
    agents: [
      {
        name: "AI Inventory Forecaster",
        body: "Predicts reorder points per store and flags what to buy this week.",
      },
      {
        name: "AI Customer Support Agent",
        body: "Answers common customer questions about orders and stock status.",
      },
      {
        name: "AI Report Generator",
        body: "Summarises sales, stock and purchasing per store, on demand.",
      },
    ],
    doc: {
      title: "Reorder list",
      subtitle: "Store 2, prepared this morning",
      working: "AI Inventory Forecaster is checking stock",
      finished: "Ready for purchasing to approve",
      columns: ["Product", "On hand", "Suggested order"],
      rows: [
        { item: "Steel water bottle, 1 L", detail: "12 left, reorder at 40", value: "120 units" },
        { item: "Canvas tote, natural", detail: "8 left, reorder at 25", value: "75 units" },
        { item: "Ceramic mug, 350 ml", detail: "31 left, reorder at 60", value: "90 units" },
      ],
      note: "Based on the last eight weeks of sales at this store.",
    },
    draft: true,
  },
};

export const industryList = Object.values(industries);
