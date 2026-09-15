# Placeholders to replace before launch

Everything below is dummy data. Replace it when the real details arrive.

| Item | Current placeholder | Where to change it | What to supply |
| --- | --- | --- | --- |
| Company name | Supplied: `SesameERP` | `lib/site.ts` → `site.name` | Done |
| Logo | Designed here: three sesame seeds on a red tile | `components/brand/Logo.tsx` | Only if the owner commissions a different logo |
| Favicon | SesameERP mark | `app/icon.svg` | Only if the logo changes |
| "Schedule a consultation" link | Goes to `/contact` | `lib/site.ts` → `site.consultationHref` | Done, unless you would rather it opened a Calendly or WhatsApp link |
| Email | Supplied by the owner: `hi@sesamelabs.ai` | `lib/site.ts` → `site.email` | Done |
| Social links | LinkedIn, YouTube, Instagram, X, all `#` | `lib/site.ts` → `site.social` | Real profile URLs; remove any not used |
| Page title and description | Built from `site.name` and `site.description` | `lib/site.ts`, `app/layout.tsx` | Final SEO title and description |
| Hero quotation demo | Kaveri Engineering Works, Nila Textiles, sample items and prices | `components/sections/hero/QuotationStack.tsx` | Optional: real (anonymized) examples, or a real ERP screenshot |
| AI agent demos | Sample RFQ, stock chart, chat, invoice, weekly summary | `components/sections/agents/AgentDemos.tsx` | Optional: real screenshots or real anonymized examples |
| Price chain example | MS coil $0.68/kg, bracket, storage rack, 18% margin | `components/sections/manufacturing/PriceChain.tsx` | Optional: a real product chain from a client |
| **Contact form delivery (blocker)** | Code is finished (SMTP or Resend). Waiting on credentials in `.env.local` | `.env.local`, see `.env.example` | A Gmail app password (`SMTP_USER` + `SMTP_PASSWORD`), or a Resend API key. Testing goes to a personal inbox first, then `CONTACT_TO=hi@sesamelabs.ai` |
| Restaurant and Retail page copy | Draft written during design | `content/industries.ts`, `docs/content-industries.md` | Owner approval, or replacement wording |
| Industry demo documents | Supplier invoice INV-4471, reorder list for Store 2 | `content/industries.ts` | Optional: real anonymized examples |
| Solutions in the menu | Hidden on the owners instruction. The pages still work at their URLs | `lib/site.ts` → `showSolutions` | Set to `true` when the industry copy is approved |
| Phone and office address | Removed. Only the email is shown, per the owner | `lib/site.ts`, footer, contact page | Add back if a real number and address should appear |
| Copyright year | `2026` | `lib/site.ts` → `site.copyrightYear` | Update yearly |
| Open Graph image | None | add `app/opengraph-image.png` | 1200×630 share image |
| Brand name on Wireless ERP copy | Updated to SesameERP (the source copy said "Business Scales") | `content/wireless-erp.ts`, `lib/site.ts` | Confirm the sentence still reads correctly |
| Wireless ERP: Agent Allocation description | Draft sentence (supplied text was website-builder placeholder copy) | `content/wireless-erp.ts`, `docs/content-wireless-erp.md` | Real description of the Agent Allocation feature |
| Wireless ERP: packing list demo | Box BX-12, Galaxy A15 128 GB, six sample IMEIs | `components/wireless/DeviceBoxLabel.tsx` | Optional: real (anonymized) example or a screenshot of the app |
| Wireless ERP: allocation board demo | Main store, North/South zone supervisors, agents Ravi, Meena, Arjun, boxes BX-12/BX-13, sample CSV | `components/wireless/AllocationBoard.tsx` | Optional: real role names and a real import file layout |

## When real ERP screenshots arrive

Good places for them:

1. **Hero**: swap the coded quotation for a screenshot inside the same stacked-copy frame (keep the canary and carbon layers behind it).
2. **AI agents**: each demo sheet can show a real screenshot of that agent's output.
3. **Modules**: a screenshot per module group, shown beside the group heading.
