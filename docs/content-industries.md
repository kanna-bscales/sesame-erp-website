# Industry solution pages

Routes: `/manufacturing`, `/restaurant`, `/retail`. All three render from `content/industries.ts` through one shared layout (`components/industry/IndustryPage.tsx`), so they stay consistent and a fourth industry is a data entry, not a new page build.

Listed in the Solutions menu alongside `/wireless-erp`.

## Approval status

| Page | Copy status |
| --- | --- |
| Manufacturing | **Approved source.** Summary and the four "what we tune" items come from the approved homepage content (section 7 and the module descriptions). Only the headings and the intro paragraph are new. |
| Restaurant | **DRAFT — needs your approval.** Written during design from the approved module list. No client names, numbers or results are claimed. |
| Retail | **DRAFT — needs your approval.** Same as above. |

Nothing on these pages claims a customer, a metric or an integration we have not confirmed. The demo documents (supplier invoice, reorder list) are illustrative, like the homepage demos.

## Page structure (same for each industry)

1. **Hero** — breadcrumb, page title, one-line summary, "Schedule a consultation" and "See the modules". Manufacturing shows the interactive price chain; Restaurant and Retail show a document filling itself in (supplier invoice, reorder list).
2. **Intro band** — headline plus a paragraph that inks in as you scroll.
3. **What we build for this industry** — four to six points.
4. **The modules this industry uses most** — names taken from the approved module library, with a link to the full list on the homepage.
5. **AI agents** — three of the five approved agents, described in that industry's language (dark band).
6. **Shared final CTA.**

## Adding another industry

Add an entry to `industries` in `content/industries.ts`, add it to `solutions` in `lib/site.ts`, add an icon in `components/layout/SolutionsMenu.tsx`, and create `app/<slug>/page.tsx` copying one of the existing three (six lines). No new components needed unless the industry deserves its own signature visual.

## Draft copy in use

### Restaurant

- **Summary:** Purchasing, stock and costs across your kitchens, from the supplier invoice to the plate.
- **Headline:** Built around your kitchen, not a generic stock system
- **Intro:** Restaurants lose margin in small places: a supplier price that moved last week, stock that was never counted, a dish that quietly costs more than it sells for. The system keeps all of it in one place, and the AI agents keep it current without anyone typing it in.
- **Points:** supplier prices that move weekly; stock across kitchen and store; recipes, combos and bundles; wastage and daily counts; transfers between outlets; vendors and purchase orders.
- **Demo document:** supplier invoice INV-4471 (tomatoes, chicken breast, olive oil) read by the AI Data Entry Agent.

### Retail

- **Summary:** Stock, purchasing and pricing across every store and channel, in one system.
- **Headline:** One stock position, however many stores you run
- **Intro:** Retail goes wrong between the stores: stock that exists in one branch and is missing in another, a reorder that was noticed too late, a price that changed everywhere except one shelf. The system holds one live stock position, and the AI agents watch it for you.
- **Points:** stock across every store; reorder before you run out; prices that update everywhere; kits and bundled products; customer orders and portal; counts and adjustments.
- **Demo document:** reorder list for Store 2 (water bottle, canvas tote, ceramic mug) prepared by the AI Inventory Forecaster.

### Manufacturing (new wording only)

- **Headline:** Every module your business needs, tuned for manufacturing
- **Intro:** Manufacturing businesses we work with get the full core system, tuned for the way material moves through the shop floor: raw material becomes a semi-finished part, the part becomes a finished good, and every price along that chain stays in step.
