# Wireframes and responsive behaviour

The layout decisions behind every page, and the breakpoints they were tested
at. Written as text rather than images because a wireframe image goes stale the
moment someone changes a grid and nobody notices.

## Breakpoints

| Token | Width | Represents | Layout |
| --- | --- | --- | --- |
| — | 360px | Budget Android, the floor | Single column, stacked |
| — | 390px | iPhone 14/15, most common mobile | Single column, stacked |
| `md` | 768px | Tablet portrait, small laptop | Two columns where content allows |
| `lg` | 1024px | Tablet landscape, laptop | Sidebar layouts activate |
| `xl` | 1280px | Desktop | Max content width reached |
| — | 1440px+ | Large desktop, TV | Content capped at 80rem, centred |

Content is capped at `max-width: 80rem` (1280px) with `container-page`. Beyond
that the page gutters grow rather than the line length — a 1600px-wide
paragraph is unreadable, and TV browsers sit at 1920px.

All five widths are asserted in CI-adjacent tooling: `npm run audit:quality`
fails on any horizontal overflow at 360, 390, 768, 1024 or 1440.

## Home

```
┌─────────────────────────────────────────────┐
│ HEADER  logo · nav (lg+) · Start a project  │  sticky, blurs on scroll
├─────────────────────────────────────────────┤
│ HERO                                        │
│  availability pill · trust chips (sm+)      │
│  h1 (3 lines desktop / 5 mobile)            │
│  positioning paragraph                      │
│  [Start a project] [See 13 builds] [Msg]    │
│  ── metrics: 4 across (md) / 2×2 (mobile)   │
├─────────────────────────────────────────────┤
│ PROOF STRIP  scrolling live domains         │  marquee, paused for reduced motion
├─────────────────────────────────────────────┤
│ AUDIENCE SWITCHER                           │
│  [I'm not technical][I know the stack][…]   │  tabs, all panels in HTML
│  3 point cards: 3 across (md) / stacked     │
│  objection callout                          │
├─────────────────────────────────────────────┤
│ CRAFT → AI   2 columns (md) / stacked       │
├─────────────────────────────────────────────┤
│ SERVICES     3 across (lg) / 2 (md) / 1     │
├─────────────────────────────────────────────┤
│ WORK         3 featured case studies        │
├─────────────────────────────────────────────┤
│ PROCESS      sticky intro (lg) + timeline   │
├─────────────────────────────────────────────┤
│ EVIDENCE     verified signal cards          │
├─────────────────────────────────────────────┤
│ PRICING teaser                              │
├─────────────────────────────────────────────┤
│ PARTNER      2 featured Dharmarthlabs cards │
├─────────────────────────────────────────────┤
│ FAQ          6 questions + link to 50       │
├─────────────────────────────────────────────┤
│ CTA · FOOTER (4 columns lg / 2 md / 1)      │
└─────────────────────────────────────────────┘
        ┌──────────┐  fixed, bottom-right, safe-area aware
        │ 🤖 chat  │  chat launcher, above
        │ 💬 dock  │  contact dock, below
        └──────────┘
```

**Ordering rationale.** The funnel is: positioning (hero) → self-identification
(audience switcher) → credibility of method (craft→AI) → what is on offer
(services) → proof (work) → certainty (process) → evidence → self-qualification
(pricing) → escalation (partner) → objection handling (FAQ) → capture (CTA).
Someone who bounces at any point has still seen the claim and the proof.

## Case study detail

```
lg:  ┌───────────────────────┬──────────────┐
     │ problem / approach    │ VERIFIED     │  sticky sidebar
     │ / outcome             │ SIGNALS      │
     │                       │ stack        │
     └───────────────────────┴──────────────┘
<lg: sidebar drops below the narrative
```

The verified-signals panel is sticky on desktop deliberately: it is the
falsifiable part, and it should stay visible while the reader works through the
narrative claims.

## Contact

```
lg:  ┌───────────────────────┬──────────────┐
     │ 3-STEP FORM           │ faster routes│
     │ ① project type        │ booking      │
     │ ② budget + timeline   │ what happens │
     │ ③ details             │ privacy note │
     └───────────────────────┴──────────────┘
```

Three steps rather than one long form: each screen asks one question, which
raises completion on mobile. The progress bar is three segments, and step state
is announced to screen readers through a visually hidden live region.

## Contact dock and chat launcher

Two fixed controls, stacked, never overlapping:

```
                              ┌─────────────┐
                              │ chat panel  │  bottom: 9.5rem
                              └─────────────┘
                                    (48px) ● chat launcher   bottom: 5.5rem
                                    (56px) ● contact dock    bottom: 1rem
```

Both offset by `env(safe-area-inset-bottom)` so neither sits under an iPhone
home indicator. Both are fixed-size with absolutely positioned labels, so
expanding a label cannot resize the element — a resizing fixed element still
counts as layout shift in Core Web Vitals, and this is what keeps CLS at 0.000.

## Responsive rules applied throughout

**Grid items get `min-w-0`.** Grid and flex children default to
`min-width: auto`, so one long unbreakable string — a monospace URL, a code
line — sizes the whole track past the container. This caused two real overflows
at 360px and is now applied at the source.

**Scrollable regions are focusable.** Any `overflow-x: auto` container carries
`tabindex="0"` and a label, or a keyboard user cannot scroll it (WCAG 2.1.1).

**Reveal animates transform only, never opacity.** Fading from zero means part
of the page is genuinely invisible at any moment — unreadable if the observer
never fires, and reported by axe as a 1.01:1 contrast failure. Nothing is
hidden before hydration, and only below-fold elements are armed.

**Tap targets.** Standalone controls are ≥44px. Radio inputs are 20px but their
wrapping `<label>` is the actual target at 270×46, which is what WCAG 2.5.8
measures.

**Tables scroll, pages do not.** The services comparison table is `min-w-[46rem]`
inside an `overflow-x-auto` region rather than being allowed to widen the body.

## Verified

`npm run audit:quality` checks all of the above on a production build: link
integrity, metadata and document outline, axe-core WCAG 2.1 A/AA at 390px and
1440px, and horizontal overflow at all five breakpoints. It exits non-zero on
any failure.
