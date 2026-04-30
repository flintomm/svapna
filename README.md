# Svapna

A free, donation-supported study of dream yoga and lucid dreaming.
*"Awaken within the dream."*

---

## Contents

- **`OUTLINE.md`** — full project outline (architecture, curriculum, community, support model, design notes, launch priorities)
- **`src/`** — Astro + React source. Static prerendered pages with small React islands for the contact form, lesson-progress checkboxes, and tradition filters
- **`reference-material/11_online/`** — the lesson markdown shipped with the build
- **`reference-material/_voice-rules.md`** — the editorial voice the site is written in; the rules every visible string is held to
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
3. Curriculum — twelve-week, six-phase structure
4. Community — forums, dream circles, practice partners, code of conduct
5. Library — primary sources, contemporary studies, papers
6. Support — *dāna*-rooted "buy a coffee" / "buy someone a coffee" model

---

## Voice

All user-facing copy on the site is written in a detached, declarative voice — describing the work, not addressing the reader. The welcome lesson at [`reference-material/11_online/00_welcome.md`](reference-material/11_online/00_welcome.md) is the canonical example to model new content on. The full rules — scope, the eight constraints, and the verification commands that sweep for violations — live at [`reference-material/_voice-rules.md`](reference-material/_voice-rules.md).

In short: no second-person, no first-person (including the editorial *we*), no use of "course", no negatives about the work itself, no bold claims about project behavior, no reader instruction. Direct quotations from primary sources stay verbatim.

Editorial sweeps over the lesson markdown and `src/content.js` should return nothing — or only false positives like translator initials, Roman-numeral citation references, and "course" used in non-website senses (the dream's *course* as trajectory).

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

The work, the history, the community — open to anyone. Freely given. The dream-yoga traditions were never sold; they were transmitted hand to hand, in exchange for whatever the student could offer, sometimes nothing. The arrangement holds.

*Received, and now given.*
