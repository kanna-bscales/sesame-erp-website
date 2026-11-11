# PLMA 2026 personalised email banner (for Rattan)

One common banner image for everyone; each recipient's banner links to **their own Offer URL**
(Zoho CRM › Leads › field **Offer URL**, also column Z "Offer URL" in the `final` tab of the
attendee Google Sheet).

- Banner image (public once the site is deployed):
  `https://www.sesameerp.ai/images/email-signature/plma-2026-banner.png` (1200 × 300, shown at 600 × 150).
  Source: `public/images/email-signature/plma-2026-banner-source.html` (self-contained — Archivo and
  IBM Plex Sans are embedded as base64 woff2; rebuild by screenshotting it at a 1200 × 300 viewport,
  deviceScaleFactor 1).
- Design: SesameERP site theme (paper sheet with the carbon-copy canary offset shadow, ballpoint-red
  "Claim your module →" button). Copy: "Your first custom ERP module, developed FREE — a $5,000 value",
  with FREE highlighted in canary; brand lockup reads "SesameERP · PLMA 2026 attendee offer". The whole
  image is one link. Note: this banner uses "FREE" (owner-approved, Nov 4 2026); the rest of the campaign
  copy uses "complimentary".

## HTML snippet

Replace `OFFER_URL` with the recipient's Offer URL using your sending tool's merge field:

```html
<a href="OFFER_URL" target="_blank" style="display:block;text-decoration:none;border:0;">
  <img src="https://www.sesameerp.ai/images/email-signature/plma-2026-banner.png" width="600"
       alt="Your first custom ERP module, developed FREE — a $5,000 value. Claim your module."
       style="display:block;width:600px;max-width:100%;height:auto;border:0;">
</a>
```

## Merge field (check before sending)

The merge-field syntax depends on the tool used to send, and **has not been verified by a test
send** (no emails were sent during setup). Before the real send, put the snippet in a template,
send it to yourself, and click the banner: it must open
`https://www.sesameerp.ai/chicago-event?ref=…` for that record, not a literal placeholder.

| Sending from | Where the URL comes from | What to check |
| --- | --- | --- |
| Zoho CRM email template (Leads) | Field "Offer URL" | Insert it with the template editor's **Insert Merge Field › Leads › Offer URL** button (do not type the tag by hand), then use that inserted tag as the `href`. |
| Zoho Campaigns / Marketing Automation | Sync the Leads field "Offer URL" to a list field | Insert that field's merge tag from the editor. |
| Google Sheets mail-merge add-on | Column "Offer URL" in tab `final` | Use the add-on's column placeholder for "Offer URL". |
| Any other tool | `data/plma-2026/PLMA_2026_email_banner_per_recipient.csv` | Already-merged banner HTML per recipient (column "Banner HTML"); no merge field needed. Private file, not in Git. |

## Before sending

- Send only to records with an email (273 of 718). 176 are generic inboxes (info@, sales@ …).
- Contact details were researched, not provided by the companies; nobody on the list has opted in.
  Follow CAN-SPAM (US) and CASL (119 Canadian companies): clear sender, physical address, and a
  working unsubscribe link in every email. Honour Email Opt Out in Zoho.
- Each link is personal: if a recipient forwards it, the person who opens it sees that company's
  pre-filled details (see `docs/plma-2026-launch-readiness.md`, section 8).
- Clicking the banner does not change anything in the CRM. Only a submitted form updates the Lead
  (Campaign status "Responded", enquiry saved, note added).
