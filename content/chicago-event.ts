// PLMA 2026 campaign copy for /chicago-event. Mirrors docs/content-chicago-event.md — keep wording in sync.
//
// The offer (confirmed by Nbits): one ERP module built free of charge, representing US$5,000 worth
// of development work, for PLMA conference users. ERP only. No expiry date.
// It is NOT a cash credit, balance or discount — never describe it that way.
//
// Nothing here may be invented. Items still waiting on the business are marked "TO CONFIRM".

export const campaignPath = "/chicago-event";

// Zoho CRM webform 7671386000000694280 (org945149959, Leads module) — values copied from the
// source code Zoho generates under Setup > Webforms > Publish Options. Do not rename fields or edit
// the keys by hand: if the webform is edited in Zoho, re-copy the keys AND the analytics script URL
// from the newly generated source.
//
// Field map (Zoho name -> CRM field):
//   First Name, Last Name, Email, Phone, Company, Designation (Title), Website
//   LEADCF1  -> Services Interested In (multi-select)
//   LEADCF2  -> Credit Offer Status (always "Pending Review"; never auto-approved)
//   LEADCF3  -> ERP Requirements (multi-line)
//   LEADCF4  -> UTM Source, LEADCF6 -> UTM Medium, LEADCF5 -> UTM Campaign
//   LEADCF7  -> Request Type (picklist)
//   LEADCF52 -> Consent to be Contacted (checkbox)
//   Lead Source -> "PLMA 2026" (tag "PLMA 2026" is added by the Zoho webform settings)
export const zohoLeadForm = {
  // Same endpoint and request shape as Zoho's generated form script (fetch POST of the form data).
  endpoint: "https://crm.zoho.com/crm/WebToLeadForm",
  // Zoho needs its form id/name on the <form>, and its analytics script ("Do not remove this code").
  // The script adds Zoho's anti-spam tracking fields to the form; without them Zoho answers "thank you"
  // but silently discards the lead.
  formId: "webform7671386000000694280",
  formName: "WebToLeads7671386000000694280",
  analyticsScript:
    "https://crm.zohopublic.com/crm/WebFormAnalyticsServeServlet?rid=" +
    "2f93878f7447d4eff1c319802f233c21b40179c73b495127dceec95a91ae8dfdba096748ea53a94d97ed65f67f85a241gid41350983203d5da930b69" +
    "caf9d29fdceb735302454a1149c0ae8fea44ce59efbgidab4a7879f0c6e075d464a829016431c72af02b993c6014068ec579005410f4f8giddb5a677" +
    "fa600cf1cbf773d114f6fb1177333cdfa97192f509230ce73048af007" +
    "&tw=a5b3d044e2b0615d7bec9b05377c1fd379e0c0a3bea9724b50221aea7377ce9b&version=v2",
  hidden: {
    xnQsjsdp: "9cfc9c374bfaa11106592889e67f17189900ec2ae930bdddcde213e2ee075859",
    zc_gad: "",
    xmIwtLD: "ca5c4e3e301c05053b8f8f02d919db2223b0bfa2e5817f8c7abc67372636af661bf10521f3dcfa4efe3522c919fa9ad5",
    actionType: "TGVhZHM=",
    returnURL: "null",
    "Lead Source": "PLMA 2026",
    LEADCF2: "Pending Review",
  },
  honeypot: "aG9uZXlwb3Q",
  fields: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    jobTitle: "Designation",
    website: "Website",
    services: "LEADCF1",
    requirements: "LEADCF3",
    requestType: "LEADCF7",
    consent: "LEADCF52",
    utmSource: "LEADCF4",
    utmMedium: "LEADCF6",
    utmCampaign: "LEADCF5",
  },
  // Zoho field lengths, from the generated source.
  maxLength: { firstName: 40, lastName: 80, email: 100, phone: 30, company: 200, jobTitle: 100, website: 255, requirements: 2000 },
  // Fallbacks match the hidden-field defaults set in the Zoho webform.
  utmDefaults: { source: "(direct)", medium: "(none)", campaign: "(not set)" },
} as const;

