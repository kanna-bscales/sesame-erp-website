# PLMA 2026 campaign landing page (`/chicago-event`)

Rendered copy: `content/chicago-event.ts`. Keep both files in sync.

Campaign page for PLMA's 2026 Private Label Trade Show. Rattan sends the promotional emails from his own system to his existing contact list; leads arrive in Zoho CRM and Rattan follows up. The page is not linked from the site navigation.

**The one message:** PLMA conference users can request one free ERP module representing US$5,000 worth of development work through SesameERP.

It is NOT a cash credit, account balance or discount, and it covers ERP only (not CRM or other services).

## Confirmed by Nbits

- Business Scales provides one ERP module free of charge.
- The development work represents US$5,000 worth of value.
- ERP only. Available to PLMA conference users. No expiry date.
- Promoted capabilities: custom ERP, AI agents for ERP, ERP automation, customised software, app development.
- Hosted on sesameerp.ai. Leads go to Zoho CRM.

## Open questions (TO CONFIRM)

- Full legal terms and conditions (marked "pending business approval" on the page).
- Location wording: the venue is in Rosemont, next to Chicago. The page says "Rosemont (Chicago), Illinois, USA"; the brief said "Chicago, Illinois, USA".
- Campaign contact email: the footer and the form fallback use the site email `hi@sesamelabs.ai`. Confirm it is the right contact for this campaign.
- Registration form: custom form (`components/chicago-event/ZohoLeadForm.tsx`) that posts to the existing Zoho CRM webform (Leads, form 7671386000000694280) — same endpoint and request Zoho's generated code uses. Field map and keys live in `zohoLeadForm` in `content/chicago-event.ts`. It captures ERP requirements (LEADCF3), request type Free ERP Module / Product Demo / Both (LEADCF7), ERP interests (LEADCF1) and UTM source/medium/campaign (LEADCF4/6/5). Lead Source "PLMA 2026", tag "PLMA 2026" (set in the webform), campaign "PLMA 2026 – Free ERP Module". The old "Chicago Event" Lead Source option and "Chicago Event – $5,000 Credits" campaign are kept. Campaign association of new leads is not automatic yet (needs a Zoho workflow + custom function). If the webform is edited in Zoho, re-copy the hidden keys from Publish Options.
- FAQ "Does the offer expire?": the brief's answer was "Nbits has confirmed that there is no expiry date." The page shows "No. There is no expiry date for this offer." so the internal name is not shown to visitors.
- Case studies: none approved for SesameERP, so the section is hidden. Add items to `caseStudies` to show it.

## Header and footer on this page

