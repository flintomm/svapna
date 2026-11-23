# Svapna

A study of dream yoga and lucid dreaming — the practice of becoming aware within the dream state, and the lineage of teachers who passed it down.

---

## Contents

- **`src/`** — Astro + React source. Static prerendered pages with small React islands for the contact form, lesson-progress checkboxes, and tradition filters
- **`reference-material/11_online/`** — the lesson markdown shipped with the build
- **`reference-material/_voice-rules.md`** — the editorial voice the site is written in; the rules every visible string is held to
- **`README.md`** — this file

---

## Sections Built

1. Home — hero with the four-states (jāgrat / svapna / suṣupti / turīya) diagram from the Mandukya Upanishad
2. History — six-unit timeline grid
3. Curriculum — twelve-week, six-phase structure
4. Community — forums, dream circles, practice partners, code of conduct
5. Library — primary sources, contemporary studies, papers
6. Support — *dāna*-rooted "buy a coffee" / "buy someone a coffee" model

---

## Globe of Thought

`/globe-of-thought` is an atlas of what thinkers wrote about the self, linked from the home page as an annex. Its data, build tool and tests live in [flintomm/Globe-of-Thought](https://github.com/flintomm/Globe-of-Thought); this repository holds a themed copy.

- `scripts/sync-globe.mjs` brings a build across: `node scripts/sync-globe.mjs ../Globe-of-Thought/dist`. It copies the scripts and data to `public/globe-of-thought/`, writes the page body to `src/generated/globe-of-thought.html`, and generates `public/globe-of-thought/atlas.css` by scoping the atlas stylesheet to `.atlas` and turning its dark palette into black on white. None of those files is edited by hand.
- `public/globe-of-thought/theme.css` is hand-written: Svapna's type, hairlines and square markers, where a position on a scale is shown by how much of a square is filled.
- `src/pages/globe-of-thought.astro` wraps the body in the site layout and passes the globe's canvas colours to the atlas script.

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