// Copy for the custom request form (PLMA 2026 offer).
export const leadForm = {
  heading: "Request Your Free ERP Module",
  description:
    "Tell us about your business and ERP requirements. Our team will review your request and contact you about the PLMA 2026 exclusive offer.",
  offer: "One ERP Module Free – US$5,000 Development Value",
  optional: "optional",
  labels: {
    firstName: "First name",
    lastName: "Last name",
    email: "Business email",
    phone: "Phone number",
    company: "Company name",
    jobTitle: "Job title",
    website: "Website",
    services: "Services interested in",
    requirements: "What ERP module are you looking for?",
    requestType: "What would you like to discuss?",
  },
  placeholders: {
    email: "you@company.com",
    phone: "+1 312 555 0100",
    website: "yourcompany.com",
    services: "Select ERP interests",
    requirements: "Briefly describe the ERP module or business process you would like to improve...",
  },
  // Values must match the Zoho picklist options exactly.
  serviceOptions: ["Custom ERP Module Development", "AI Agents for ERP", "ERP Automation"],
  requestTypes: ["Free ERP Module", "Product Demo", "Both"],
  consent: "I agree to be contacted by SesameERP, a product of Business Scales, regarding my ERP enquiry.",
  errors: {
    firstName: "Enter your first name.",
    lastName: "Enter your last name.",
    email: "Enter a valid business email, like name@company.com.",
    emailRequired: "Enter your business email.",
    phone: "Enter a valid phone number with 7 to 15 digits. Include your country code if outside the US.",
    phoneRequired: "Enter your phone number.",
    company: "Enter your company name.",
    website: "Enter a valid website, like yourcompany.com.",
    consent: "Please agree to be contacted so our team can respond to your request.",
    summary: "Please fix the highlighted fields.",
  },
  submit: "Request My Free ERP Module",
  submitting: "Submitting…",
  successHeading: "Thank you! Your request has been submitted.",
  successBody: "Our team will review your ERP requirements and contact you about the PLMA 2026 offer.",
  failureHeading: "We couldn’t submit your request.",
  failureBody: "Your details are still in the form. Please try again in a moment, or",
  failureLink: "open the form in a new tab",
} as const;

export const anchors = {
  form: "register",
  event: "plma-2026",
  capabilities: "capabilities",
  how: "how-it-works",
  faq: "faq",
  terms: "offer-terms",
} as const;

// The one sentence every section must agree with.
export const offerSummary =
  "PLMA conference users can request one free ERP module representing US$5,000 worth of development work through SesameERP.";

export const offer = {
  module: "One ERP module",
  price: "Free",
  value: "US$5,000 development value",
  audience: "For PLMA conference users",
};

// Official event details — https://plma.com/events/plmas-2026-private-label-trade-show
// SesameERP has no confirmed booth or scheduled demo at the venue. Do not add one here unless confirmed.
export const plmaEvent = {
  name: "PLMA's 2026 Private Label Trade Show",
  shortName: "PLMA 2026",
  dates: "November 15–17, 2026",
  venue: "Donald E. Stephens Convention Center",
  // The venue is in Rosemont, next to Chicago. TO CONFIRM how the business wants this worded.
  location: "Rosemont (Chicago), Illinois, USA",
  url: "https://plma.com/events/plmas-2026-private-label-trade-show",
};

// Official Zoho CRM webform (org945149959, Leads module). Form internals are out of scope here.
export const zohoWebform = {
  src: "https://crm.zoho.com/crm/WebFormServeServlet?rid=a6e932813088cc6b7a394e8fa41ba19bc0eb06bdd153f6377aa9a2d2b711268890a1e89e9b4b4ee867d6977061b588bdgid42c3121357c7ff335a83c2903d062a1c4e1503d44d64b42f8fd15b9e36084e2c",
  title: "PLMA 2026 free ERP module request form",
  // Zoho's embed is 870px tall at 610px wide; narrow screens stack the fields and need more room.
  heightDesktop: 900,
  heightMobile: 1080,
};

