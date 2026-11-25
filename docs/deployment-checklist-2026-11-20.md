# Deployment checklist – blog launch (November 20, 2026)

INTERNAL. Prepared before the owner commits and deploys. Nothing below has been committed or deployed by Claude.

## What is already live (checked on www.sesameerp.ai, Nov 20, 2026)

Commit `5107143` "Complete PLMA enquiry workflow and SEO updates" (Nov 17) is pushed and live:

- SEO update: new titles/descriptions, H1 on /chicago-event, FAQPage + Organization JSON-LD, post-event wording, homepage PLMA band, footer links.
- PLMA form → Zoho: website emails removed; PLMA Latest Enquiry / Colleagues Added / Last Submission Key written; workflow trigger only on a genuinely new submission.
- Email logo `/images/brand/sesameerp-logo.png` returns 200 (the Zoho email templates use it).
- Live sitemap: 5 URLs (/, /plma-2026, /chicago-event, /about, /contact). `/blog` returns 404 (not deployed yet).

## What this deploy adds (uncommitted in the local folder)

New: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/blog/[slug]/opengraph-image.tsx`, `content/blog/posts.ts`, `content/blog/erp-for-private-label-manufacturers-checklist.md`, `content/blog/erp-for-co-packers-contract-manufacturers.md`, `lib/blog/markdown.tsx`, `lib/blog/posts.server.ts`, `components/sections/BlogBand.tsx`, `docs/blog.md`, `tests/blog/blog.e2e.cjs`, this checklist.

Modified: `CLAUDE.md`, `app/page.tsx` (blog band), `app/plma-2026/page.tsx` + `content/plma-2026.ts` + `docs/content-plma-2026.md` (link to Blog #1), `app/sitemap.ts` (blog URLs), `components/layout/SiteFooter.tsx` ("Blog"), `content/home.ts` + `docs/content-homepage.md` (blog band copy).

## Checks run on the local production build (Nov 20, 2026)

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run build` (includes the blog link check) | Pass; 2 articles + 2 share images prerendered |
| Blog tests `node tests/blog/blog.e2e.cjs` | 22/22 pass |
| PLMA tests `node tests/plma/phase2.e2e.cjs` | 114/114 pass |
| Route crawl (13 routes) | All 200; one H1 each; all JSON-LD parses |
| Canonical URLs | Correct on /plma-2026, /chicago-event, /about, /contact, /blog, both articles. **Homepage has none** (see issue 5) |
| Internal links (all unique targets on all pages) | All 200; no links to hidden pages except the noindex terms page (intended, from the offer form) |
| Sitemap | 8 URLs (5 existing + /blog + 2 articles), all 200 and indexable, articles with lastmod |
| robots.txt | Allows all, disallows /api/, points to the sitemap |
| Zoho (live CRM) | Workflow "PLMA 2026 New enquiry - TEST ONLY" **inactive**; internal email → rattan@businessscales.com; 1,227 genuine PLMA Leads, 15 Submitted (unchanged); only the test Lead has a submission key |

## Remaining issues

