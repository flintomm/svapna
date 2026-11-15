# Svapna: Guided Reading Room

## Direction

Make Svapna a guided reading room: one obvious beginning, a trustworthy source-led curriculum, and a quiet, dependable reading interface.

Preserve the serif/monospace contrast, hairlines, whitespace, four-state diagram, and restrained editorial voice. Improve hierarchy and behavior rather than rebranding. Orient first, read second, continue third. Library and history stay reference layers; newsletter, future community, and donations remain supporting paths.

## Audit baseline

- `npm run build`: passes; 160 static pages.
- `npm run lint`: passes.
- Live site: `https://svapnaproject.org` via GitHub Pages with a Cloudflare Worker route for contact APIs.
- Dependency audit: 23 advisories (3 low, 6 moderate, 13 high, 1 critical); handle in a separate migration-reviewed milestone.
- Main product gaps: buried starting action, inaccessible mobile navigation, shared heading overflow at narrow widths, misleading community availability, missing social assets, weak progress semantics, and unfinished deployment/domain hardening.

## Keep

| Surface | Rule |
|---|---|
| Brand | Keep the monochrome editorial identity; no generic wellness redesign. |
| Homepage | Keep the headline, explanatory text, four-state diagram, and lower entry essays. |
| Content | Do not rewrite spiritual traditions or actionable claims in this visual milestone. |
| Architecture | Keep static Astro and the current route structure. |
| Data | Preserve current lesson content and progress keys. |

## Remove or change in Milestone 1

| Surface | Change |
|---|---|
| Homepage hierarchy | Put a primary orientation action and secondary curriculum action in the first viewport. |
| Shared section header | Remove narrow-screen overflow by collapsing or relocating the numbered gutter and using fluid heading sizing. |

## Milestone 1 — Make the beginning visible

### Scope

Touch only:

- `src/pages/index.astro`
- `src/components/SectionHeader.astro`

Do not change dependencies, navigation, Workers, course content, deployment, or production settings.

### Acceptance

- [ ] Homepage retains the existing headline, explanatory text, diagram, and editorial styling.
- [ ] A primary `Begin with the orientation` link to `/curriculum/welcome` and secondary `Browse the curriculum` link to `/curriculum` are visible without scrolling at 390×844 and 1440×900.
- [ ] Both links work by keyboard and pointer with a clearly visible focus state.
- [ ] Shared section headings fit `/curriculum` and `/community` at 320px and 390px without viewport expansion, clipping, or global overflow hiding.
- [ ] The orientation opens and its continuation into the curriculum remains intact.
- [ ] `npm run build` and `npm run lint` pass; build remains 160 pages.
- [ ] Only the two scoped source files change after this plan commit.
- [ ] Chromium screenshots exist outside tracked source for homepage phone/desktop, narrow curriculum/community, orientation destination, and focused primary action. Do not call emulation a physical iPhone test.

### Verification

```bash
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
git diff --check
git diff --stat
```

## Editorial and information-design contract

The main comprehension problem is structural, not merely sentence length. Every reading page should answer:

1. What is this page about?
2. What will I understand after reading it?
3. Where should I go next?

Use **summary → explanation → evidence → next step**. Name the claimant (`In Wallace's account…`, `This study found…`) and separate textual teaching, editorial interpretation, historical claim, and empirical finding. Introduce necessary terms locally without treating distinct traditions as interchangeable. Keep quotations exact and citations visible. Delete repeated framing before deleting nuance.

Present introductory cards as title + one-sentence purpose + small useful metadata + clear link. Use ordered lists for sequences, definition lists for term/meaning pairs, and tables only for genuine comparisons. Raw extraction counts, keyword hits, and internal identifiers are research metadata—not headline reader content.

Do not make substantive doctrinal, historical, medical, clinical, legal, privacy, or practice-safety rewrites without the appropriate subject-matter review.

## Milestone 2 — Restore semantic lesson structure

Repair the demonstrated renderer defect before rewriting prose.

Allowed files:

- `src/lib/markdown.js`
- `test/markdown.test.js`
- `package.json` (test script only)

Acceptance:

- [ ] `##` renders as `<h2>` and `###` renders as `<h3>` beneath the page-level `<h1>`.
- [ ] Ordinary numbered sequences render as semantic `<ol><li>` lists.
- [ ] Numbered sequences inside blockquotes remain distinct semantic list items inside the quotation.
- [ ] Van Eeden's nine categories remain nine items.
- [ ] MILD and WBTB five-step protocols remain five items.
- [ ] No literal `###` survives in rendered lesson HTML.
- [ ] Existing paragraphs, quotations, inline emphasis, citations, and permanent lesson links remain intact.
- [ ] Focused Node tests, lint, build, and `git diff --check` pass; static page count remains 160.

## Later milestones

1. Restructure the welcome page and truthfully explain 47 lessons plus the introduction, what the curriculum covers, and how to choose a starting point.
2. Pilot the editorial contract on one module, then one lesson; obtain subject-matter review for substantive claims before corpus-wide rollout.
3. Separate curated library/theme explanations from raw keyword matches; deduplicate source counts and make citations visually primary.
4. Replace the mobile menu; add skip navigation, focus restoration, reduced-motion behavior, and heading hierarchy checks.
5. Triage dependency advisories; upgrade deliberately; add Astro-aware, route, asset, and focused journey checks to CI.
6. Make community availability truthful; fix missing OG assets and `/start` breadcrumbs; add a resilient direct donation link.
7. Fix progress semantics around last position, local persistence failures, and completion/next navigation.
8. Harden contact/newsletter Worker routes, bounds, rate limits, timeouts, tests, and accessible form feedback.
9. With owner authorization, verify the GitHub custom domain and TLS/redirect posture, then document deployment and rollback.
10. Measure cold mobile performance, optimize fonts only where justified, and run final physical-phone plus desktop qualification.