export const cta = {
  primary: "Request your free ERP module",
  demo: "Request a demo",
  productDemo: "Request a product demo",
};

// Header and footer on the campaign page (read by components/layout via lib/campaign.ts).
export const campaignChrome = {
  path: campaignPath,
  headerPrimary: { label: cta.primary, href: `#${anchors.form}` },
  headerSecondary: { label: cta.demo, href: `#${anchors.event}` },
  // Homepage section links that have an equivalent on this page scroll here instead of leaving it.
  sectionLinks: { "#process": `#${anchors.how}`, "#faq": `#${anchors.faq}` } as Record<string, string>,
  footerTagline: "Custom ERP solutions with AI agents and intelligent automation.",
  attribution: { prefix: "A product of", label: "BusinessScales.com", href: "https://businessscales.com/" },
};

export const plmaHero = {
  eyebrow: "PLMA 2026 attendee exclusive",
  headline: ["Get one ERP module"],
  headlineSecond: "built for free.",
  highlight: "US$5,000 worth of ERP development work",
  description:
    "Attending PLMA 2026? Discover how SesameERP can help improve your business operations. Get one ERP module developed at no cost, representing US$5,000 worth of development work.",
  benefits: [
    { icon: "module", label: "One free ERP module" },
    { icon: "erp", label: "Custom ERP development" },
    { icon: "agents", label: "AI agents for ERP" },
    { icon: "automation", label: "ERP workflow automation" },
  ],
};

export const offerCard = {
  label: "PLMA 2026 exclusive offer",
  module: offer.module,
  price: offer.price,
  value: offer.value,
  audience: offer.audience,
};

export const formSection = {
  heading: "Request your free ERP module",
  intro:
    "Tell us about your business and the ERP module you need. Our team will review your request and contact you about the next steps.",
  points: [
    "One ERP module, developed free of charge",
    "Representing US$5,000 worth of development work",
    "Prefer to see SesameERP first? Ask for a product demo when we contact you",
  ],
};

export const aboutSection = {
  heading: "About SesameERP",
  body: "SesameERP helps businesses streamline operations through custom ERP systems, intelligent AI agents and business process automation. We build solutions around the way businesses actually work.",
};

export const capabilitiesSection = {
  heading: "Our capabilities",
  lead: "The ERP capabilities SesameERP is showcasing for PLMA 2026.",
  items: [
    {
      icon: "erp",
      title: "Custom ERP development",
      body: "Custom ERP modules designed around your business requirements, workflows and operational processes.",
    },
    {
      icon: "agents",
      title: "AI agents for ERP",
      body: "AI-powered agents that assist with ERP workflows and help businesses manage operations more intelligently.",
    },
    {
      icon: "automation",
      title: "ERP automation",
      body: "Automate repetitive ERP tasks and streamline business processes to improve operational efficiency.",
    },
    {
      icon: "software",
      title: "Customised software",
      body: "Software built around your specific business requirements, for the processes off-the-shelf tools do not cover.",
    },
    {
      icon: "app",
      title: "App development",
      body: "Web and mobile apps that connect to your business systems, so your team can work from anywhere.",
    },
  ],
};

export const audienceSection = {
  heading: "Who we help",
  lead: "Built for the businesses that make, sell and source private-label products.",
  items: [
    { icon: "factory", title: "Private-label manufacturers", body: "Production, stock and retailer orders kept in one system." },
    { icon: "store", title: "Store-brand retailers", body: "Suppliers, products and purchasing tracked together." },
    { icon: "truck", title: "Wholesalers and distributors", body: "Stock, orders and fulfilment across every location." },
    { icon: "package", title: "Product suppliers", body: "Catalogues, quotations and orders managed in one place." },
    { icon: "sourcing", title: "Sourcing partners", body: "RFQs, vendors and purchase orders followed end to end." },
  ],
};

