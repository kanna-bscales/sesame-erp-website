# PLMA 2026 campaign landing page (`/chicago-event`)

Rendered copy: `content/chicago-event.ts`. Keep both files in sync.

Campaign page for PLMA's 2026 Private Label Trade Show. Rattan sends the promotional emails from his own system to his existing contact list; leads arrive in Zoho CRM and Rattan follows up. The page is not linked from the site navigation.

**The one message:** PLMA 2026 attendees can request complimentary development of one approved ERP module, with development services valued up to US$5,000, through SesameERP. Public wording says "complimentary", never "free" (team feedback, November 4, 2026). Official URLs use www: https://www.sesameerp.ai/chicago-event and https://www.sesameerp.ai/plma-2026-terms.

It is NOT a cash credit, account balance or discount, and it covers ERP only (not CRM or other services).

## Confirmed by Nbits

- Business Scales provides development of one ERP module on a complimentary basis.
- The development work represents US$5,000 worth of value. (Website wording since Nov 11, 2026: development services valued up to US$5,000, not cash or credit, matching the legal terms.)
- ERP only. Available to PLMA conference users. No expiry date.
- Promoted capabilities: custom ERP, AI agents for ERP, ERP automation, customised software, app development.
- Hosted on sesameerp.ai. Leads go to Zoho CRM.

## Open questions (TO CONFIRM)

- Full legal terms and conditions (marked "pending business approval" on the page).
- Location wording: the venue is in Rosemont, next to Chicago. The page says "Rosemont (Chicago), Illinois, USA"; the brief said "Chicago, Illinois, USA".
- Campaign contact email: the site email stays `hi@sesamelabs.ai` (owner decision, Nov 11, 2026); the PLMA campaign footer shows the sponsor's info@businessscales.com.
- Enquiry form (`components/chicago-event/ZohoLeadForm.tsx`, posts to Zoho webform 7671386000000694280). Labels: required fields show a red *; optional fields have no "(optional)" label. Fields: Name (required; split into Zoho First Name / Last Name, one-word names go to Last Name), Business email (required), Company name (required), Phone number (optional), Booth number (optional; pre-filled only from the verified CRM record of a personal link, editable; no helper text), Job title (optional), "Let us know what we can help you with." (textarea, LEADCF3), consent (LEADCF52, required, unticked) and the offer-terms checkbox (browser only). Services Interested In (LEADCF1) and Request Type (LEADCF7) are no longer sent. Until the webform has a Booth Number field, the booth number is written as the first line of LEADCF3 ("Booth number: 12345"). Fixed values: Lead Source "PLMA 2026", Credit Offer Status "Pending Review", tag "PLMA 2026" (webform setting). Submit button: Submit Your Request. Success message only after Zoho accepts the submission. Personal invitation links (`/chicago-event?ref=<attendee reference>`, no booth number in the link) pre-fill Name, Business email, Company, Phone, Booth and Job title from the attendee's Zoho Lead via the server route `/api/plma/attendee` (secure reference only; a booth number alone never loads anyone's details); all fields stay editable and both checkboxes stay unticked. Submissions go to `/api/plma/enquiry`, which updates the existing Lead (matched by reference, then email) or creates one; it falls back to the Zoho webform when Zoho API credentials are not configured.
- FAQ "Does the offer expire?": the brief's answer was "Nbits has confirmed that there is no expiry date." The page shows "No. There is no expiry date for this offer." so the internal name is not shown to visitors.
- Case studies: none approved for SesameERP, so the section is hidden. Add items to `caseStudies` to show it.

## Enquiry form: Phase 2 additions (approved requirements, November 2026)

Rendered from `leadForm` in `content/chicago-event.ts`. Behaviour is described in `docs/plma-2026-phase2.md`.

- Company message (personal links only, when other people at the same company, by PLMA Company ID, have already submitted; the current person excluded):
    - With first names (Nov 2026), only for colleagues who ticked the name-display box: "Prakash from ABC Foods has already submitted an enquiry. You can still submit yours." / "Prakash and Monesh from ABC Foods have already submitted their enquiries. You can still submit yours." / "Prakash, Monesh and Sarah from …" (up to 5 names). Colleagues without permission are counted: "Priya and 1 other colleague from XYZ Snacks have already submitted their enquiries. You can still submit yours."
    - Nobody gave permission: "We have already received enquiries from {n} other contact(s) at {Company}. You can still submit your own enquiry."
    - Nobody else submitted: no message. Never surnames, emails, enquiries or notes.
- Name-display permission (optional checkbox under the terms, never pre-ticked; separate from the contact consent): "Colleagues from my company who open their own PLMA 2026 invitation may see my first name, so they know I have already enquired." Saved in Leads › PLMA Show First Name on every submission (latest choice wins). Copy TO APPROVE.
- Extra emails for the same person: button "Add another email" (up to 5), field label "Another email for you", remove button "Remove email", hint "Only addresses you use yourself. Colleagues go in "Other contacts at your company" below.", error "Enter a valid email, like name@company.com, or remove this row."
- Colleagues: box "Other contacts at your company", text "Add colleagues who should also hear about the offer. Each person is recorded separately; we do not email them automatically." Button "Add another contact" (up to 10 per submission). Each row "Contact {n}": Colleague's name (required), Colleague's business email (required), Colleague's job title. Remove: "Remove contact". Errors: "Enter this colleague's name, or remove the row." / "Enter this colleague's business email, or remove the row." Limit text: "You can add up to 10 contacts at a time." Empty rows are ignored.
- Success, when colleagues were recorded: "We have also recorded {n} colleague(s) you added."
- Webform fallback (no Zoho API credentials): extra emails and colleagues are appended to the enquiry text.
- Event section on this page links to the guide: "PLMA 2026 guide: the association, the show and ERP for private label" (`/plma-2026`).

