# Design system: homepage

Source of truth for visual and motion decisions. Tokens are implemented in `app/globals.css`.

## Brief

- **Subject:** a studio that builds custom ERP systems with AI agents built in, delivered in about seven weeks.
- **Audience:** owners and operations heads at manufacturing, distribution, retail and service businesses in India.
- **Page's job:** get the visitor to schedule a consultation.
- **Owner's asks:** premium and fun, smooth scrolling, scroll effects, movement. Theme and colours were left to the designer, then revised by the owner: Netflix red buttons, one colour per button, and the normal system cursor (the custom cursor was removed).

## Concept: carbon copy

Before ERP software, businesses ran on triplicate forms: a white original, a yellow copy for stores, a pink copy for accounts, all filled in with a ballpoint pen and rubber-stamped. Purchase orders, quotations and indents still carry that vocabulary.

The site uses that material world. Records are paper sheets. AI agents are the new hand that fills them in, and their work is marked with a highlighter. The result is specific to ERP, light and tactile rather than another dark neon SaaS page.

## Palette

**Revision (owner feedback):** the accent used to be a ballpoint blue, and buttons carried a canary offset shadow. The owner asked for one colour per button in Netflix red, so the accent is now an action red and the ink went neutral. Blue is gone from the palette.

| Token | Hex | Rule |
| --- | --- | --- |
| `ink` | `#16171B` | Text and dark bands (AI agents, footer). A neutral near-black. |
| `ink-soft` | `#4D4F57` | Secondary text on paper and sheet (7:1 on paper). |
| `paper` | `#EFEFF0` | Page background. Neutral light grey, deliberately not cream. |
| `sheet` | `#FFFFFF` | Surfaces that represent a document or record. |
| `rule` | `#D9D9DD` | Hairlines, table rules, skeleton placeholders. |
| `ballpoint` | `#E50914` | The action red: buttons, focus ring, scroll progress, the "today" line, check marks. |
| `ballpoint-deep` | `#9B0610` | Only the offset copy shadow under a button, so a button stays one colour. |
| `ballpoint-ink` | `#C8000C` | Red as text or a thin stroke on paper (6:1 on sheet): step numbers, icons, stamps. |
| `on-ballpoint` | `#FFFFFF` | Text on a red button (4.8:1). |
| `canary` | `#FFD84D` | Highlighter: values an AI agent filled in, highlighted modules, the final CTA block. Never a text colour on light surfaces. |
| `carbon` | `#F6B8C4` | Third copy layer only (paper stacks). Decorative; it never carries information. |
| `night` | `#16171B` | Dark bands, and the text colour on canary surfaces in both themes. |
| `night-rule` | `#33353D` | Rules on dark bands. |
| `night-soft` | `#B0B2BA` | Secondary text on dark bands (8.5:1). |

## Logo

SesameERP: three sesame seeds on a red tile, stacked at an offset so they double as the three copies of a carbon form. Drawn in `components/brand/Logo.tsx`, and in `app/icon.svg` for the browser tab. The tile is the action red with white seeds in both themes; only the wordmark changes colour.

## Type

| Role | Face | Setting |
| --- | --- | --- |
| Hero and section headings | Archivo (variable) | `wdth` 125, weight 800; hero second line weight 300. Class `.heading-section` / `.font-wide`. |
| Titles, figures, stamps | Archivo | `wdth` 112, weight 800. Class `.font-semiwide`. |
| Body and UI | IBM Plex Sans | 400 / 500 / 600, 17px base, line-height 1.6, measure under 65ch. |

- Numbers use `tabular-nums`. No monospace face.
- Sentence case throughout, including buttons. Module and agent names keep their product capitalization.
- Avoid: all-caps labels, a single accented word in a heading, `→` appended to buttons, middle-dot meta strings.

## Layout

12-column grid inside `.page-container` (max width 88rem, 20px/32px side padding). Content is left-aligned. Section spacing is `py-24` on mobile and `lg:py-36` on desktop.

```
HEADER   logo ........ How it works  AI agents  Modules  FAQ ...... [Schedule a consultation]
         ═══ ballpoint scroll-progress line ═══

HERO     (•) AI-powered custom ERP development
         CUSTOM ERP SYSTEMS,
         BUILT FAST.
         Powered by AI agents.                         (light weight, same size)
         ┌───────────────────────┐  ┌────────────────────────────┐
         │ subheadline           │  │ Quotation QT-2041   [agent]│▒  <- canary copy
         │ [Schedule] [See how]  │  │ customer / rule / lines    │▒░ <- carbon copy
         └───────────────────────┘  └────────────────────────────┘

TICKER   ◦◦◦ perforated strip, scrolling highlights ◦◦◦

WHY US   Heading with "the other way around" flipping upright
         ━━━━━━━━  ━━━━━━━━  ━━━━━━━━  ━━━━━━━━   four columns, ink top rules

PROCESS  (pinned)  Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Week 7
                   1 ▓                                                  <- Gantt bars
                        2 ▓
                             3 ▓▓▓▓▓▓▓
                                            4 ▓▓▓▓
                   ║ "today" line moves with scroll

AGENTS   (ink, expands from inset card to full bleed)
         tab list of 5 agents          │ live demo sheet with canary copy shadow

MODULES  heading ........................ [All modules | Manufacturing focus]
         Customers and vendors | Selling and pricing | Buying | Stock

MFG      text + four needs + button    │ price chain: slider → bracket → rack

WHY      What matters | A typical ERP project (struck out) | Working with us

FAQ      sticky heading                │ accordion

CTA      canary block, huge heading, magnetic red button

FOOTER   ink
```

