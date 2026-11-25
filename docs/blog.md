# SesameERP blog (`/blog`)

Started November 20, 2026. One article at a time: research → draft → owner review → publish.

## How it works

| Part | File |
| --- | --- |
| Article list and metadata (title, SEO title, description, keywords, dates, author, takeaways, FAQs, sources, related posts, CTA, status) | `content/blog/posts.ts` |
| Article body (Markdown: `##`/`###` headings, paragraphs, `-`/`1.` lists, `>` callouts, tables, `**bold**`, `[text](href)`; no raw HTML) | `content/blog/<slug>.md` |
| Renderer | `lib/blog/markdown.tsx` |
| Loader + build-time link check | `lib/blog/posts.server.ts` |
| Index `/blog` | `app/blog/page.tsx` |
| Article `/blog/<slug>` (+ share image) | `app/blog/[slug]/page.tsx`, `app/blog/[slug]/opengraph-image.tsx` |

- **No new npm packages.** Markdown instead of MDX, so nothing has to be installed. Switching to MDX later is possible.
- Only posts with `status: "published"` are built, listed and added to the sitemap. Drafts are visible only under `npm run dev` (yellow "Draft" label, `noindex`) so the team can review them; a production build never contains them, and other slugs return 404.
- The homepage "New article" band always shows the newest published article.
- Structured data on each article: `BlogPosting`, `BreadcrumbList`, and `FAQPage` only because the FAQs are visible on the page.
- **Build-time link check:** `next build` fails if a published post links to a page that is not public (hidden industry pages, Wireless ERP, the noindex terms page, drafts, unknown paths), uses a non-https external link, or lists an unpublished related post.
- The Markdown file is the approved copy (no separate `docs/content-*.md` copy for posts).

## Rules for every article

- One primary keyword per article; no two articles (or an article and a page) target the same primary keyword.
- Only verified facts, each linked in the Sources list. No invented statistics, customers, results, prices or timelines. Customer requirements quoted as examples are labelled as such.
- Brand rules: never "free"; exact offer wording if the PLMA offer is mentioned; "not affiliated with PLMA" wherever PLMA is the subject.
- Links: pillar page within the first paragraphs; 2–3 related published articles when they exist; one CTA (`/contact` by default; `/chicago-event` only after its post-event offer copy is confirmed). Descriptive link text, never "click here".

## Link map

| From | To | Link text |
| --- | --- | --- |
| /blog/erp-for-private-label-manufacturers-checklist | /plma-2026 | PLMA 2026 guide for private label manufacturers |
| /blog/erp-for-private-label-manufacturers-checklist | /contact | Schedule a consultation (in text and CTA box) |
| /plma-2026 (ERP guide section) | /blog/erp-for-private-label-manufacturers-checklist | ERP for private label manufacturers: a practical requirements checklist |
| / (blog band) | /blog/erp-for-private-label-manufacturers-checklist | ERP for private label manufacturers: a practical requirements checklist |
| / (blog band) | /blog | SesameERP blog |
| Footer (all pages) | /blog | Blog |
| /blog | each published article | article title |
| /blog/erp-for-co-packers-contract-manufacturers | /blog/erp-for-private-label-manufacturers-checklist | ERP checklist for private label manufacturers (in text + Related articles) |
| /blog/erp-for-co-packers-contract-manufacturers | /plma-2026 | PLMA 2026 guide for private label manufacturers |
| /blog/erp-for-co-packers-contract-manufacturers | /contact | talk to us about your ERP requirements (in text) + CTA box "Discuss your ERP requirements" |
| /blog/erp-for-private-label-manufacturers-checklist | /blog/erp-for-co-packers-contract-manufacturers | Related articles block (added when article 2 was set to published) |
| /blog/packaged-erp-vs-custom-erp | /blog/erp-for-private-label-manufacturers-checklist | ERP checklist for private label manufacturers (in text + Related articles) |
| /blog/packaged-erp-vs-custom-erp | /blog/erp-for-co-packers-contract-manufacturers | ERP for co-packers (in text + Related articles) |
| /blog/packaged-erp-vs-custom-erp | /contact | schedule a consultation (in text) + CTA box "Schedule a consultation" |
| /blog/erp-for-private-label-manufacturers-checklist | /blog/packaged-erp-vs-custom-erp | Related articles block (Nov 25, 2026). An in-text link from the "Packaged ERP or custom ERP modules?" section needs owner approval (approved copy) |
| /blog/customer-owned-inventory-tracking | /blog/erp-for-co-packers-contract-manufacturers | ERP for co-packers and contract manufacturers (in text + Related articles) |
| /blog/customer-owned-inventory-tracking | /blog/packaged-erp-vs-custom-erp | packaged ERP vs custom ERP modules (in text + Related articles) |
| /blog/customer-owned-inventory-tracking | /contact | talk to us about your ERP requirements (in text) + CTA box "Discuss your ERP requirements" |
| /blog/erp-for-co-packers-contract-manufacturers | /blog/customer-owned-inventory-tracking | Related articles block (Nov 25, 2026) |
| / (blog band) | newest published article | article title (automatic; article 4 from Nov 25, 2026) |