- Header button: Request your free ERP module (to the form). Secondary, on wide screens and in the mobile menu: Request a demo (to the PLMA 2026 section).
- "How it works" and "FAQ" in the header scroll to this page's sections; "AI agents" and "Modules" open the homepage sections.
- Footer tagline: Custom ERP solutions with AI agents and intelligent automation.
- Footer attribution: A product of BusinessScales.com (links to https://business-scales.com/).

## Hero

- Eyebrow: PLMA 2026 attendee exclusive
- Headline: Get one ERP module / built for free.
- Highlight: US$5,000 worth of ERP development work
- Description: Attending PLMA 2026? Discover how SesameERP can help improve your business operations. Get one ERP module developed at no cost, representing US$5,000 worth of development work.
- Benefits: One free ERP module · Custom ERP development · AI agents for ERP · ERP workflow automation
- Buttons: Request your free ERP module (to the form) · Request a demo (to the PLMA 2026 section)
- Offer card: PLMA 2026 exclusive offer · One ERP module · Free · Development value US$5,000 · Available to PLMA conference users

## Request your free ERP module

Tell us about your business and the ERP module you need. Our team will review your request and contact you about the next steps.

- One ERP module, developed free of charge
- Representing US$5,000 worth of development work
- Prefer to see SesameERP first? Ask for a product demo when we contact you

Link: Read the offer terms.

## About SesameERP

SesameERP helps businesses streamline operations through custom ERP systems, intelligent AI agents and business process automation. We build solutions around the way businesses actually work.

A product of BusinessScales.com.

## Our capabilities

Lead: The ERP capabilities SesameERP is showcasing for PLMA 2026.

- **Custom ERP development** — Custom ERP modules designed around your business requirements, workflows and operational processes.
- **AI agents for ERP** — AI-powered agents that assist with ERP workflows and help businesses manage operations more intelligently.
- **ERP automation** — Automate repetitive ERP tasks and streamline business processes to improve operational efficiency.
- **Customised software** — Software built around your specific business requirements, for the processes off-the-shelf tools do not cover.
- **App development** — Web and mobile apps that connect to your business systems, so your team can work from anywhere.

## Who we help

Lead: Built for the businesses that make, sell and source private-label products.

- **Private-label manufacturers** — Production, stock and retailer orders kept in one system.
- **Store-brand retailers** — Suppliers, products and purchasing tracked together.
- **Wholesalers and distributors** — Stock, orders and fulfilment across every location.
- **Product suppliers** — Catalogues, quotations and orders managed in one place.
- **Sourcing partners** — RFQs, vendors and purchase orders followed end to end.

## Meet the future of ERP at PLMA 2026

Are you attending PLMA 2026? Discover how SesameERP can help manufacturers, retailers and suppliers streamline operations through custom ERP modules, AI agents and automation.

- Event: PLMA's 2026 Private Label Trade Show
- Dates: November 15–17, 2026
- Venue: Donald E. Stephens Convention Center
- Location: Rosemont (Chicago), Illinois, USA
- Link: Official event page — https://plma.com/events/plmas-2026-private-label-trade-show

Button: Request a product demo (to the form). Note: Product demos are arranged individually after you get in touch.

No booth, venue demo, time or meeting place is claimed.

## Why choose SesameERP?

- **Strategic ERP expertise** — Understand business workflows and build ERP solutions around actual operational requirements.
- **Seamless integration** — Connect relevant systems and processes to create a more unified business environment.
- **Process-first philosophy** — Understand and optimise workflows before designing and implementing technology.
- **Dedicated support** — Provide guidance through requirements, development, implementation and ongoing support.

## How the free ERP module offer works

1. **Submit your details** — Tell us about your business and ERP requirements.
2. **Share your requirements** — Describe the ERP module you would like to have developed.
3. **Requirements review** — Our team reviews your requirements and offer eligibility.
4. **Personal follow-up** — Rattan and the team contact you to discuss the next steps.

Banner: **PLMA 2026 exclusive offer** — Get one ERP module developed free of charge, representing US$5,000 worth of development work. Button: Request your free ERP module.

## Frequently asked questions

1. **What is the PLMA 2026 exclusive offer?** One ERP module will be developed free of charge, representing US$5,000 worth of development work.
2. **Who is eligible for this offer?** The offer is available to PLMA conference users.
3. **Which services are included?** This offer is specifically for one ERP module.
4. **How do I request the free ERP module?** Submit your business details and ERP requirements through the registration form. Our team will review your request and contact you.
5. **Can I request a product demo?** Yes. You can request a SesameERP product demo using the enquiry form.
6. **Does the offer expire?** No. There is no expiry date for this offer.

## Offer terms and conditions

- One ERP module is offered free of charge.
- The development work represents US$5,000 in value.
- The offer is intended for PLMA conference users.
- The offer applies to ERP only.
- No expiry date has been set for the offer.

Full legal terms and conditions are pending business approval.

## SEO

- Title: PLMA 2026 Exclusive ERP Offer | Free ERP Module Worth $5,000 | SesameERP
- Description: Attending PLMA 2026? Get one ERP module developed free, representing US$5,000 worth of work. Explore custom ERP development, AI agents and ERP automation with SesameERP.
- Canonical: https://sesameerp.ai/chicago-event
- Social image: `app/chicago-event/opengraph-image.tsx` (campaign version of the site image).
