# Svapna — Image Brief

A brief for whoever is generating illustrations for this project.

---

## What Svapna is

A free, donation-supported online course on **dream yoga and lucid dreaming**, drawing from the Mandukya Upanishad, Tibetan Buddhist tantra (Naropa's Six Yogas), Bön, Sufi *khayal*, indigenous dreamwork, and modern lab science (LaBerge, Tholey).

Tagline: *"Awaken within the dream."*
Spirit: *dāna* (generosity) — never sold, transmitted hand to hand.

This is not a productivity app, not "manifest your dreams," not crystals-and-clickbait spirituality. Treat the traditions with respect, not exoticism.

---

## Visual identity (non-negotiable)

The site is editorial-minimalist. Imagine an academic journal crossed with a contemplative monograph.

- **Pure white background** (`#FFFFFF`) — no off-whites, no gradients
- **Black** (`#000000`) for everything else — no greys unless absolutely necessary, never color
- **Hairline strokes**: 0.5px to 1.4px only. Never thicker than ~2px even on large pieces
- **No rounded corners. No drop shadows. No gradients. No fills** other than tiny solid black accent dots
- **No rasterized texture** — these need to look like vector line art, even if delivered as PNG
- **Generous whitespace** — subjects sit in space, not crowded to edges
- **Asymmetric, off-center compositions** are welcome
- **Roman numerals** and editorial flourishes (e.g. *Vol. I / Iss. I / MMXXVI*) fit the world

Typography on site is Cormorant Garamond (serif) + JetBrains Mono. Don't put text inside the images themselves — text will be set in the page around them.

**Existing reference**: the Svapna logomark is three concentric circles (jāgrat / svapna / suṣupti) with a solid dot at center for *turīya* and a small marker at the top of the svapna ring. That's the visual language. Anything generated should feel like it belongs in the same publication as that mark.

**What to avoid**: 3D renders, photorealism, watercolor textures, cosmic-purple-galaxy aesthetics, glowing third-eye chakra art, AI-default "spiritual" tropes (mandalas with fractal flourishes, lotuses dripping light, silhouettes meditating in front of giant moons). If it looks like a yoga-app splash screen, it's wrong.

---

## Shot list — at least 12 images

### A. History module — six unit headers
Each is a small editorial illustration that sits above a unit of the timeline. Roughly square or slightly tall, ~600×600 to 800×1000px feel. Each should be a single graphic motif, not a busy scene.

1. **Ancient Origins** — Mandukya four-states diagram redrawn in a fresh way (concentric circles + a dot at the dream ring). Could also be a stylized OM / AUM as four parts.
2. **Tibetan Dream Yoga** — a stupa silhouette in pure line, or Naropa's six-yoga wheel as six radial spokes meeting at a single point. Hairline only.
3. **Other Contemplative Traditions** — three small motifs side by side (one Sufi, one indigenous, one Daoist) connected by a single horizontal hairline. Restrained.
4. **Western Rediscovery** — a 19th-century instrument/diagram aesthetic. Maybe a dream-recording apparatus rendered as a technical line drawing, or an open notebook with hairline ruling.
5. **Modern Scientific Era** — a brain in profile, but rendered as a simple contour with one or two interior lines marking the prefrontal region; or an EEG waveform reduced to its essence.
6. **Convergence** — two arcs meeting, or two concentric circles overlapping in a Venn — minimal, almost diagrammatic.

### B. Curriculum — six phase markers
Smaller, simpler than the history pieces. Could be near-iconic — a single object or symbol per phase. Square, ~400×400px feel.

7. **Foundation** — a simple journal / open page with hairline rules
8. **Awareness** — an eye reduced to two arcs and a dot, or a hand pointing (the classic reality-check gesture)
9. **Induction** — a crescent moon resting on a horizon line, or a candle flame in pure outline
10. **Stabilization** — a horizon line with a small figure standing at center; or a plumb line
11. **Deepening** — water surface with a single ripple ring
12. **Integration** — a circle being completed (three-quarters drawn, with the closing arc as a dotted line)

### C. Hero / open-graph / social (bonus, if there's appetite)
13. **Hero illustration for landing page** — a more generous composition than the unit pieces. Still hairline, still black on white, but with room to breathe. Could reinterpret the four-states diagram at large scale, or show a single figure (back view, no facial features) standing at the edge of an indicated dream-space.
14. **Open Graph card (1200×630px)** — for social sharing. The wordmark "Svapna" in serif + the logomark + the tagline. Mostly empty space.
15. **Three social tiles (1080×1080px)** — single quote per tile in serif, set against a tiny accent illustration. (See `marketing/copy/` for quotes once it's populated, otherwise pull from `src/data/quotes.json`.)

---

## Technical specs

- **Format**: SVG strongly preferred. PNG at 2x density acceptable for anything raster-only.
- **Color mode**: RGB. Pure black `#000000` on pure white `#FFFFFF`. If a transparent background is delivered, ensure the strokes still read as `#000`.
- **Stroke widths**: hairline 0.5px, primary line 1.0–1.4px. No fills except tiny solid dots.
- **Naming**: `history-01-ancient-origins.svg`, `phase-01-foundation.svg`, `hero.svg`, `og-card.png`, etc.
- **Delivery folder**: drop everything into `marketing/brand/illustrations/` (create the folder).

---

## A note on the existing favicon

There's a purple-and-blue gradient favicon in `public/favicon.svg` that does **not** match the editorial system. It's a placeholder and should not be referenced as style direction. The black-on-white concentric-circle mark in `marketing/logos/svapna-mark.svg` is the real visual anchor.

---

## One-line creative direction (if your friend wants the gist in a sentence)

*"Hairline black-and-white editorial illustrations in the spirit of an old contemplative monograph — single subjects in white space, no shading, no color, no rounded corners, no spiritual clichés."*
