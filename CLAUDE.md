@AGENTS.md

# Custom ERP website

Marketing site for a company that builds custom ERP systems with AI agents built in, delivering a working system in a few weeks. Audience: owners and operations heads of manufacturing, distribution, retail, and service businesses (prices shown in USD). Every page's job is getting the visitor to schedule a consultation.

## Scope right now

| Route | Status | Copy reference | Rendered copy |
| --- | --- | --- | --- |
| `/` | Built | `docs/content-homepage.md` | `content/home.ts` |
| `/manufacturing`, `/restaurant`, `/retail` | Built, HIDDEN from navigation (`showSolutions`). Restaurant and Retail copy is DRAFT | `docs/content-industries.md` | `content/industries.ts` |
| `/wireless-erp` | Built, HIDDEN from navigation (`showSolutions`) | `docs/content-wireless-erp.md` | `content/wireless-erp.ts` |
| `/contact` | Built. The form is NOT wired to email yet | `docs/content-contact.md` | `content/contact.ts` |
| `/chicago-event` | Built. PLMA 2026 campaign (complimentary development of one ERP module, US$5,000 value; say "complimentary", never "free"; URLs on www.sesameerp.ai), not in navigation. Header CTA, two section links and footer tagline/attribution are swapped on this route via `lib/campaign.ts`. Custom registration form (`ZohoLeadForm`): personal links (`?booth=&ref=`) pre-fill via `/api/plma/attendee`; submissions go to `/api/plma/enquiry` (updates the attendee's Zoho Lead; server-side credentials in `.env.local` / Vercel), falling back to the Zoho webform when Zoho API variables are not set. Launch notes: `docs/plma-2026-launch-readiness.md`, email banner: `docs/plma-2026-email-banner.md` | `docs/content-chicago-event.md` | `content/chicago-event.ts` |
| `/plma-2026-terms` | Built. PLMA 2026 Promotion Terms (18 sections + FAQ), print view and PDF snapshot in `public/legal/`. `noindex` until `termsStatus.indexable` is true. Clickwrap checkbox in `ZohoLeadForm`. Launch checklist: `docs/plma-2026-terms-approval-checklist.md` | `docs/content-plma-2026-terms.md` | `content/plma-2026-terms.ts` |

- Do not add routes or pages until the owner asks.
- Copy is approved. Keep each docs file and its `content/*.ts` file in sync, and do not reword approved copy. Open copy questions are listed at the top of each content doc.
- Brand name, logo, contact details, booking link and all demo figures are placeholders, listed in `docs/placeholders.md`.
- Design decisions, both theme palettes and the motion maps are in `docs/design-system.md`. Read it before changing any visual.

## Stack

| Package | Version | Notes |
| --- | --- | --- |
| next | 16.3 | App Router. Read `node_modules/next/dist/docs/` before using a Next API (see AGENTS.md). |
| react | 19.2 | Context is rendered as `<Context value>`. |
| tailwindcss | 4 | CSS-first config in `app/globals.css` (`@theme static`, `@custom-variant dark`). No tailwind.config file. |
| motion | 13 | Import from `motion/react`. |
| lenis | 1.3 | Root smooth scroll via `ReactLenis` from `lenis/react`. |
| lucide-react | 1.x | Icons. Brand/social icons were removed in 1.0, so social links are text. |

## Commands

```bash
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## File map

```
app/
  layout.tsx            fonts, metadata, theme init script, <Providers>, SiteHeader + SiteFooter (shared by all pages)
  page.tsx              homepage: 10 sections
  wireless-erp/page.tsx Wireless ERP solution page
  manufacturing|restaurant|retail/  industry pages, 6 lines each, one shared layout
  contact/              page.tsx, actions.ts (server action), state.ts
  globals.css           tokens (light + dark), base styles, helper classes, reduced-motion rules
components/
  providers/Providers.tsx   MotionConfig + Lenis + lamplight + theme re-apply
  providers/ThemeScript.tsx inline theme script for <head> (no flash, no React script warning)
  layout/               SiteHeader, SiteFooter, SolutionsMenu (desktop dropdown), SectionLink
  ui/                   ButtonLink, ThemeToggle, PaperStack, LetterTitle, ScrollRevealText, AnimatedNumber, Skeleton
  brand/Logo.tsx        SesameERP mark (sesame seeds on a red tile) + wordmark; favicon is app/icon.svg
  contact/ContactForm.tsx   client form (useActionState), validation errors, honeypot
  industry/             IndustryPage (shared layout for every industry) + DocumentCard
  sections/             homepage sections (one file each) and their parts
  wireless/             Wireless ERP page sections: WirelessHero, DeviceBoxLabel, WirelessIntro, WirelessFeatures, AllocationBoard
content/                typed copy per page
hooks/                  useMediaQuery, useSequence (timed step animations)
lib/site.ts             brand, contact, services list, homepage nav links, header offset
lib/theme.ts            theme storage key, inline init script, apply/save helpers
lib/format.ts           INR formatting
docs/                   design system, approved content per page, placeholder checklist
```

## Adding a solution page (when asked)

1. Add the approved copy to `docs/content-<slug>.md` and `content/<slug>.ts`.
2. Add an entry to `solutions` in `lib/site.ts` (label, href, one-line description). The Solutions menu, mobile menu and footer pick it up automatically.
   For an industry, add it to `industries` in `content/industries.ts` and copy an existing `app/<slug>/page.tsx` — the shared `IndustryPage` does the rest.
3. Add an icon for the href in `components/layout/SolutionsMenu.tsx`.
4. Create `app/<slug>/page.tsx` with `metadata`, wrap sections in `<main id="main">`, and give the hero `id="top"` (the footer's "Back to top" link targets it).
5. Reuse `PaperStack`, `LetterTitle`, `ScrollRevealText` and `FinalCta`; give the page one signature visual grounded in its subject.

## Navigation rules

- Header and footer live in the root layout, so they must work on every route.
- Homepage section links go through `SectionLink`: on `/` it renders `<a href="#process">` so Lenis smooth-scrolls; on other routes it renders `<Link href="/#process">`.
- Solution pages are listed in `solutions` (`lib/site.ts`) and appear in the desktop Solutions dropdown, the mobile menu and the footer — but only while `showSolutions` is `true`. The owner asked for them to be hidden for now; the pages themselves still work at their URLs.
- `ButtonLink` renders a next/link for hrefs starting with `/` and a plain anchor for mailto, tel and #hash.
- Every "Schedule a consultation" button points at `site.consultationHref`, which is `/contact`.

## Theming

- Two themes, `light` and `dark`, set as `data-theme` on `<html>`.
- `themeInitScript` (`lib/theme.ts`) runs in `<head>` before paint: saved choice from `localStorage["theme"]`, otherwise the device setting. It is rendered by `components/providers/ThemeScript.tsx`, a client component that outputs `type="text/javascript"` on the server and `text/plain` on the client so React does not warn about script tags. `<html>` has `suppressHydrationWarning` for this.
- `Providers` re-applies the theme in `useLayoutEffect` because React Strict Mode's dev remount clears attributes on `<html>`.
- `ThemeToggle` switches with a View Transition that grows a circle from the button (instant with reduced motion or no browser support).
- Dark mode works by redefining the same color tokens. Rules:
  - Text on canary surfaces: `text-night` (never `text-ink`, which turns light in dark mode).
  - Filled ink chips and buttons: `bg-ink text-paper` (never `text-white`).
  - Dark bands (AI agents, footer): `bg-night text-white`.
  - Primary buttons: `bg-ballpoint text-on-ballpoint`.
  - Use the `dark:` variant only when a token cannot express it (e.g. stamps use `mix-blend-multiply dark:mix-blend-normal`).
- Dark theme is neutral graphite (not navy) with light effects: `Lamplight` (pointer light pool), a light spill on `body`, lit top edges on `.bg-sheet`, and glows added with `dark:shadow-[<offset copy>,0_0_80px_-30px_var(--color-canary)]`. When a surface already has an offset copy shadow, repeat that offset inside the `dark:shadow-[...]` value, because one `shadow-*` replaces the other.

## Design rules (short version)

- Concept is "carbon copy": the paper, pen and triplicate forms of traditional ERP, now filled in by AI agents.
- Color has meaning. `ballpoint` = the action red (buttons, focus, progress), with `ballpoint-deep` only for a button offset shadow and `ballpoint-ink` for red used as text or a thin stroke. `canary`/`highlight` = work an AI agent did or something being pointed at. `carbon` = third copy layer only. `ink` = text. `night` = dark bands.
- Type: `.font-wide` / `.heading-section` (Archivo at width 125) for headings, `.font-semiwide` (width 112) for titles and figures, IBM Plex Sans for body. Sentence case. No all-caps labels, no monospace, no single-word color accents in headings.
- Numbered markers only where content is a real sequence (homepage Process, Wireless ERP features flow).
- Depth comes from offset "copy" shadows (`shadow-[5px_5px_0_var(--color-canary)]`) on paper surfaces only, not soft grey drop shadows. Buttons are flat: one solid red, no shadow layer, darkening to `ballpoint-deep` on hover.

## Motion rules

- One orchestrated load moment per page (homepage: headline + quotation; Wireless ERP: title letters + packing list scan).
- Scroll-linked effects must encode something (week progress, ink taking over, pen strike, devices moving through the hierarchy). No blanket fade-up-on-scroll.
- Reduced motion: Lenis smooth wheel off, lamplight static, ticker stops, step sequences jump to the end, scroll transforms cancelled with `motion-reduce:transform-none!` / `motion-reduce:opacity-100!`, theme switch is instant.
- Never branch rendered markup on `useReducedMotion()`: it differs between server and client and causes hydration mismatches. Use it in effects or handlers, or use a `motion-reduce:` class.
- When the same `layoutId` component is rendered more than once on a page (e.g. `AllocationBoard` desktop + mobile copies), wrap each instance in its own `<LayoutGroup id>`.

## Code conventions

- Server components by default. Add `"use client"` only to files that need state, effects, motion hooks or `usePathname`.
- Lint runs eslint-plugin-react-hooks 7 (React Compiler rules): no synchronous setState inside effects (schedule it, or set state in event/motion-value callbacks), no reading `ref.current` during render, no impure calls (`Date.now`, `Math.random`) during render.
- Tailwind v4 `translate-*` utilities use the CSS `translate` property, so they combine with motion's `x`/`y` transforms on the same element.
- Programmatic smooth scroll: `useLenis()?.scrollTo(element, { offset: HEADER_OFFSET })`.
- Keep dynamic Tailwind class names as full literals (see the `colStart` map in `Process.tsx`) so Tailwind can detect them.
