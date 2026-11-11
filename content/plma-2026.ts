// /plma-2026: informational SEO page about PLMA and PLMA 2026. /chicago-event stays the enquiry
// landing page (offer + form); the two pages link to each other.
//
// FACTS: every event/association fact below comes from the official PLMA pages in `plmaSources`
// (checked 2026-11-11). Do not add figures, attendance numbers or claims that are not in those
// sources. SesameERP has no confirmed booth or scheduled demo at the show.
//
// The two pages deliberately use different copy: this page is the full guide; /chicago-event uses
// the short, offer-focused `plmaLanding` copy at the bottom of this file.

import { campaignPath, offerNotCash, offerStatement, siteOrigin } from "@/content/chicago-event";

export const plmaPagePath = "/plma-2026";
export const plmaPageUrl = `${siteOrigin}${plmaPagePath}`;

// Keyword map (see docs/content-plma-2026.md): primary "PLMA 2026", "PLMA Chicago 2026";
// secondary "ERP for private label manufacturers", "private label manufacturers", "store brands",
// "CPG manufacturers", "food and beverage manufacturing ERP", "inventory and production management",
// "custom ERP for manufacturers", "AI agents for ERP". No search volumes were available to validate.
export const plmaPageSeo = {
  title: "PLMA 2026 Chicago Guide & ERP for Private Label | SesameERP",
  description:
    "Plan PLMA 2026 in Chicago (Nov 15–17): schedule, venues and who attends, plus how custom ERP and AI agents help private label and CPG manufacturers.",
  keywords: [
    "PLMA 2026",
    "PLMA Chicago 2026",
    "PLMA 2026 schedule",
    "private label manufacturers",
    "ERP for private label manufacturers",
    "store brands",
    "CPG manufacturers",
    "food and beverage manufacturing ERP",
    "custom ERP for manufacturers",
    "AI agents for ERP",
  ],
};

export const plmaSources = [
  { label: "PLMA – About PLMA", href: "https://plma.com/about_plma" },
  { label: "PLMA – PLMA's 2026 Private Label Trade Show", href: "https://plma.com/events/plmas-2026-private-label-trade-show" },
  { label: "PLMA – Trade Show Schedule", href: "https://plma.com/events/plmas-2026-private-label-trade-show/trade-show-schedule" },
  { label: "PLMA – Why Visit", href: "https://plma.com/events/plmas-2026-private-label-trade-show/why-visit" },
  { label: "PLMA – News releases (November 3, 2026)", href: "https://plma.com/events/press-room/plma-news-releases" },
];

export const plmaFacts = {
  showName: "PLMA's 2026 Private Label Trade Show",
  theme: "Store Brands Marketplace",
  startDate: "2026-11-15",
  endDate: "2026-11-17",
  dates: "November 15–17, 2026",
  venue: "Donald E. Stephens Convention Center",
  // PLMA writes "Chicago". The convention center and the hotel are in Rosemont, Illinois, next to
  // Chicago. "Rosemont (Chicago), Illinois" confirmed by the owner (Nov 11, 2026).
  locality: "Rosemont",
  region: "IL",
  country: "US",
  location: "Rosemont (Chicago), Illinois",
  educationVenue: "Hyatt Regency O'Hare",
  officialUrl: "https://plma.com/events/plmas-2026-private-label-trade-show",
  scheduleUrl: "https://plma.com/events/plmas-2026-private-label-trade-show/trade-show-schedule",
  organizer: "Private Label Manufacturers Association (PLMA)",
  organizerUrl: "https://plma.com",
};

// Owner's offer wording (offerStatement + offerNotCash) comes from content/chicago-event.ts.

/** Shown on both PLMA pages. SesameERP must not appear affiliated with or endorsed by PLMA. */
export const plmaDisclaimer =
  "SesameERP, a product of Business Scales LLC, is an independent ERP provider. It is not affiliated with, sponsored by or endorsed by PLMA. Event details are summarised from PLMA's official website.";

