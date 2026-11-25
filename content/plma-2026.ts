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
  // SEO update (Nov 17, 2026): 149 characters; informational only (offer searches belong to /chicago-event).
  description:
    "PLMA 2026 in Chicago (Nov 15–17, 2026): schedule, venues and who attends, plus a practical ERP guide for private label and store brand manufacturers.",
  keywords: [
    "PLMA 2026",
    "PLMA Chicago 2026",
    "PLMA 2026 schedule",
    "PLMA show Rosemont",
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
  { label: "PLMA – Store Brand Facts (Circana data)", href: "https://www.plma.com/about_industry/store_brand_facts" },
  { label: "Rosemont – DES Convention Center event page", href: "https://rosemont.com/desconvention/event/plmas-2026-private-label-show/" },
];

export const plmaFacts = {
  showName: "PLMA's 2026 Private Label Trade Show",
  theme: "Store Brands Marketplace",
  startDate: "2026-11-15",
  endDate: "2026-11-17",
  dates: "November 15–17, 2026",
  venue: "Donald E. Stephens Convention Center",
  // Venue address and airport distance: rosemont.com event page (checked 2026-11-17).
  venueAddress: "5555 N. River Road, Rosemont, IL 60018",
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
    // Post-event wording (the show ran November 15–17, 2026).
    intro:
      "How PLMA 2026 was organised, who attends PLMA's Chicago show, and the operational questions private label and store brand manufacturers face, with a practical guide to what an ERP should handle for them.",
    cta: "PLMA 2026 attendee ERP offer",
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
      "PLMA 2026 was the association's annual private label trade show in Chicago, held November 15–17, 2026 and branded “Store Brands Marketplace”. It is where retailers and wholesalers look for manufacturers to make their own-brand products, and where manufacturers meet buyers from the U.S. and Canada.",
      "PLMA reported nearly 1,900 suppliers from about 60 countries for 2026, spread over three exhibit halls and grouped into food and beverages; home, health and self care; and international pavilions.",
    ],
  },
  conference: {
    heading: "PLMA 2026 schedule and venues",
    lead: "Sunday was for education at the Hyatt Regency O'Hare. The trade show floor was open on Monday and Tuesday at the Donald E. Stephens Convention Center. Times below are local, from PLMA's published schedule.",
    items: [
      {
        title: "Sunday, November 15: education day",
        body: "Executive Education Insight Series (10:00 a.m.–12:30 p.m.) and Opening Seminars (2:00–4:30 p.m.) at the Hyatt Regency O'Hare. Badge registration opened at noon at the convention center. The show floor was closed on Sunday.",
      },
      {
        title: "Monday, November 16: show floor opened",
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
        title: "Getting to the venue",
        body: "The Donald E. Stephens Convention Center is at 5555 N. River Road, Rosemont, IL 60018, about 10 minutes from Chicago O'Hare International Airport, according to the venue.",
      },
      {
        title: "Booking meetings",
        body: "Retail buyers can find exhibitors and book appointments in advance through PLMA's own online tools, so many meetings are planned before the show starts.",
      },
    ],
    scheduleLink: "PLMA's full schedule",
  },
  whoAttends: {
    heading: "Who attends PLMA's Chicago show",
    body: "PLMA's Chicago show is a business-to-business event: buyers come to source store brand products, and manufacturers come to win and grow retail programmes.",
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
  // Practical guide (SEO update, Nov 17, 2026). Original SesameERP copy written from a manufacturer's
  // point of view; competitor pages were reviewed only to see which topics searchers expect. It
  // describes what to look for in any ERP and claims no SesameERP feature beyond `howWeHelp`.
  erpGuide: {
    heading: "ERP for private label manufacturers: a practical guide",
    intro:
      "A private label plant answers to several retailers at once, and each one sets its own specifications, prices, packaging and audit expectations. These are the areas an ERP has to keep in step, and what to look for in each.",
    topics: [
      {
        title: "Retailer-specific products and specifications",
        body: "The same base recipe often ships as several retailer items, each with its own item number, label, artwork, pack size and approved specification.",
        lookFor: [
          "One base product linked to each retailer's version of it",
          "Specification and artwork versions with an approval status",
          "Retailer item numbers on orders, pick lists and invoices",
        ],
      },
      {
        title: "Production planning",
        body: "Orders and forecasts from different retailers compete for the same lines, and every changeover between retailer packs costs time.",
        lookFor: [
          "Work orders created from confirmed retailer orders",
          "Materials converted from raw to semi-finished to finished goods",
          "Actual yields recorded so costs reflect what really happened",
        ],
      },
      {
        title: "Purchasing",
        body: "Shared ingredients can be bought in bulk, but retailer-specific packaging is only useful for one customer and can become obsolete when a listing changes.",
        lookFor: [
          "Several suppliers per material, with RFQs to compare quotes",
          "Minimum order quantities and lead times on the purchase order",
          "Retailer-specific packaging kept visible as its own stock",
        ],
      },
      {
        title: "Inventory",
        body: "Stock moves through several stages, and finished goods are often committed to one retailer's order before they leave the plant.",
        lookFor: [
          "Stock levels by production stage, updated as orders and production move",
          "Lot or batch numbers and dates where your products need them",
          "Stock reserved per customer order, so promises match the shelf",
        ],
      },
      {
        title: "Traceability and audits",
        body: "Retailers and auditors ask which material lots went into a batch and where that batch was shipped, and they expect a fast answer.",
        lookFor: [
          "Records that link supplier lots to batches and shipments",
          "A one-step-back, one-step-forward lookup for recalls and mock recalls",
          "Specifications, approvals and certificates stored with the product",
        ],
      },
      {
        title: "Costing and margins",
        body: "Retail pricing leaves little room for error, so a change in material or packaging cost has to show up in quotes quickly.",
        lookFor: [
          "Cost roll-ups from materials through to each finished item",
          "Margin by retailer and by item",
          "Price updates that flow to every product that uses a material",
        ],
      },
    ],
    choosing: {
      heading: "Packaged ERP or custom modules?",
      body: "A packaged ERP can suit a plant whose processes match its standard workflows. Custom modules make sense when retailer-specific rules, approvals or reports are where the team loses time, or when the rest of your systems already work and only one area needs fixing. Either way, start with the area that costs the most time today.",
    },
    // Link to the blog article that covers this topic in depth (blog launch, Nov 20, 2026).
    articleLink: {
      before: "For a full requirements checklist with questions to ask ERP vendors, read",
      label: "ERP for private label manufacturers: a practical requirements checklist",
      href: "/blog/erp-for-private-label-manufacturers-checklist",
    },
  },
  whyErp: {
    heading: "Quick ERP checklist for store brand manufacturers",
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
  // Kept brief on purpose (SEO update, Nov 17, 2026): the offer details and the enquiry form live on
  // /chicago-event, which should be the page that ranks for offer searches.
  offer: {
    heading: "For PLMA 2026 attendees",
    body: "Business Scales LLC, the company behind SesameERP, offers PLMA 2026 participants complimentary development of one approved ERP module (development services valued up to US$5,000; not cash or credit). Eligibility, terms and the enquiry form are on the",
    linkLabel: "PLMA 2026 attendee ERP offer",
    linkHref: campaignPath,
    linkAfter: "page.",
  },
  faq: {
    heading: "PLMA 2026 and private label ERP: questions",
    // SEO update (Nov 17, 2026): past tense after the show; Google "People also ask" questions added
    // ("What is the PLMA show?", "Where is the PLMA trade show located in Chicago?"); offer questions
    // reduced to one pointer, because the offer FAQ lives on /chicago-event.
    items: [
      {
        q: "What is the PLMA show?",
        a: "It is the Private Label Manufacturers Association's annual U.S. trade show for store brands, held in the Chicago area each November. Retailers and wholesalers meet the manufacturers that make their own-brand products. PLMA also runs a separate show in Amsterdam.",
      },
      {
        q: "When and where was PLMA 2026?",
        a: "PLMA's 2026 Private Label Trade Show ran from Sunday, November 15 to Tuesday, November 17, 2026. Sunday's education sessions were at the Hyatt Regency O'Hare. The trade show floor was open on Monday, November 16 (9:00 a.m.–6:00 p.m.) and Tuesday, November 17 (9:00 a.m.–4:00 p.m.) at the Donald E. Stephens Convention Center in Rosemont, next to Chicago.",
      },
      {
        q: "Where is the PLMA trade show located in Chicago?",
        a: "At the Donald E. Stephens Convention Center, 5555 N. River Road, Rosemont, IL 60018, next to Chicago and about 10 minutes from O'Hare International Airport. Sunday education sessions in 2026 were held at the nearby Hyatt Regency O'Hare.",
      },
      {
        q: "What does PLMA stand for?",
        a: "PLMA stands for the Private Label Manufacturers Association, a non-profit trade association founded in 1979 to promote store brands, with over 5,200 member companies in more than 80 countries.",
      },
      {
        q: "Who exhibited at PLMA 2026?",
        a: "Private label manufacturers and their suppliers. PLMA reported nearly 1,900 suppliers from about 60 countries for 2026, covering food and beverages, home, health and self care, and international pavilions.",
      },
      {
        q: "Are store brands still growing?",
        a: "Yes, according to PLMA's figures based on Circana data: U.S. store brand sales reached a record $282.8 billion in 2025, a 21.3% dollar share, with dollar sales up 3.3% against 1.2% for national brands. Profitability for a manufacturer still depends on its own costs and retailer terms.",
      },
      {
        q: "What is the difference between private label, store brands and private brands?",
        a: "In everyday use they describe the same thing: products sold under a retailer's or wholesaler's own brand and made for it by a manufacturer. “Store brands” and “private brands” are the terms many retailers prefer; “private label” is common among manufacturers.",
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
        q: "Is SesameERP part of PLMA, or is this a PLMA offer?",
        a: "No. SesameERP is an independent ERP provider and is not affiliated with, sponsored by or endorsed by PLMA. The complimentary ERP offer for PLMA 2026 attendees is provided by Business Scales LLC, the company behind SesameERP; its details and enquiry form are on the SesameERP PLMA 2026 offer page.",
      },
    ],
  },
  sourcesLabel: "Event facts checked against official PLMA pages on November 11, 2026; venue address and store brand figures checked on November 17, 2026:",
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
  guideLink: "PLMA 2026 guide: schedule, venues and ERP for private label manufacturers",
  // Section after the event band.
  fitHeading: "ERP software built for private label manufacturers",
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
    q: "When and where was PLMA 2026?",
    a: "November 15–17, 2026. Sunday's education sessions were at the Hyatt Regency O'Hare; the trade show floor was open Monday and Tuesday at the Donald E. Stephens Convention Center. The full schedule is in our PLMA 2026 guide.",
  },
  {
    q: "Is this offer from PLMA?",
    a: "No. PLMA organises the trade show. SesameERP is an independent ERP provider and is not affiliated with, sponsored by or endorsed by PLMA. The complimentary ERP offer is provided by Business Scales LLC, the company behind SesameERP.",
  },
];
