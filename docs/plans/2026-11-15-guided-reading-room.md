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

## Later milestones

1. Replace the mobile menu; add skip navigation, focus restoration, reduced-motion behavior, and heading hierarchy checks.
2. Triage dependency advisories; upgrade deliberately; add Astro-aware, route, asset, and focused journey checks to CI.
3. Make community availability truthful; fix missing OG assets and `/start` breadcrumbs; add a resilient direct donation link.
4. Fix progress semantics around last position, local persistence failures, and completion/next navigation.
5. Harden contact/newsletter Worker routes, bounds, rate limits, timeouts, tests, and accessible form feedback.
6. Conduct qualified editorial review of actionable claims and citations; publish honest authorship/review policy and local safety context.
7. With owner authorization, verify the GitHub custom domain and TLS/redirect posture, then document deployment and rollback.
8. Measure cold mobile performance, optimize fonts only where justified, and run final physical-phone plus desktop qualification.
