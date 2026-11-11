# PLMA 2026 – Phase 2 (approved requirements): implementation and operations

INTERNAL. Implemented 2026-11-11 on branch `plma-2026-phase2`. **Not deployed.** Attendee data and
references are never in Git (`data/` is git-ignored).

## Core rules (as implemented)

- One person = one Zoho Lead. Several people at one company = several Leads with the same
  **PLMA Company ID**. Different companies never share an ID, even on a shared booth.
- Every person has their own secure reference (128-bit, only its SHA-256 hash in Zoho) and Offer URL
  `https://www.sesameerp.ai/chicago-event?ref=<reference>`. Links do not expire. The 718 original
  references and URLs are unchanged.
- The reference is the primary identity. Without one, an email alone never identifies a person;
  uncertain cases are flagged for review instead of merged or duplicated.
- Original imported values are never overwritten by the form. What a person types is stored in the
  `Submitted_*` fields, with a note listing what changed and when.

## Zoho CRM fields added (Leads)

| Field (API name) | Type | Purpose |
| --- | --- | --- |
| PLMA Company ID (`PLMA_Company_ID`) | text 30 | `PLMA26-C<row>` for the imported companies (row of the original import), `PLMA26-W<8 random>` for a company first seen on the website |
| PLMA Contact Role (`PLMA_Contact_Role`) | picklist | Primary Attendee / Research Contact / Added by Colleague / Self-registered |
| Submitted Name, Email, Company, Phone, Job Title, Website, Booth Number (`Submitted_*`) | text / email | Latest values the person submitted |
| Submitted Additional Emails (`Submitted_Additional_Emails`) | large multi-line | The person's own extra addresses, one per line (max 5 per submission) |
| PLMA Duplicate Review (`PLMA_Duplicate_Review`) | checkbox | Set when identity is uncertain; see the Duplicate Review view |
| PLMA Duplicate Reason (`PLMA_Duplicate_Reason`) | text 255 | Why |

Existing: Attendee Reference Hash, Offer URL, PLMA Response Status (Not Submitted / Submitted),
PLMA Submission Date, Conference Name/Source, Booth Number.

## Data changes made on 2026-11-11

| Change | Result |
| --- | --- |
| Backups | CRM: all 720 Leads (all fields), notes, campaign members → `data/plma-2026/backups/2026-11-11/PLMA_2026_CRM_backup_before_phase2_2026-11-11.json`. Google Sheet → `…/PLMA_2026_Exhibitors_Master_backup_before_phase2_2026-11-11.xlsx`. Local workbook, refs, lead IDs copied alongside. |
| F2205 restored | The booth F2205 attendee Lead (used for an earlier live test): name, company, empty email restored from the original import; consent false; status Not Submitted; submission date, UTM and test enquiry cleared; the two test notes deleted. Verified field by field against the source. Campaign status was still Planned. |
| Company ID + role backfill | 718 of 718 primary Leads: `PLMA26-C<row>` + Primary Attendee. Mapping checksum matched the import mapping. |
| Research contacts | 509 Leads from ERP DM 1 / DM 2 (see below), role Research Contact, status Not Submitted, no email, not added to the campaign, own reference + Offer URL + QR code. |
| Preservation check | All 720 pre-existing Leads compared field by field with the backup: 719 identical; F2205 differs only in the restored fields. |
| Google Sheet | New tab **Research Contacts** (509 rows, person level). `final` not modified. |

### Research contacts: how people were selected

Source: ERP DM 1 / DM 2 Name and Title, 988 filled cells on 718 rows.

- 476 skipped: same person as the row's key contact (name match incl. nicknames, e.g. Rob/Robert).
- 3 not created, listed for manual review because the same name is the key contact of another
  company's row (related or parent companies). List: `data/plma-2026/phase2/dm.json` › `review`.
- 509 created. Same-surname family members are different people and were created. One row has two
  people in one key-contact cell; the existing Lead was not changed and no extra Lead was created.
- None existed in the CRM before (name check against all 720 Leads).
- Names split with surname particles and suffixes kept in the last name ("de …", "van …", "… Jr.", Spanish double surnames).

Private files: `data/plma-2026/phase2/` (research_contacts.csv with Offer URLs and Lead IDs,
research_refs.json, QR code zip, build scripts).

## Website behaviour

### `/api/plma/attendee` (pre-fill)

Valid reference → the person's latest submitted values (fallback: original values) for Name, Email,
Company, Phone, Booth, Job title, Website, plus their own additional emails. `company` =
`{ name, otherSubmitted, names }`: the original Company name, the number of OTHER Leads with the
same PLMA Company ID and status Submitted (current person excluded), and the **first names** of
only those of them whose **PLMA Show First Name** checkbox is ticked (first word of the name they
submitted, else the CRM first name; letters only, 2–40 characters; earliest submission first; at
most 10 returned, 5 shown). Never surnames, emails, enquiries, notes, research fields, IDs or
roles. Booth numbers are never used.

**PLMA Show First Name** (`PLMA_Show_First_Name`, checkbox, default off): separate permission,
not implied by Consent to be Contacted. Set from the optional form checkbox on every submission
(latest choice wins); colleagues added via "Add another contact" always get false. To be created
in Zoho (Leads) before release.