export const eventSection = {
  eyebrow: plmaEvent.name,
  heading: "Meet the future of ERP at PLMA 2026",
  body: "Are you attending PLMA 2026? Discover how SesameERP can help manufacturers, retailers and suppliers streamline operations through custom ERP modules, AI agents and automation.",
  note: "Product demos are arranged individually after you get in touch.",
  officialLink: "Official event page",
};

export const whySection = {
  heading: "Why choose SesameERP?",
  items: [
    { title: "Strategic ERP expertise", body: "Understand business workflows and build ERP solutions around actual operational requirements." },
    { title: "Seamless integration", body: "Connect relevant systems and processes to create a more unified business environment." },
    { title: "Process-first philosophy", body: "Understand and optimise workflows before designing and implementing technology." },
    { title: "Dedicated support", body: "Provide guidance through requirements, development, implementation and ongoing support." },
  ],
};

export const howSection = {
  heading: "How the free ERP module offer works",
  steps: [
    { title: "Submit your details", body: "Tell us about your business and ERP requirements." },
    { title: "Share your requirements", body: "Describe the ERP module you would like to have developed." },
    { title: "Requirements review", body: "Our team reviews your requirements and offer eligibility." },
    { title: "Personal follow-up", body: "Rattan and the team contact you to discuss the next steps." },
  ],
  banner: {
    heading: "PLMA 2026 exclusive offer",
    body: "Get one ERP module developed free of charge, representing US$5,000 worth of development work.",
  },
};

// No approved SesameERP case studies yet, so the section is not rendered.
// Add approved items here and the section appears: { client, overview, solution, outcome? }.
export const caseStudies: { client: string; overview: string; solution: string; outcome?: string }[] = [];

export const plmaFaq = {
  heading: "Frequently asked questions",
  items: [
    {
      q: "What is the PLMA 2026 exclusive offer?",
      a: "One ERP module will be developed free of charge, representing US$5,000 worth of development work.",
    },
    { q: "Who is eligible for this offer?", a: "The offer is available to PLMA conference users." },
    { q: "Which services are included?", a: "This offer is specifically for one ERP module." },
    {
      q: "How do I request the free ERP module?",
      a: "Submit your business details and ERP requirements through the registration form. Our team will review your request and contact you.",
    },
    { q: "Can I request a product demo?", a: "Yes. You can request a SesameERP product demo using the enquiry form." },
    // Brief wording: "Nbits has confirmed that there is no expiry date." Shown without the internal name.
    { q: "Does the offer expire?", a: "No. There is no expiry date for this offer." },
  ],
};

// Only confirmed facts. Full legal terms are pending business approval — TO CONFIRM.
export const offerTerms = {
  heading: "Offer terms",
  summary: "Offer terms and conditions",
  items: [
    "One ERP module is offered free of charge.",
    "The development work represents US$5,000 in value.",
    "The offer is intended for PLMA conference users.",
    "The offer applies to ERP only.",
    "No expiry date has been set for the offer.",
  ],
  pending: "Full legal terms and conditions are pending business approval.",
};

export const plmaSeo = {
  title: "PLMA 2026 Exclusive ERP Offer | Free ERP Module Worth $5,000 | SesameERP",
  description:
    "Attending PLMA 2026? Get one ERP module developed free, representing US$5,000 worth of work. Explore custom ERP development, AI agents and ERP automation with SesameERP.",
  path: campaignPath,
  keywords: [
    "PLMA 2026",
    "private label ERP",
    "free ERP module",
    "custom ERP development",
    "AI agents for ERP",
    "ERP automation",
    "SesameERP",
  ],
  imageAlt: "PLMA 2026 exclusive: one ERP module built free, US$5,000 development value — SesameERP",
};
