# PLMA 2026 campaign landing page (`/chicago-event`)

Rendered copy: `content/chicago-event.ts`. Keep both files in sync.

Campaign page for PLMA's 2026 Private Label Trade Show. Rattan sends the promotional emails from his own system to his existing contact list; leads arrive in Zoho CRM and Rattan follows up. The page is not linked from the site navigation.

**The one message:** PLMA 2026 attendees can request complimentary development of one ERP module, representing US$5,000 worth of ERP development work, through SesameERP. Public wording says "complimentary", never "free" (team feedback, November 4, 2026). Official URLs use www: https://www.sesameerp.ai/chicago-event and https://www.sesameerp.ai/plma-2026-terms.

It is NOT a cash credit, account balance or discount, and it covers ERP only (not CRM or other services).

## Confirmed by Nbits

- Business Scales provides development of one ERP module on a complimentary basis.
- The development work represents US$5,000 worth of value.
- ERP only. Available to PLMA conference users. No expiry date.
- Promoted capabilities: custom ERP, AI agents for ERP, ERP automation, customised software, app development.
- Hosted on sesameerp.ai. Leads go to Zoho CRM.

## Open questions (TO CONFIRM)

- Full legal terms and conditions (marked "pending business approval" on the page).
- Location wording: the venue is in Rosemont, next to Chicago. The page says "Rosemont (Chicago), Illinois, USA"; the brief said "Chicago, Illinois, USA".
- Campaign contact email: the footer and the form fallback use the site email `hi@sesamelabs.ai`. Confirm it is the right contact for this campaign.
- Enquiry form (`components/chicago-event/ZohoLeadForm.tsx`, posts to Zoho webform 7671386000000694280). Labels: required fields show a red *; optional fields have no "(optional)" label. Fields: Name (required; split into Zoho First Name / Last Name, one-word names go to Last Name), Business email (required), Company name (required), Phone number (optional), Booth number (optional; pre-filled from `?booth=12345`, editable; no helper text), Job title (optional), Website (optional), "What would you like to discuss with our team?" (textarea, LEADCF3), consent (LEADCF52, required, unticked) and the offer-terms checkbox (browser only). Services Interested In (LEADCF1) and Request Type (LEADCF7) are no longer sent. Until the webform has a Booth Number field, the booth number is written as the first line of LEADCF3 ("Booth number: 12345"). Fixed values: Lead Source "PLMA 2026", Credit Offer Status "Pending Review", tag "PLMA 2026" (webform setting). Submit button: Submit Your Enquiry. Success message only after Zoho accepts the submission. Personal invitation links (`?booth=F2542&ref=<attendee reference>`) pre-fill Name, Business email, Company, Phone, Booth, Job title and Website from the attendee's Zoho Lead via the server route `/api/plma/attendee` (secure reference only; a booth number alone never loads anyone's details); all fields stay editable and both checkboxes stay unticked. Prefill notice: "We have filled in the details we hold for you from your PLMA 2026 invitation. Please check them and change anything that is not right before you submit." Submissions go to `/api/plma/enquiry`, which updates the existing Lead (matched by reference, then email) or creates one; it falls back to the Zoho webform when Zoho API credentials are not configured.
- FAQ "Does the offer expire?": the brief's answer was "Nbits has confirmed that there is no expiry date." The page shows "No. There is no expiry date for this offer." so the internal name is not shown to visitors.
- Case studies: none approved for SesameERP, so the section is hidden. Add items to `caseStudies` to show it.

## Header and footer on this page