## Signature element

The hero quotation stack. A white quotation sits on a yellow and a pink copy. On load, the AI Sales Assistant fills it in: customer, line items, totals, each value swept with a highlighter, finished with a red "Ready for your approval" stamp. The copies fan out slightly as the cursor moves. "Draft another quotation" replays it with a second customer.

Everything else stays quiet and structural so this lands.

## Motion map

| Where | Effect | Trigger | Why it is there |
| --- | --- | --- | --- |
| Whole page | Lenis smooth scroll | Wheel / anchor links | Owner requirement; premium feel |
| Header | Ballpoint scroll-progress line; header turns solid after 24px | Scroll | Orientation on a long page |
| Hero | Headline lines rise from masks, staggered | Page load | The one orchestrated load moment |
| Hero | Quotation filled step by step with highlighter sweeps, total counts up, stamp lands | Stack in view | Shows "AI agents built in" instead of saying it |
| Hero | Copies parallax with pointer position | Mouse | Physical depth of stacked paper |
| Buttons | Magnetic pull on primary CTAs; press into the offset copy on hover | Mouse | Tactile, on-concept |
| Ticker | Continuous marquee, pauses on hover | Always | Owner asked for movement; carries the four trust points |
| Why us | "the other way around" rotates from upside down to upright, word by word | Scroll | Literal, playful reading of the copy |
| Process | Section pins; a "today" line crosses a seven-week plan and fills each step's bar | Scroll | The content is a seven-week sequence |
| Agents | Ink section expands from an inset rounded card to full bleed | Scroll | Change of mode: the system starts working for you |
| Agents | Tabs auto-advance every 8s (pause on hover, stop on click); each agent has a live demo | In view / click | Five concrete agents shown doing real work |
| Modules | Filter pill slides; non-manufacturing modules dim; canary tags appear | Click | Section 7 filters rather than duplicates |
| Manufacturing | Slider recalculates the price chain; pulse travels down connectors; values flash | Drag | "Automated price update chain", made tangible |
| Differentiators | Pen line strikes through the "typical ERP project" answer | Scroll | Contrast, drawn like an edited form |
| FAQ | Height and plus-to-close rotation | Click | Motion answering an action |

## Motion tokens

- Standard ease: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-press`).
- UI transitions 200–350ms; reveals 600–950ms; springs for the stamp and the magnetic pull.
- Reduced motion: smooth wheel off, lamplight static, ticker static and wrapped, sequences show their end state, highlighter/flash/pulse animations off, scroll transforms cancelled (`motion-reduce:transform-none!`).

## Interaction states

- Primary button: action red with a deeper red offset copy, so the button reads as one colour; on hover it slides 3px into the copy. The same button is used on the canary CTA block.
- Secondary button: ink hairline border, sheet fill on hover.
- Focus: 2px action-red outline with 3px offset; canary on dark bands, near-black on canary blocks.
- Tabs, accordion, filter and slider are keyboard operable with proper ARIA roles.

## Dark theme

A moon/sun toggle sits in the header on every page. A first visit follows the device setting; after that, the visitor's choice is saved in `localStorage` under `theme`. An inline script in `app/layout.tsx` sets `data-theme` on `<html>` before first paint, so the page never flashes the wrong theme. Switching uses the View Transitions API: the new theme spreads as a circle from the toggle button. It is instant with reduced motion or in browsers without support.

Dark mode redefines the same tokens, so components rarely need `dark:` classes.

**Revision (owner feedback):** the first dark palette was navy and read as "dark blue". It is now a neutral graphite, a desk at night, lit by the lamplight effects below.

| Token | Light | Dark | Note |
| --- | --- | --- | --- |
| `paper` | `#EFEFF0` | `#0F1012` | Page background, neutral graphite |
| `sheet` | `#FFFFFF` | `#18191D` | Documents and cards |
| `rule` | `#D9D9DD` | `#2A2C33` | Hairlines |
| `ink` | `#16171B` | `#ECEDF1` | Text |
| `ink-soft` | `#4D4F57` | `#A5A8B4` | Secondary text (7.8:1 on paper, 7.3:1 on sheet) |
| `ballpoint` | `#E50914` | `#E50914` | The action red is identical in both themes; white text on it passes at 4.8:1 |
| `ballpoint-deep` | `#9B0610` | `#7D040C` | The offset shadow under a button |
| `ballpoint-ink` | `#C8000C` | `#FF6B72` | Lightened so red text and thin strokes read on graphite (5.9:1) |
| `highlight` | `#FFD84D` | canary at 36% | Highlighter that still lets light text read through |
| `carbon` | `#F6B8C4` | `#D98C9E` | Softened copy layer |
| `night` | `#16171B` | `#08090B` | Dark bands; darker than the page, with a faint top and bottom edge |
| `night-soft` | `#B0B2BA` | `#A5A8B4` | Secondary text on dark bands |
| `canary`, `on-ballpoint` | unchanged | unchanged | Canary blocks stay bright; button text stays white |

