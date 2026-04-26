# Svapna

A free, donation-supported course on dream yoga and lucid dreaming.
*"Awaken within the dream."*

---

## Contents

- **`OUTLINE.md`** — full project outline (architecture, curriculum, community, support model, design notes, launch priorities)
- **`dream-yoga-app.jsx`** — React component, the working bones of the site/app. Mobile-optimized, white background, hairline rules, no rounded edges, editorial-minimalist aesthetic
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

## Running the React Component

The `.jsx` file is a single self-contained React component. To run it locally you'll want a Vite + React + Tailwind setup:

```bash
npm create vite@latest svapna -- --template react
cd svapna
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then drop `dream-yoga-app.jsx` into `src/`, import it from `App.jsx`, and configure Tailwind's `content` paths.

---

## Philosophy

The course, the history, the community — open to anyone. No tiers, no premium, no paywall, no scarcity. The dream-yoga traditions were never sold; they were transmitted hand to hand, in exchange for whatever the student could offer, sometimes nothing. We keep that arrangement.

*I received, and now I give.*
