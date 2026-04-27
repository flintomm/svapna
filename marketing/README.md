# Svapna — Marketing Assets

Brand assets for the Svapna course (dream yoga & lucid dreaming) — every file at the canvas Discourse expects, named so it can be uploaded directly. Editorial black-on-white, Cormorant Garamond + JetBrains Mono, four-states (Mandukya) ring as the primary mark.

```
marketing/
├── README.md                      (this file)
├── _render.py                     (Pillow + fontTools renderer — single pass)
│
├── discourse/                     ★ canonical, upload-ready ★
│   ├── logo.svg                   1200 × 300   transparent
│   ├── logo-small.svg              200 × 200   transparent, mark only
│   ├── logo-mobile.svg             800 × 200   transparent
│   ├── favicon.svg                  64 ×  64   transparent
│   ├── favicon.ico                                multi-size 16/32/48
│   ├── favicon-16.png               16 ×  16
│   ├── favicon-32.png               32 ×  32
│   ├── apple-touch-icon.png        180 × 180   paper-warm bg
│   ├── android-chrome-192.png      192 × 192   paper-warm bg
│   ├── email-logo.png              600 × 150   white bg
│   ├── og.jpg                     1200 × 630   q90, white bg
│   ├── twitter-card.jpg           1200 × 600   q90, white bg
│   ├── login-splash.jpg           1920 × 1080  q90, white bg
│   ├── svapna-colors.json                       Discourse color scheme import
│   └── category-banners/
│       ├── i-foundations.jpg                   1500 × 400 each
│       ├── ii-history.jpg
│       ├── iii-curriculum.jpg
│       ├── iv-community.jpg
│       ├── v-library.jpg
│       ├── vi-support.jpg
│       ├── vii-dream-sharing-circles.jpg
│       ├── viii-practice-partners.jpg
│       ├── ix-experiences.jpg
│       ├── x-lineage-and-teachers.jpg
│       ├── xi-meta.jpg
│       └── xii-off-topic.jpg
│
├── brand/
│   ├── 03-color-palette.md        palette tokens, accessibility, Tailwind/Discourse SCSS
│   └── IMAGE-BRIEF.md             pre-existing illustration brief
│
├── copy/
│   ├── 01-site-description.md     title, tagline, short/medium/long descriptions
│   ├── 02-welcome-topic.md        pinned welcome post for Discourse
│   └── 04-category-descriptions.md   12 forum categories — name, tagline, description
│
├── logos/                         (renderer working dir — same files as discourse/)
├── social/
└── email/
```

The `discourse/` folder is the source of truth — every file there is at the exact canvas, format, and filename Discourse expects. Drag-and-drop into Admin → Customize → Branding.

---

## Discourse upload table

| Setting | File |
|---|---|
| Logo | `discourse/logo.svg` |
| Logo Small | `discourse/logo-small.svg` |
| Mobile Logo | `discourse/logo-mobile.svg` |
| Favicon | `discourse/favicon.svg` |
| Apple Touch Icon | `discourse/apple-touch-icon.png` |
| Push Notifications Icon | `discourse/android-chrome-192.png` |
| OpenGraph Image | `discourse/og.jpg` |
| Twitter Summary Large Image | `discourse/twitter-card.jpg` |
| Email Digest Logo | `discourse/email-logo.png` |
| Login Required Splash (CSS background) | `discourse/login-splash.jpg` |
| Color Scheme Import | `discourse/svapna-colors.json` |
| Category Banners (custom theme component) | `discourse/category-banners/*.jpg` |

Categories: create the twelve in `copy/04-category-descriptions.md` in order. The leading Roman numerals are intentional — they place the categories in the editorial order without a custom sort plugin. Each banner filename matches its slug.

---

## Site repo (already wired)

Files copied to `/public/` and referenced from `index.html`:

- `/favicon.svg`, `/favicon-16.png`, `/favicon-32.png`, `/favicon.ico`
- `/apple-touch-icon.png`
- `/android-chrome-192.png`
- `/logo.svg`, `/logo-small.svg`, `/logo-mobile.svg`
- `/og.jpg` (`og:image`)
- `/twitter-card.jpg` (`twitter:image`)

The previous Vite favicon is preserved at `/public/favicon-OLD-vite.svg.bak` — delete once you're satisfied.

---

## Re-rendering

Geometry, type sizes, and proportions live in `_render.py`. Single command rebuilds every asset and re-installs canonical filenames into `discourse/` and `/public/`:

```bash
cd marketing
python3 _render.py
```

Dependencies:
- `pillow` — raster compositing
- `fonttools` + `brotli` — TTF parsing, woff2 decompression, text-to-SVG-path conversion
- TTFs at `~/.fonts/` — installed via `npm install @fontsource/cormorant-garamond @fontsource/jetbrains-mono` and converted woff2→ttf in the script

SVG outputs are self-contained (text converted to `<path>`), so they render identically across browsers and Discourse's CDN regardless of what fonts the host page has loaded.

---

## Brand specs in one place

| Element | Value |
|---|---|
| Display type | Cormorant Garamond, regular for headlines, italic for emphasis |
| UI / metadata type | JetBrains Mono, regular, tracked +0.18em |
| Logomark | Mandukya four-states rings — *jāgrat* (outer hairline) / *svapna* (second ring, emphasized 2.4× stroke) / *suṣupti* (inner hairline) / *turīya* (filled center). Position dot at top of *svapna* ring. |
| Hairline weight | 0.5–1.5px on a 64-canvas favicon, scaled proportionally on bigger canvases |
| Corners | None. Square corners everywhere. |
| Palette | `#FFFFFF` paper · `#FAF8F4` paper-warm · `#000000` ink · `#0F0F12` ink-soft. No accent. |
| Editorial flourishes | Roman numerals (Vol. I, Iss. I, MMXXVI), interpunct separators ( · ), Sanskrit/Tibetan terms in their original forms with diacritics |
| Headline | "Awaken within / the dream." — italic on the second line |
| Tagline | "DREAM YOGA · LUCID DREAMING" |