// Original SesameERP copy. PLMA pages were used only to check facts and understand the audience
// and terminology; nothing is copied from them.
export const plmaPage = {
  hero: {
    eyebrow: "PLMA 2026 · Chicago · November 15–17",
    heading: "PLMA 2026 in Chicago: a guide for private label manufacturers",
    intro:
      "When and where everything happens at PLMA 2026, who you are likely to meet, and the operational questions private label and store brand manufacturers face, with a practical look at what an ERP should handle for them.",
    cta: "See the PLMA 2026 ERP offer",
    ctaHref: campaignPath,
    secondary: "Official event page",
  },
  quickFacts: [
    { label: "Event", value: "PLMA's 2026 Private Label Trade Show (“Store Brands Marketplace”)" },
    { label: "Dates", value: "Sunday, November 15 to Tuesday, November 17, 2026" },
    { label: "Sunday education (Nov 15)", value: "Hyatt Regency O'Hare" },
    { label: "Trade show floor (Nov 16–17)", value: "Donald E. Stephens Convention Center, Rosemont (Chicago), Illinois" },
    { label: "Organiser", value: "Private Label Manufacturers Association (PLMA)" },
    { label: "Exhibitors", value: "Nearly 1,900 suppliers from about 60 countries, in more than 3,000 booths (PLMA, November 3, 2026)" },
  ],
  whatIsPlma: {
    heading: "What is PLMA?",
    body: [
      "PLMA, the Private Label Manufacturers Association, is a non-profit trade association. It was founded in 1979 to promote store brands, and it counts over 5,200 member companies in more than 80 countries.",
      "Members include manufacturers, brokers and trade suppliers. Besides its annual shows in Chicago and Amsterdam, PLMA offers conferences, executive education and market research for the store brand industry.",
    ],
  },
  whatIs2026: {
    heading: "What is PLMA 2026?",
    body: [
      "PLMA 2026 is the association's annual private label trade show in Chicago, branded “Store Brands Marketplace”. It is where retailers and wholesalers look for manufacturers to make their own-brand products, and where manufacturers meet buyers from the U.S. and Canada.",
      "PLMA reports nearly 1,900 suppliers from about 60 countries for 2026, spread over three exhibit halls and grouped into food and beverages; home, health and self care; and international pavilions.",
    ],
  },
  conference: {
    heading: "PLMA 2026 schedule and venues",
    lead: "Sunday is for education at the Hyatt Regency O'Hare. The trade show floor opens on Monday and Tuesday at the Donald E. Stephens Convention Center. Times below are local, from PLMA's published schedule.",
    items: [
      {
        title: "Sunday, November 15: education day",
        body: "Executive Education Insight Series (10:00 a.m.–12:30 p.m.) and Opening Seminars (2:00–4:30 p.m.) at the Hyatt Regency O'Hare. Badge registration opens at noon at the convention center. The show floor is closed on Sunday.",
      },
      {
        title: "Monday, November 16: show floor opens",
        body: "Keynote Breakfast (8:00–9:00 a.m.) at the Hyatt Regency O'Hare. Trade show and World of Ideas™ (9:00 a.m.–6:00 p.m.), followed by an evening networking reception (6:00–7:30 p.m.), at the Donald E. Stephens Convention Center.",
      },
      {
        title: "Tuesday, November 17: final day",
        body: "Retail Leadership Keynote Breakfast (8:00–9:00 a.m.) at the Hyatt Regency O'Hare. Trade show (9:00 a.m.–4:00 p.m.) and World of Ideas™ (until 3:30 p.m.) at the Donald E. Stephens Convention Center.",
      },
      {
        title: "Beyond the booths",
        body: "PLMA's World of Ideas™ displays store brand products from many countries, and its New Product Expo highlights new food and non-food launches.",
      },
      {
        title: "Booking meetings",
        body: "Retail buyers can find exhibitors and book appointments in advance through PLMA's own online tools, so many meetings are planned before the show starts.",
      },
    ],
    scheduleLink: "PLMA's full schedule",
  },
  whoAttends: {
    heading: "Who you will meet at PLMA 2026",
    body: "PLMA 2026 is a business-to-business event: buyers come to source store brand products, and manufacturers come to win and grow retail programmes.",
    items: [
      { title: "Retail and trade buyers", body: "Buyers for supermarkets, supercenters, drug chains, specialty stores, mass merchandisers, wholesale clubs, dollar stores and online retailers, plus importers and exporters." },
      { title: "Private label manufacturers", body: "CPG manufacturers making food, beverages, and home, health and personal care products under retailers' own brands, from small plants to multinational groups." },
      { title: "Suppliers to manufacturers", body: "Companies providing ingredients, packaging, logistics and other services that private label production depends on." },
    ],
  },
  challenges: {
    heading: "What private label manufacturers deal with every day",
    lead: "Making store brands means running one factory for many customers, each with its own rules. These are the pressures we hear about most from manufacturers:",
    items: [
      { title: "One product, many retailer versions", body: "The same recipe can ship under several store brands, each with its own specification, label, artwork and packaging, and each change has to reach purchasing and the production line." },
      { title: "Costing on thin margins", body: "Retailer pricing leaves little room for error. Ingredient, packaging and conversion costs move, and quotes have to reflect them per item and per customer." },
      { title: "Inventory across production stages", body: "Raw materials, semi-finished goods, packaging and finished stock all have to be counted and valued correctly as they move through production." },
      { title: "Supply chain and purchasing", body: "Several suppliers for the same material, minimum order quantities and lead times make it hard to buy the right amount at the right price." },
      { title: "Traceability and audits", body: "Retailers and auditors expect fast answers on which materials went into which batch, and where that batch was shipped." },
      { title: "Unpredictable demand", body: "Promotions, new listings and lost listings change volumes quickly, and production plans need to follow without overstocking." },
    ],
  },
  whyErp: {
    heading: "ERP for private label manufacturers: what it should cover",
    body: [
      "Spreadsheets and disconnected tools can run a small private label business, but every new retailer adds another set of prices, specifications and orders to keep in step. An ERP gives the whole team one record of customers, products, stock, purchasing and production.",
      "For store brand and CPG manufacturers, look for an ERP that covers at least:",
    ],
    checklist: [
      "Customer-specific products, prices and quotations for each retailer",
      "Sales orders linked to purchasing and stock",
      "Multi-supplier purchasing with RFQs and purchase orders",
      "Inventory that follows materials from raw to semi-finished to finished goods",
      "Costing that updates when material prices change",
      "Batch and lot records, if retailers or auditors ask for traceability",
      "Reports the team can read without exporting to spreadsheets",
    ],
  },
  howWeHelp: {
    heading: "How SesameERP helps manufacturers",
    lead: "SesameERP builds custom ERP systems with AI agents built in, designed around how your plant and your retailers already work rather than forcing a generic template. Each system is assembled from modules we build and adapt for you.",
    items: [
      {
        title: "Custom ERP modules",
        body: "Customer and vendor management, product catalogue and pricing, quotations and sales orders, RFQs and purchase orders, and inventory management with real-time stock updates. Manufacturing needs such as raw material to finished goods pricing chains and stock tracking across conversions are built in; anything specific to your retailers can be added as a custom module.",
        href: "/#modules",
        link: "See the modules",
      },
      {
        title: "AI agents for ERP",
        body: "Agents that work inside the system: an inventory forecaster that flags stock needs, a data entry agent for repetitive records, a sales assistant for quotations, a customer support agent and a report generator.",
        href: "/#agents",
        link: "Meet the AI agents",
      },
      {
        title: "ERP automation",
        body: "Price updates that flow through to dependent products, stock that updates as orders and production move, and fewer manual hand-offs between sales, purchasing and the plant.",
        href: "/#process",
        link: "How we build and launch",
      },
    ],
  },
  offer: {
    heading: "The complimentary PLMA 2026 offer",
    body: [
      `PLMA 2026 attendees can request the following from SesameERP: ${offerStatement.charAt(0).toLowerCase()}${offerStatement.slice(1)}`,
      offerNotCash,
      "You choose the area of your operations to start with; each request is reviewed individually, and the offer terms apply.",
    ],
    cta: "Request your complimentary module",
    ctaHref: `${campaignPath}#register`,
    terms: "Read the offer terms",
  },
  faq: {
    heading: "PLMA 2026 and private label ERP: questions",
    items: [
      {
        q: "When and where is PLMA 2026?",
        a: "PLMA's 2026 Private Label Trade Show runs from Sunday, November 15 to Tuesday, November 17, 2026. Sunday's education sessions are at the Hyatt Regency O'Hare. The trade show floor is open on Monday, November 16 (9:00 a.m.–6:00 p.m.) and Tuesday, November 17 (9:00 a.m.–4:00 p.m.) at the Donald E. Stephens Convention Center in Rosemont, next to Chicago.",
      },
      {
        q: "What does PLMA stand for?",
        a: "PLMA stands for the Private Label Manufacturers Association, a non-profit trade association founded in 1979 to promote store brands, with over 5,200 member companies in more than 80 countries.",
      },
      {
        q: "Who exhibits at PLMA 2026?",
        a: "Private label manufacturers and their suppliers. PLMA reports nearly 1,900 suppliers from about 60 countries for 2026, covering food and beverages, home, health and self care, and international pavilions.",
      },
      {
        q: "What is the difference between private label, store brands and private brands?",
        a: "In everyday use they describe the same thing: products sold under a retailer's or wholesaler's own brand and made for it by a manufacturer. “Store brands” and “private brands” are the terms many retailers prefer; “private label” is common among manufacturers.",
      },
      {
        q: "Is SesameERP part of PLMA, or is this a PLMA offer?",
        a: "No. SesameERP is an independent ERP provider and is not affiliated with, sponsored by or endorsed by PLMA. The complimentary ERP offer is provided by Business Scales LLC, the company behind SesameERP. Product demos and meetings are arranged individually after you get in touch.",
      },
      {
        q: "What ERP features do private label manufacturers need?",
        a: "Usually: customer-specific products and pricing per retailer, sales orders tied to purchasing and stock, multi-supplier purchasing, inventory that follows materials through production, costing that reacts to material prices, and batch records for traceability. Which of these come first depends on where your team loses the most time.",
      },
      {
        q: "How do AI agents help in an ERP?",
        a: "They take on repetitive work inside the system. In SesameERP that includes forecasting stock needs, entering routine data, preparing quotations, answering customer questions and generating reports, so the team spends less time re-keying information.",
      },
      {
        q: "What is the PLMA 2026 development offer?",
        a: `${offerStatement} ${offerNotCash} It covers one ERP module: a single area of your operations, built as a custom SesameERP module.`,
      },
      {
        q: "Who can request it?",
        a: "The offer is for PLMA 2026 attendees. Each request is reviewed individually against the offer terms, so submitting an enquiry does not guarantee approval.",
      },
      {
        q: "How do I request the complimentary ERP module?",
        a: "Use the enquiry form on the SesameERP PLMA 2026 offer page (www.sesameerp.ai/chicago-event). Enter your details and what you would like to discuss, agree to be contacted, accept the offer terms and submit. If you received a personal invitation link, the form is filled in for you to check. Our team reviews each enquiry and contacts you.",
      },
      {
        q: "Does the offer expire?",
        a: "No expiry date has been set for the offer. The offer terms explain how the promotion may be changed.",
      },
    ],
  },
  sourcesLabel: "Event facts checked against official PLMA pages on November 11, 2026:",
};