| # | Issue | Severity | Blocks this deploy? | Suggested action |
| --- | --- | --- | --- | --- |
| 1 | `/contact` sends email only if SMTP or Resend credentials are set in Vercel; otherwise the visitor sees an error and the enquiry is only logged. Both blogs send readers to `/contact`. (CLAUDE.md still says the form is not wired to email.) | **High** | No, but fix before promoting the blogs | Check Vercel env vars (`SMTP_USER`/`SMTP_PASSWORD` or `RESEND_API_KEY`, `CONTACT_TO`) and send one test enquiry on the live site |
| 2 | PLMA form enquiries currently trigger **no email to anyone**: website emails were removed (live since Nov 17) and the Zoho workflow is off. | **High** | No | Until go-live, check the Zoho view "PLMA – Submitted" daily. Go-live needs: Rattan's verification code, sender change, test, then activate without the test criterion (approval required) |
| 3 | `/chicago-event` publicly shows "Full legal terms and conditions are pending business approval." The terms page is noindex; the approval checklist (`docs/plma-2026-terms-approval-checklist.md`, 10 items incl. legal review and a privacy policy) has been open since Nov 4. | Medium (legal/business) | No | Business/legal sign-off, then follow "When ready to publish" in that checklist |
| 4 | Site header button says "Get a free consultation" on every page, including the blogs (existing copy). The brand rule forbids "free" for the offer; it is not the offer, but it is visible. | Low–medium | No | Owner decision: keep, or change to "Schedule a consultation" |
| 5 | Homepage has no `<link rel="canonical">`; /about and /contact have no og:url. | Low | No | Add `alternates.canonical` to the homepage metadata (one line) |
| 6 | Hidden pages (/manufacturing, /restaurant, /retail, /wireless-erp) are reachable and indexable (no noindex, no canonical), though not linked or in the sitemap. | Low | No | Leave until the /manufacturing decision; add canonical + metadata when unhiding |
| 7 | Zoho sender is still admin@sesamelabs.ai (rattan@businessscales.com awaits verification code; DNS SPF/DKIM to be confirmed by a test). | Medium | No | See Zoho steps |
| 8 | `Claude outputs/` (3 screenshots) is tracked in git; 3 empty `.git/stale-index-lock-claude-*` files exist locally. | Low | No | Optional cleanup (delete both) |
| 9 | `.env.local` still has `PLMA_NOTIFY_TO`, `PLMA_CUSTOMER_EMAIL`, `PLMA_EMAIL_TEST_LEADS_ONLY` (unused). Check Vercel for the same. | Low | No | Remove |
| 10 | Blog #2 links to Blog #1; both must go live in the same deploy (they will: both are `published`). The build fails if either is unpublished while linked. | Info | No | Deploy both together |

## Deploy steps (owner)

1. Review the two articles locally (`npm run dev` → /blog).
2. `git add` the files listed above (do not add `data/`), commit, push, and let Vercel deploy.
3. After the deploy, open: https://www.sesameerp.ai/blog, both article URLs, https://www.sesameerp.ai/sitemap.xml (8 URLs), and one article's share image (`/opengraph-image`).
4. Run `BASE=https://www.sesameerp.ai node tests/blog/blog.e2e.cjs` to check the live site (expects 22/22).
5. Search Console: resubmit the sitemap and request indexing (see the guide given in chat, Nov 20, 2026).

## Update Nov 24, 2026: SEO/technical audit fixes (uncommitted, ship with the blog deploy)

Full audit, competitor and keyword analysis, page proposals and Blog #3 draft are in the Claude Doc "SesameERP SEO audit" (Technical audit tab). Fixed locally:

- `/about`, `/contact`: own og:url, social title and description (`app/about/page.tsx`, `app/contact/page.tsx`). Closes issue 5 (the homepage canonical was already present).
- Hidden pages `/manufacturing`, `/restaurant`, `/retail`, `/wireless-erp`: canonical + `noindex, follow` while `showSolutions` is false (`lib/site.ts` `hiddenPageRobots`). Closes issue 6.
- Security headers on every response: X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy (`next.config.ts`).
- Homepage FAQ answers always in the HTML (collapsed when closed, `inert`) + FAQPage JSON-LD (`components/sections/Faq.tsx`, `app/page.tsx`).
- H1 text spacing for search engines (`components/ui/LetterTitle.tsx`, `components/sections/hero/HeroHeadline.tsx`); no visual change.
- `/chicago-event` form heading H3 → H2 (`components/chicago-event/ZohoLeadForm.tsx`); `/about` "3 pending" label contrast (`components/sections/About.tsx`).

Checks after the fixes (Nov 24): lint, `tsc --noEmit`, `npm run build` pass; blog tests 22/22; PLMA tests 114/114.
