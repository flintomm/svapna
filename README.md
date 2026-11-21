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

`public/globe-of-thought/` is a self-contained static page served at `/globe-of-thought/`: an atlas of what thinkers wrote about the self. It is not part of the Astro build and has its own styles and scripts. The files are copied from the `dist/` folder of [flintomm/Globe-of-Thought](https://github.com/flintomm/Globe-of-Thought), where the data, build tool and tests live; edit it there and copy `dist/` across again. The copy here differs in three small ways that must be reapplied after copying: a canonical link and absolute asset paths (`/globe-of-thought/…`) in `index.html`, a link back to Svapna in its footer, and two footer rules at the end of `style.css`.

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