## PLMA content on this page (revised November 11, 2026)

Short, offer-focused copy (`plmaLanding`, `plmaLandingFaq` in `content/plma-2026.ts`), deliberately different from the full `/plma-2026` guide, which holds the association details, schedule and who attends.

- Event band facts: Event; Dates "November 15–17, 2026"; "Sunday, Nov 15: education" Hyatt Regency O'Hare; "Mon–Tue, Nov 16–17: trade show" Donald E. Stephens Convention Center; Location "Rosemont (Chicago), Illinois, USA". Links: Official event page; "PLMA 2026 guide: schedule, who attends and ERP for private label" (`/plma-2026`).
- Event band: independence statement "SesameERP, a product of Business Scales LLC, is an independent ERP provider. It is not affiliated with, sponsored by or endorsed by PLMA. Event details are summarised from PLMA's official website."
- Offer wording everywhere (aligned with the legal terms, owner decision Nov 11, 2026): "Complimentary development of one approved ERP module, with development services valued up to US$5,000. It is not cash or credit." Hero highlight and offer card value: "Development services valued up to US$5,000" / "Up to US$5,000"; offer card note "Development work, not cash or credit"; form points "Complimentary development of one approved ERP module" and "Development services valued up to US$5,000, not cash or credit".
- Section **Built for private label manufacturers** (after the event band): lead "Private label manufacturers juggle several retailers' prices, specifications and order patterns at once. One complimentary ERP module can start with the area that costs your team the most time." Five examples based on existing SesameERP modules (Retailer-specific pricing and quotes, Purchasing from several suppliers, Stock through every production stage, Orders tied to inventory, AI agents for repetitive work), note "Examples only. The module and its scope are agreed with you after review, under the offer terms.", button to the form and link to the guide.
- FAQ additions after the offer questions: "Is the offer paid as cash or credit?" (No, plus the offer wording), "When and where is PLMA 2026?" (schedule split, points to the guide), "Is this offer from PLMA?" (No; SesameERP is independent and not affiliated with, sponsored by or endorsed by PLMA; the offer is provided by Business Scales LLC, the company behind SesameERP).

## Header and footer on this page

- Header button: Request your complimentary ERP module (to the form). Secondary, on wide screens and in the mobile menu: Request a demo (to the PLMA 2026 section).
- "How it works" and "FAQ" in the header scroll to this page's sections; "AI agents" and "Modules" open the homepage sections.
- Footer tagline: Custom ERP solutions with AI agents and intelligent automation.
- Footer attribution: A product of Business Scales (links to https://businessscales.com/).

## Top section (offer + registration form)

One combined section at the top of the page (`id="top"`), two columns. There is no separate hero band and no form-intro text block — the offer card, benefits, buttons and terms sit directly beside the form.

Left column:
- Offer card: PLMA 2026 exclusive offer · One ERP module · Complimentary · Development value Up to US$5,000 · Available to PLMA conference users · Development work, not cash or credit
- Benefits: One complimentary ERP module · Custom ERP development · AI agents for ERP · ERP workflow automation
- Buttons: Request your complimentary ERP module (to the form, `#register`) · Request a demo (to the PLMA 2026 section, `#plma-2026`)
- Offer terms apply. PLMA Offer Terms & Conditions (to `/plma-2026-terms`)

Right column: the registration form (`#register`; see the form bullet under "Open questions" above).

## About SesameERP

SesameERP helps businesses streamline operations through custom ERP systems, intelligent AI agents and business process automation. We build solutions around the way businesses actually work.

A product of Business Scales (https://businessscales.com/).

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

Banner: **PLMA 2026 exclusive offer** — Complimentary development of one approved ERP module, with development services valued up to US$5,000. It is not cash or credit. Button: Request your complimentary ERP module.

## Frequently asked questions

1. **What is the PLMA 2026 exclusive offer?** Complimentary development of one approved ERP module, with development services valued up to US$5,000. It is not cash or credit.
2. **Who is eligible for this offer?** The offer is available to PLMA conference users.
3. **Which services are included?** This offer is specifically for one ERP module.
4. **How do I request the complimentary ERP module?** Submit your business details and ERP requirements through the registration form. Our team will review your request and contact you.
5. **Can I request a product demo?** Yes. You can request a SesameERP product demo using the enquiry form.
6. **Does the offer expire?** No. There is no expiry date for this offer.

## Offer terms and conditions

- Development of one ERP module is offered on a complimentary basis.
- Development services are valued up to US$5,000. It is not cash or credit.
- The offer is intended for PLMA conference users.
- The offer applies to ERP only.
- No expiry date has been set for the offer.

Full legal terms and conditions are pending business approval.

## SEO

- Title: PLMA 2026 Exclusive ERP Offer | Complimentary ERP Module Development | SesameERP
- Description: Attending PLMA 2026? Request complimentary development of one approved ERP module, with development services valued up to US$5,000. Explore custom ERP development, AI agents and ERP automation with SesameERP.
- Canonical / og:url: https://www.sesameerp.ai/chicago-event
- Canonical: https://sesameerp.ai/chicago-event
- Social image: `app/chicago-event/opengraph-image.tsx` (campaign version of the site image).
