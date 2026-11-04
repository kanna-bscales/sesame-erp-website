# PLMA 2026 campaign — production readiness

INTERNAL. Prepared 2026-11-04. Status: **ready for approval, not deployed**.

Routes: `/chicago-event` (landing page + form), `/plma-2026-terms` (terms, `noindex`),
`/api/plma/attendee` (secure lookup), `/api/plma/enquiry` (submission).

## 1. Code checks (latest code from the working copy)

| Check | Result |
| --- | --- |
| `npm run build` | Passes. `/api/plma/attendee` and `/api/plma/enquiry` are dynamic server routes. |
| `npm run lint` | Passes, no warnings. |
| `npx tsc --noEmit` | Passes (after a build has generated Next's route types). |
| Client bundle scan | No Zoho secret names, token endpoint or API domain in `.next/static`. No `NEXT_PUBLIC_` variables used. |
| Automated tests (fake Zoho) | 26/26 pass: prefill, invalid/unknown/duplicate-booth references, edits, optional phone, consent/terms required (client and server), update vs create, repeat submissions, honeypot, rate limits, webform fallback. |
| Live test (real Zoho, internal test lead) | Passed 2026-11-04; test lead deleted. See section 9. |

## 2. Production environment variables (Vercel)

Set in Vercel → Project → Settings → Environment Variables. Environment: **Production** only
(add to Preview only if previews must talk to the real CRM). Tick **Sensitive** for secrets.
Never prefix with `NEXT_PUBLIC_`. Redeploy after adding.

| Variable | Required | Sensitive | Value |
| --- | --- | --- | --- |
| `ZOHO_CLIENT_ID` | Yes | Yes | Self Client "SesameERP PLMA 2026 website" › Client Secret tab |
| `ZOHO_CLIENT_SECRET` | Yes | Yes | Same tab |
| `ZOHO_REFRESH_TOKEN` | Yes | Yes | From `.env.local` (created by `node scripts/zoho-setup.mjs token`) |
| `ZOHO_ACCOUNTS_URL` | No | No | `https://accounts.zoho.com` (default) |
| `ZOHO_API_DOMAIN` | No | No | `https://www.zohoapis.com` (default) |
| `ZOHO_PLMA_CAMPAIGN_ID` | No | No | `7671386000000694366` (default) |
| `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_TO` (+ optional `SMTP_HOST`, `SMTP_PORT`, `CONTACT_FROM`, `RESEND_API_KEY`) | Only for the `/contact` form | Passwords/keys: Yes | Unrelated to PLMA; leave as they are today |

Without the three `ZOHO_*` secrets the site still works: no prefill, and the form posts to the Zoho webform.

## 3. Zoho endpoints

Production Zoho **US** data centre (org945149959, business-scales):

- OAuth token: `https://accounts.zoho.com/oauth/v2/token`
- CRM API: `https://www.zohoapis.com/crm/v8/...`
- Webform fallback: `https://crm.zoho.com/crm/WebToLeadForm`

Scopes on the refresh token: `ZohoCRM.modules.leads.ALL, ZohoCRM.modules.campaigns.READ,ZohoCRM.modules.campaigns.UPDATE,
ZohoCRM.modules.notes.CREATE, ZohoCRM.coql.READ`. All writes use `trigger: []`, so no workflow
rule, approval or blueprint runs and no automatic email is sent.

## 4–5. Attendee data in Zoho and the Google Sheet (done 2026-11-04)

Zoho CRM (Leads, 718 PLMA 2026 records, matched by CRM Lead ID + Attendee Reference Hash + Offer URL):

| Sheet column | Zoho field (API name) |
| --- | --- |
| Company / Country / Website | Company / Country / Website (standard) |
| Booth | Booth_Number |
| Key Contact Name | First_Name + Last_Name (placeholder Last Name "PLMA 2026 exhibitor" when blank) |
| Title | Designation (standard "Title") |
| Company Emails | Company_Emails (full cell); first named/general address in Email, second in Secondary_Email |
| Products | Products |
| Main Food Category | Main_Food_Category (picklist, 20 values) |
| Research Notes | Research_Notes |
| ERP DM 1 Name / Title, ERP DM 2 Name / Title | ERP_DM_1_Name, ERP_DM_1_Title, ERP_DM_2_Name, ERP_DM_2_Title |
| ERP Notes / Research / Stakeholders | ERP_Notes / Research / Stakeholders |
| Proposed opening (hypothesis) | Proposed_Opening |
| Relevant Sesame modules | Relevant_Sesame_Modules (multi-line: 426 free-text variants, a picklist would lose detail) |
| Discovery questions / Next step / Main caveat | Discovery_Questions / Next_Step / Main_Caveat |
| Category | Category (picklist Hot / Warm / Cold) |
| Connection pitch / Sesame ERP | Connection_Pitch / Sesame_ERP (multi-line, line breaks kept) |
| (generated) | Offer_URL, Attendee_Reference_Hash, Conference_Name, Conference_Source |

All 12,226 non-blank research values were written and read back character-for-character (0 mismatches,
0 truncated). Blank cells were not written. Consent, Email Opt Out, Lead Source, tags and campaign
membership were not touched. Zoho's limit on standard multi-line fields was reached, so Next Step,
Main Caveat, Connection Pitch and Sesame ERP use the "large" multi-line type (32,000 characters).

Google Sheet (original file, tab `final`): column Z "Offer URL" added, rows 2–719, 718 URLs, each
on the row of its company (verified by re-reading the sheet). Columns A–Y unchanged.

Local files (private, `data/plma-2026/`, git-ignored): `PLMA_2026_attendees_with_offer_urls_final.xlsx`,
`PLMA_2026_QR_codes.zip`, `refs.json`, `crm_lead_ids.json`, `PLMA_2026_email_banner_per_recipient.csv`.

## 6. Terms & Conditions

Unchanged status: **awaiting business and legal approval**, `termsStatus.indexable = false`
(`noindex`). Open items are in `docs/plma-2026-terms-approval-checklist.md` (updated with the
items raised by the CRM work).

## 7. Internal notification for Rattan (recommendation, not configured)

Today an enquiry updates/creates the Lead, sets the campaign status to "Responded" and adds a
note, but nobody is alerted, because writes run with `trigger: []`.

| Option | How | Pros | Cons |
| --- | --- | --- | --- |
| **A. Zoho Task (recommended)** | The enquiry route also creates a Task "PLMA 2026 enquiry – {Company}" on the Lead, owner Rattan, due next business day | Stays inside Zoho; Rattan gets the normal Zoho in-app/mobile notification; nothing is sent to the attendee; auditable | Needs one extra scope (`ZohoCRM.modules.tasks.CREATE`) and a new refresh token; Rattan's Zoho user ID |
| B. Internal email from the website | After Zoho accepts, the server emails a fixed internal address (reusing the existing SMTP settings): company, booth, link to the Lead. No attendee personal data in the email body | Simple, independent of Zoho | Another credential to manage; email copies of enquiries |
| C. Zoho workflow rule | Turn on workflows for these writes and add an internal email alert | Configured in Zoho UI | Would also fire every other active Leads workflow (including any customer-facing emails). Not recommended unless the Leads workflows are audited first |

## 8. Forwarded personalised links

Each Offer URL contains a 128-bit random reference. It cannot be guessed, but it is a **bearer
link**: whoever holds it (forwarded email, shared QR photo, screenshot, browser history on a shared
device) can:

1. See the details the form prefills. Today that includes the **researched contact name and
   email** (98 rows have no name; 176 have only a generic inbox).
2. Submit an enquiry that updates that company's Lead: their own name/email replace the researched
   contact (the previous values are kept in a note), and Consent becomes true **for the email they
   typed** — which is correct consent for that person, not for the researched contact.

It cannot reveal anything else in the CRM, list other attendees, or work from a booth number alone.

Recommendations, in order:

1. **Prefill company-level fields only** (Company, Booth, Website) and leave Name, Email, Phone and
   Job title for the visitor to type. This removes the main privacy exposure, because the researched
   contact details were never provided by these people. One-line change in `app/api/plma/attendee/route.ts`.
2. **Expire links after the campaign** (e.g. 60 days after the show) with an end date setting.
3. **Revoke a link** if it leaks by clearing that Lead's Attendee Reference Hash in Zoho.
4. **Email verification (one-time code or confirmation link) — not recommended for launch.**
   It adds friction for busy show visitors and needs transactional email sending. Consider it only
   if links are found being misused, or if the business wants a verified email before treating
   consent as valid. With recommendation 1 in place the residual risk is low.

## 9. Test cleanup verification

- Internal test Lead 7671386000000732217 ("PLMA 2026 TEST", fake details) was created, used for one
  live submission and deleted with workflows off (recycle bin). Its link now returns a blank form.
- After deletion: 720 Leads (718 PLMA 2026 + 2 earlier test leads), 718 members in
  "PLMA 2026 – Complimentary ERP Module", 0 of the 718 attendee Leads modified during testing
  (Modified Time compared with a snapshot taken before the test).

## 10. Deployment checklist

Before deploy (decisions/approvals):

- [ ] Business and legal approval of the terms (section 6). Keep `noindex` until then.
- [ ] Decide prefill scope (section 8, recommendation 1).
- [ ] Decide internal notification (section 7) and supply Rattan's Zoho user if option A.
- [ ] Approve the Google Sheet update (section 4–5) and QR hosting location.
- [ ] Privacy policy page (recommended in the terms checklist).
- [ ] Commit the working copy to the `plma-2026-kanna` branch (data/ and .env* are git-ignored).

Deploy:

1. Add the three `ZOHO_*` secrets to Vercel Production (section 2).
2. Push the branch and merge/promote per the usual process; Vercel builds.
3. In Zoho webform settings, confirm the Form Location URL includes `https://www.sesameerp.ai/chicago-event` (used by the fallback only).

After deploy (smoke test, approved test lead only):

1. Create one internal test lead (Conference Name "PLMA 2026 (test)", Email Opt Out on) with its own reference.
2. Open `https://www.sesameerp.ai/chicago-event?ref=<test ref>`: form prefills.
3. Submit once: thank-you shows; same lead updated; notes added; no campaign change; no email.
4. Open a real attendee link (read-only, do not submit): form prefills correctly.
5. Delete the test lead; Lead count back to 720.
6. Rollback if needed: remove the `ZOHO_*` variables and redeploy (site falls back to the webform), or redeploy the previous build.