// ---------------------------------------------------------------------------------------------
// /chicago-event (enquiry landing page): short, offer-focused PLMA copy. Different wording from the
// guide above on purpose; the guide holds the full details and the landing page links to it.

export const plmaLanding = {
  // Event band facts (replaces the single "Venue" line).
  eventFacts: [
    { label: "Dates", value: "November 15–17, 2026" },
    { label: "Sunday, Nov 15: education", value: "Hyatt Regency O'Hare" },
    { label: "Mon–Tue, Nov 16–17: trade show", value: "Donald E. Stephens Convention Center" },
    { label: "Location", value: "Rosemont (Chicago), Illinois, USA" },
  ],
  guideLink: "PLMA 2026 guide: schedule, who attends and ERP for private label",
  // Section after the event band.
  fitHeading: "Built for private label manufacturers",
  fitLead:
    "Private label manufacturers juggle several retailers' prices, specifications and order patterns at once. One complimentary ERP module can start with the area that costs your team the most time.",
  fitItems: [
    { title: "Retailer-specific pricing and quotes", body: "Products, prices and quotations per retailer, with price updates that flow through when material costs change." },
    { title: "Purchasing from several suppliers", body: "RFQs and purchase orders across vendors, so quotes can be compared before you buy." },
    { title: "Stock through every production stage", body: "Raw materials, semi-finished and finished goods tracked as they are converted." },
    { title: "Orders tied to inventory", body: "Sales orders that update stock in real time, so promises to retailers match what is on the shelf." },
    { title: "AI agents for repetitive work", body: "Stock forecasting, data entry, quotations and reports handled by agents inside the ERP." },
  ],
  fitNote: "Examples only. The module and its scope are agreed with you after review, under the offer terms.",
};

// PLMA questions added to the /chicago-event FAQ, written for the landing page.
export const plmaLandingFaq = [
  {
    q: "Is the offer paid as cash or credit?",
    a: `No. ${offerStatement} ${offerNotCash}`,
  },
  {
    q: "When and where is PLMA 2026?",
    a: "November 15–17, 2026. Sunday's education sessions are at the Hyatt Regency O'Hare; the trade show floor is open Monday and Tuesday at the Donald E. Stephens Convention Center. The full schedule is in our PLMA 2026 guide.",
  },
  {
    q: "Is this offer from PLMA?",
    a: "No. PLMA organises the trade show. SesameERP is an independent ERP provider and is not affiliated with, sponsored by or endorsed by PLMA. The complimentary ERP offer is provided by Business Scales LLC, the company behind SesameERP.",
  },
];