## Articles

| # | Slug | Primary keyword | Status |
| --- | --- | --- | --- |
| 1 | erp-for-private-label-manufacturers-checklist | erp for private label manufacturers | Approved by owner; status published (goes live with the next deploy) |
| 2 | erp-for-co-packers-contract-manufacturers | erp for co-packers | Approved with 4 corrections (Nov 20, 2026), corrections made; status published (goes live with the next deploy, together with article 1) |
| 3 | packaged-erp-vs-custom-erp | packaged erp vs custom erp (secondary: best erp for private label manufacturers) | Published Nov 25, 2026 at the marketing lead's request (goes live with the next deploy). Draft from the SEO audit doc, expanded. See notes below |
| 4 | customer-owned-inventory-tracking | customer owned inventory tracking | Published Nov 25, 2026 at the marketing lead's request (goes live with the next deploy). Written from the approved outline. See notes below |
| 5 | (what is a custom ERP) | what is a custom erp system | Planned |
| 6 | (cost and timeline) | how much does custom erp cost | Planned; needs approved figures |
| 7 | (spreadsheets to ERP) | replace spreadsheets with erp | Planned |
| 8 | (private vs white label) | private label vs white label | Planned |

Titles 5–20 follow the "SEO Blog titles" tab of the SEO sheet (Nov 24, 2026), which replaces the earlier list here.

### Articles 3 and 4 notes (November 25, 2026)

- Article 3 states no statistics, prices or timelines, so it has no Sources block (the block is hidden when `sources` is empty). The draft sentence "works alongside the packaged software you already use" was NOT published because the integration claim is unconfirmed; the closing uses the approved line "custom ERP systems with AI agents built in". The worked example is labelled as illustrative, not a real customer.
- Article 3 does not link to a custom ERP development page (not built). Add the link when that page exists.
- Article 4 reuses one fact already verified for article 2 (7-Eleven Proprietary Product Suppliers Addendum: records documenting the use of co-packers). No accounting claims: treatment is left to the customer agreement and the accountant (same owner correction as article 2).
- Owner review still recommended for both: the AI agents definition in article 3, and the toll/consigned wording in article 4.

### Article 1 sources (checked November 20, 2026)

- 7-Eleven Vendor/Supplier Guidelines, last updated June 1, 2026: lot/batch identification system; lot codes on the smallest pack size; accurate formula and ingredient information; records of formula changes.
- The Hershey Company, Supplier Quality Expectations Manual, August 11, 2025: lot tracking from receipt through usage; Certificates of Analysis for incoming materials; changes approved before implementation.
- FDA, FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods (page modified Nov 4, 2026): Food Traceability List; KDEs/CTEs; traceability plan; electronic sortable spreadsheet within 24 hours of a request; Congress directed FDA not to enforce before July 20, 2028. The page still also mentions the original January 20, 2026 date; the article only states the enforcement date.

### Article 2 sources (checked November 20, 2026)

- 7-Eleven Vendor/Supplier Guidelines (official page), Proprietary Product Suppliers Addendum, which covers suppliers of 7-Eleven's own-brand (proprietary) products: suppliers must retain records documenting the use of co-packers or third-party manufacturers, and maintain current lists of material or ingredient suppliers.
- FDA Food Traceability Rule page: applies to businesses that manufacture, process, pack or hold foods on the Food Traceability List, unless exempt (it does not cover every co-packer); not enforced before July 20, 2028.
- Owner corrections (Nov 20, 2026): FSMA 204 scope clarified; no blanket accounting claim about customer-owned materials (ownership tracking + accounting per agreements and accountant's advice); 7-Eleven requirement scope stated; the link to article 1 is valid only because article 1 is published in the same build (the build check enforces this).
- Competitor pages read for differentiation only (not cited): Datacor contract manufacturing, ShiftERP, DOSS "Best 8 ERP for brands with contract manufacturers" (Aug 21, 2026). None covers customer-owned stock handling, quote-versus-actual costing per run or a neutral vendor checklist; article 2 focuses there.

## Publishing checklist (per article)

1. Owner approves the copy, facts and sources. To publish a draft: set `status: "published"`, set `published`/`updated` to the publishing date, and add the reverse "related" links listed in the link map.
2. `npm run lint`, `npx tsc --noEmit`, `npm run build` (includes the link check) and the tests pass.
3. Check the article on mobile and desktop, in light and dark theme.
4. Commit and deploy (owner).
5. Search Console: inspect the URL and request indexing; check the sitemap was read.
6. Review after 4 and 12 weeks: impressions, clicks, CTR, average position, CTA clicks, enquiries.