### `/api/plma/enquiry` (submit)

| Situation | What happens |
| --- | --- |
| **A** Valid reference | That Lead only. `Submitted_*` written, status Submitted + date, consent, enquiry prepended to ERP Requirements, note "PLMA 2026 – details changed by the contact" listing changes. Originals untouched. Campaign → Responded. |
| A + typed email belongs to another Lead | Saved on the reference holder's Lead; both stay separate; this Lead gets PLMA Duplicate Review + reason. |
| No reference, email unknown | New Lead (Self-registered), new Company ID, new reference + Offer URL, Submitted. |
| No reference, email + name match one Lead | Treated as that person (scenario A). Shared inbox also needs the same company. |
| **B / D** Shared inbox (info@, sales@ …), different name, same company | New Lead with that company's Company ID (Self-registered). Nobody is overwritten. |
| **C** Email on another Lead under a different/unknown name, or several matches, or shared inbox at a different company | Nothing created, merged or overwritten. Matched Lead(s) flagged PLMA Duplicate Review + reason; note "PLMA 2026 enquiry – needs manual review" with the submitted details. Visitor sees the normal thank-you. |
| Repeat submission | Same Lead updated again; additional emails merged; no duplicates. |

**Add another contact** (max 10 per submission): each new person → a separate Lead with the
submitter's Company ID, Company and Booth, role Added by Colleague, status Not Submitted, own
reference + Offer URL, no consent, not in the campaign, not emailed. Skipped: the submitter, people
already at that company (name, nickname or own email match), duplicates within the request. A
colleague email already used at another company → flagged for review, not created. A note on the
submitter's Lead lists the outcome. Test submitters (Conference Name "PLMA 2026 (test)") create test
colleagues.

Limits: request ≤ 24 KB, ≤ 5 extra emails, ≤ 10 colleagues, 6 submissions per IP per 10 minutes,
20 lookups per IP per 10 minutes, honeypot. All writes `trigger: []` (no workflows, no emails).

## Views and reports (Zoho CRM › Leads)

| View | Criteria |
| --- | --- |
| PLMA – All Contacts | Conference Name = PLMA 2026 (renamed from "PLMA – All Attendees") |
| PLMA – Primary Attendees | + Contact Role = Primary Attendee |
| PLMA – Additional / Research Contacts | + Contact Role ≠ Primary Attendee |
| PLMA – Submitted / PLMA – Not Submitted | + PLMA Response Status |
| PLMA – Duplicate Review | PLMA Duplicate Review = true |

Reports (folder Lead Reports):

- **PLMA – Company contacts and submissions** (matrix): rows = PLMA Company ID + Company, columns =
  PLMA Response Status, row count + grand total → total contacts, submitted and not submitted per
  company. People = rows; companies = groups.
- **PLMA – Latest submission by company**: submitted people grouped by Company ID, newest
  Submission Date first (Zoho reports cannot aggregate a date, so the first row per company is the
  latest submission).

Counts on 2026-11-11: 1,227 people (718 primary + 509 research), 718 companies, 0 submitted.

## Campaign status "Responded" (requirement 11)

Earlier live tests showed the campaign member status did not change, which is the symptom of a
refresh token without `ZohoCRM.modules.campaigns.UPDATE`. To check and fix (on your computer, in
the project folder; nothing secret is printed):

1. `node scripts/zoho-setup.mjs check`: lists the granted scopes and names any missing one.
2. If campaigns.UPDATE is missing: Zoho API Console › Self Client › Generate Code with scope
   `ZohoCRM.modules.leads.ALL,ZohoCRM.modules.campaigns.READ,ZohoCRM.modules.campaigns.UPDATE,ZohoCRM.modules.notes.CREATE,ZohoCRM.coql.READ`,
   then `node scripts/zoho-setup.mjs token` (updates `.env.local`).
3. `node scripts/zoho-setup.mjs campaign-test`: creates one fake test Lead, sets it Responded in
   the PLMA campaign, reads it back, deletes it. Must print PASS.
4. Update `ZOHO_REFRESH_TOKEN` in Vercel › Settings › Environment Variables (Production, Sensitive)
   yourself, then redeploy when the release is approved. Never paste tokens into chat, code or docs.

## Google Sheet

- `final` was found changed by the team since Nov 4 (file now "PLMA_2026_Exhibitors_Master.xlsx",
  new columns Category and Plants / Locations, Offer URL now column AA, more tabs). All 717 rows
  present have their correct Offer URL. One company (original import row 539) is no
  longer in the sheet; its CRM Lead and URL still exist. Not changed by Phase 2: confirm whether the
  removal was intended.
- New tab **Research Contacts**: original import row, Company, PLMA Company ID, Booth, Person, Job
  title, source column, role, "No (researched, not confirmed)", Email (blank), Offer URL, CRM Lead ID.

## Rollback

- Code: do not merge the branch (production is unchanged).
- CRM: research contacts can be listed with the "PLMA – Additional / Research Contacts" view
  (Conference Source "PLMA 2026 exhibitor research list (ERP DM n)"); new fields can be hidden; the
  JSON backup has every pre-Phase-2 value. Nothing was deleted except the two F2205 test notes.