### Light effects (dark theme only)

| Effect | Where | How |
| --- | --- | --- |
| Lamplight | Whole page | `components/ui/Lamplight.tsx`: a 560px soft white pool at 6% follows the pointer (`screen` blend, above content, below header and cursor). Static near the top on touch devices and with reduced motion. |
| Light spill | Top of every page | Two very soft radial gradients on `body`: ballpoint blue from the upper right, canary from the upper left |
| Lit sheet edges | Every `bg-sheet` surface | 1px inset highlight on the top edge via `--tw-inset-shadow`, so it composes with ring and offset shadows |
| Canary glow | Paper stacks, agent demo sheets, allocation board, Services panel | Offset copy shadow plus a wide canary glow |
| Ballpoint glow | Primary buttons, Process "today" line, barcode scan line | Blue glow that grows on hover |

Keep lighting subtle: it should feel like light falling on paper, never neon.

Rules:

- Text on canary uses `text-night`, never `text-ink`.
- Filled ink chips and buttons use `bg-ink text-paper`, so they invert in dark mode.
- Dark bands use `bg-night text-white`.
- Stamps use `mix-blend-multiply dark:mix-blend-normal` (multiply would hide them on a dark sheet).

## Services menu

- Desktop: "Services" opens a panel on hover or click and closes on Escape, outside click or focus leaving. Each service row has a canary icon tile, the name and a one-line description. The panel carries the canary offset shadow like other documents.
- Mobile: services are listed at the top of the menu, above the homepage section links.
- The list comes from `services` in `lib/site.ts`.

## Wireless ERP page (`/wireless-erp`)

**Subject:** phones and tablets moving from a retailer to supervisors to agents in the field, either a whole box at a time or one IMEI at a time. The page makes that movement visible instead of listing it.

```
HERO      Home / Services / Wireless ERP
          WIRELESS               ┌ Packing list, Box BX-12 ─────────┐▒
          ERP                    │ Model | Storage | Quantity        │▒░
          summary                │ ||||||||||||| barcode + scan line │
          [Schedule] [See]       │ 1  35 693803 564380 9          ✓  │
                                 └───────────────────────────────────┘
INTRO     (white band) headline   │ body copy inks in word by word on scroll

FEATURES  Our features ........... Devices move from [Retailer] → [Supervisor] → [Agent]
          ┌ pinned allocation board ──────────────┐   │ 1 Inventory Import
          │ csv preview (step 1 only)              │   │ 2 Supervisor Allocation
          │ Retailer | Supervisors | Agents        │   │ 3 Inventory Allocation
          │ boxes and IMEI chips move between them │   │ 4 Agent Allocation
          └────────────────────────────────────────┘   rail fills as you scroll

CTA       shared canary CTA
```

**Signature element:** the allocation board. Box BX-12 and three IMEI chips physically travel from the retailer to supervisors and then to agents as each feature reaches the middle of the screen. One box goes whole, while the IMEIs split between agents, which shows the "entire box or individual IMEIs" choice the copy describes.

| Where | Effect | Trigger |
| --- | --- | --- |
| Hero title | Letters rise from a mask, one after another | Page load |
| Packing list | Scan line sweeps the barcode; IMEIs verify one by one with highlighter and ticks; "Checked in" stamp lands | In view |
| Packing list | Canary and carbon copies parallax with the cursor | Mouse |
| Intro | Body copy goes from faint to full ink word by word | Scroll |
| Features (desktop) | Board stays pinned; chips move between holders with shared-layout springs; status line updates; step 1 shows the imported CSV | Scroll |
| Features (desktop) | Progress rail fills; active feature at full opacity, others at 30%; step numbers fill in | Scroll |
| Features (mobile) | Each feature shows its own static board for that step | None |

## Decisions and revisions

- **Rejected: dark background with neon glow and gradient blobs.** That is the default "AI startup" look and matches the owner's other site, so it would not read as this company.
- **Rejected: bento grid of identical module cards.** Modules are grouped into four real business areas, and the manufacturing filter works on that structure.
- **Rejected: count-up stat tiles.** The four trust points are phrases, not metrics, so they run as a ticker on a perforated strip.
- **Kept numbered markers only in Process**, because order and duration carry information there.
- **Changed casing to sentence case** for headings and buttons. Wording is unchanged.
