# Svapna

A free, donation-supported course on dream yoga and lucid dreaming.
*"Awaken within the dream."*

---

## Contents

- **`OUTLINE.md`** — full project outline (architecture, curriculum, community, support model, design notes, launch priorities)
- **`src/`** — Astro + React source. Static prerendered pages with small React islands for the contact form, lesson-progress checkboxes, and tradition filters
- **`reference-material/11_online/`** — the lesson markdown shipped with the build
- **`README.md`** — this file

---

## Aesthetic

- White background, crisp lines, no rounded corners
- Cormorant Garamond (display serif) + JetBrains Mono (labels & metadata)
- 0.5px hairline borders throughout
- Asymmetric grid, generous whitespace
- Roman numerals, editorial flourishes (Vol. I / Iss. I / MMXXVI)
- Mobile-first responsive: hamburger menu, scaled typography, touch-friendly tap targets, single-column stacks under `md:`

---

## Sections Built

1. Home — hero with the four-states (jāgrat / svapna / suṣupti / turīya) diagram from the Mandukya Upanishad
2. History — six-unit timeline grid
3. Curriculum — twelve-week, six-phase course structure
4. Community — forums, dream circles, practice partners, code of conduct
5. Library — primary sources, contemporary studies, papers
6. Support — *dāna*-rooted "buy a coffee" / "buy someone a coffee" model

---

## Running locally

```bash
npm install
npm run dev      # astro dev — http://localhost:4321/
npm run build    # astro build — outputs to dist/
npm run preview  # astro preview — serves dist/
```

The build prerenders every URL — every section, lesson, history unit, glossary
term, article, and theme — to static HTML. Most pages ship zero JavaScript.
Pages with interactive bits (the contact form, the lesson "Mark complete"
button, the tradition filter chips on Library and History) hydrate React
islands on demand.

---

## Philosophy

The course, the history, the community — open to anyone. No tiers, no premium, no paywall, no scarcity. The dream-yoga traditions were never sold; they were transmitted hand to hand, in exchange for whatever the student could offer, sometimes nothing. We keep that arrangement.

*I received, and now I give.*
