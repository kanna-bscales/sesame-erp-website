# PLMA 2026 offer terms — internal launch checklist

Status (2026-11-04): **awaiting business and legal approval. Not approved.** The page stays `noindex`.

INTERNAL. Not rendered on the website. Owner: Rattan / Nbits. Page: `/plma-2026-terms` (copy in `content/plma-2026-terms.ts`).

## Decided by the business (November 3, 2026)

- Sponsor and legal name: Business Scales LLC.
- Governing law: State of Delaware, USA.
- Validity: no fixed closing date; Business Scales may extend, shorten, suspend or cancel; any closing date will be published on the page.
- Liability: indirect and consequential losses excluded; total liability capped at US$5,000; mandatory-law carve-outs kept.
- Contact: info@business-scales.com (published on business-scales.com).
- Value wording: "development services valued up to US$5,000 for one approved ERP module".

## Before launch — please confirm

1. **Legal review.** The new sections (no warranty, liability cap, IP, termination, modifications, privacy) were drafted from the brief, not by a lawyer. Have counsel review them.
2. **Business Scales LLC** is the exact registered name, and it is registered in (or appropriately governed by) Delaware.
3. **IP wording.** Section 9 says custom deliverables "may be transferred following project completion, on the terms set out in your project agreement". Confirm a project agreement will exist for every approved module.
4. **Privacy.** Section 15 describes how form data is used and says it is stored in Zoho CRM. SesameERP has no general Privacy Policy page; one is recommended before launch.
5. **Clickwrap record.** The terms checkbox is enforced in the browser but not stored in Zoho. To keep evidence of acceptance, add a checkbox field (e.g. "Accepted PLMA Offer Terms") to the Zoho webform and map `plma_terms_accept` to it.
6. **Domains.** Resolved: business-scales.com is used everywhere (terms page, landing page footer attribution and email signature). SesameERP URLs use www.sesameerp.ai.
7. **Landing page wording.** The landing page says "representing US$5,000 worth of development work"; the terms say "valued up to US$5,000". Confirm both are acceptable together.
8. **Clickwrap record (update).** When the Zoho API is configured, every submission now adds a Lead note recording consent, terms acceptance and the terms date (`termsMeta.updated`). The webform fallback still does not store it.
9. **Privacy wording for the attendee list.** The 718 Leads were imported from a researched exhibitor list (not submitted by the companies), and personal links pre-fill details from that record. Section 15 should say that contact details may come from publicly available business sources and how to ask for them to be corrected or removed. Legal to confirm.
10. **Canadian recipients.** 119 of the 718 companies are in Canada. Any email follow-up must meet CASL (and CAN-SPAM for US recipients). Importing a record is not consent to marketing email; Consent and Email Opt Out are left as imported.

## When ready to publish

1. Make any wording changes in `content/plma-2026-terms.ts` and update `termsMeta.updated`.
2. Regenerate the PDF (below) and update `pdf.version`.
3. Set `termsStatus.indexable` to `true` so search engines can index the page.

## Regenerating the PDF

The PDF is a snapshot of the page's print view. With the site running (`npm run build && npm run start`), open `/plma-2026-terms` in Chrome, choose Print → Save as PDF (Letter, margins default, background graphics on), and save it over `public/legal/plma-2026-offer-terms.pdf`.