- Header button: Request your complimentary ERP module (to the form). Secondary, on wide screens and in the mobile menu: Request a demo (to the PLMA 2026 section).
- "How it works" and "FAQ" in the header scroll to this page's sections; "AI agents" and "Modules" open the homepage sections.
- Footer tagline: Custom ERP solutions with AI agents and intelligent automation.
- Footer attribution: A product of Business Scales (links to https://business-scales.com/).

## Hero

- Eyebrow: PLMA 2026 attendee exclusive
- Headline: Complimentary development / of one ERP module.
- Highlight: US$5,000 worth of ERP development work
- Description: Attending PLMA 2026? Explore how SesameERP can help improve your business operations with custom ERP development, AI agents and ERP automation.
- Benefits: One complimentary ERP module · Custom ERP development · AI agents for ERP · ERP workflow automation
- Buttons: Request your complimentary ERP module (to the form) · Request a demo (to the PLMA 2026 section)
- Offer card: PLMA 2026 exclusive offer · One ERP module · Complimentary · Development value US$5,000 · Available to PLMA 2026 attendees

## Request your complimentary ERP module

Tell us about your business and the ERP module you need. Our team will review your request and contact you about the next steps.

- Complimentary development of one ERP module
- Representing US$5,000 worth of development work
- Prefer to see SesameERP first? Ask for a product demo when we contact you

Link: Read the offer terms.

## About SesameERP

SesameERP helps businesses streamline operations through custom ERP systems, intelligent AI agents and business process automation. We build solutions around the way businesses actually work.

A product of Business Scales (https://business-scales.com/).

## Our capabilities

Lead: The ERP capabilities SesameERP is showcasing for PLMA 2026.

- **Custom ERP development** — Custom ERP modules designed around your business requirements, workflows and operational processes.
- **AI agents for ERP** — AI-powered agents that assist with ERP workflows and help businesses manage operations more intelligently.
- **ERP automation** — Automate repetitive ERP tasks and streamline business processes to improve operational efficiency.
- **Customised software** — Software built around your specific business requirements, for the processes off-the-shelf tools do not cover.
- **App development** — Web and mobile apps that connect to your business systems, so your team can work from anywhere.

"Learn more" links (open in a new tab): Custom ERP development → `/#modules`, AI agents for ERP → `/#agents`, ERP automation → `/#process`. Customised software and App development have no link (no matching page yet).

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

## How the complimentary ERP module offer works

1. **Submit your details** — Tell us about your business and ERP requirements.
2. **Share your requirements** — Describe the ERP module you would like to have developed.
3. **Requirements review** — Our team reviews your requirements and offer eligibility.
4. **Personal follow-up** — Rattan and the team contact you to discuss the next steps.

Banner: **PLMA 2026 exclusive offer** — Complimentary development of one ERP module, representing US$5,000 worth of ERP development work. Button: Request your complimentary ERP module.

## Frequently asked questions

1. **What is the PLMA 2026 exclusive offer?** Complimentary development of one ERP module, representing US$5,000 worth of ERP development work.
2. **Who is eligible for this offer?** The offer is available to PLMA conference users.
3. **Which services are included?** This offer is specifically for one ERP module.
4. **How do I request the complimentary ERP module?** Submit your business details and ERP requirements through the registration form. Our team will review your request and contact you.
5. **Can I request a product demo?** Yes. You can request a SesameERP product demo using the enquiry form.
6. **Does the offer expire?** No. There is no expiry date for this offer.

## Offer terms and conditions

- Development of one ERP module is offered on a complimentary basis.
- The development work represents US$5,000 in value.
- The offer is intended for PLMA conference users.
- The offer applies to ERP only.
- No expiry date has been set for the offer.

Full legal terms and conditions are pending business approval.

## SEO

- Title: PLMA 2026 Exclusive ERP Offer | Complimentary ERP Module Development | SesameERP
- Description: Attending PLMA 2026? Request complimentary development of one ERP module, representing US$5,000 worth of ERP development work. Explore custom ERP development, AI agents and ERP automation with SesameERP.
- Canonical / og:url: https://www.sesameerp.ai/chicago-event
- Canonical: https://sesameerp.ai/chicago-event
- Social image: `app/chicago-event/opengraph-image.tsx` (campaign version of the site image).
