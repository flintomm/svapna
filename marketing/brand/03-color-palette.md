---
asset: Color palette decision
decision: Editorial black-on-white, with paper-cream as a quiet warm tier
applies_to: site, Discourse theme, marketing assets, email templates
---

# Color palette

The course is a contemplative, editorial-minimalist project. The palette reflects that: paper, ink, hairlines. There is no mystical-clickbait aesthetic and no productivity-app aesthetic. It is the palette of a well-made book.

The decision: **editorial black-on-white**, with a single warm paper tier (used sparingly on app icons and email backgrounds where pure white reads cold) and a near-black ink that lets us drop a hair away from `#000` when surfaces benefit from it.

We are intentionally not introducing a deep-indigo or warm-gold accent. The ∴ tridot mark and the Cormorant wordmark are the visual identity. Color would compete with them.

---

## Tokens

| Token | Hex | RGB | OKLCH | Usage |
|---|---|---|---|---|
| `paper` | `#FFFFFF` | 255 255 255 | oklch(100% 0 0) | Site background, logo backgrounds, OG cards. The default. |
| `paper-warm` | `#FAF8F4` | 250 248 244 | oklch(98% 0.005 85) | Apple touch icon, email backgrounds, splash secondary surfaces. Use only where pure white reads sterile. |
| `ink` | `#000000` | 0 0 0 | oklch(0% 0 0) | Logo strokes, type, hairlines. The default ink. |
| `ink-soft` | `#0F0F12` | 15 15 18 | oklch(15% 0.005 280) | Long-form body text on `paper-warm`; touch-icon ink. Reads as black at glance, easier on the eye in display contexts. |
| `rule` | `#000000` @ 100% | — | — | Hairlines are 0.5px solid `ink`. Never reduce opacity — keep them crisp. |
| `muted` | `#737373` | 115 115 115 | oklch(55% 0 0) | Secondary metadata in mono labels (date stamps, "VOL. I"). Sparingly. |
| `muted-faint` | `#A3A3A3` | 163 163 163 | oklch(70% 0 0) | Tertiary metadata only — the JetBrains Mono "Est. MMXXVI" eyebrow at small sizes. |

---

## Usage rules

1. **Backgrounds are paper.** `#FFFFFF` is the default. `paper-warm` only when a surface would otherwise read cold (touch icon on iOS Springboard, email body, login splash secondary panels).
2. **Strokes are ink.** All hairlines, all logo geometry, all dividers. 0.5px on retina, 1px on standard.
3. **No gradients. No shadows.** They fight the editorial plainness.
4. **No accents.** If a UI element needs to stand out, do it with weight (a 2px stroke against 0.5px hairlines, like the *svapna* ring), not color.
5. **Hover/active states use neutral grays only** — `bg-neutral-50` / `bg-neutral-100` per the existing site code. Never tinted.
6. **Inverse states** (mono buttons turning solid on hover) use `ink` background + `paper` text — already established in the site code at `hover:bg-black hover:text-white`.

---

## Accessibility

- Body text on `paper`: `ink` (#000) → contrast ratio 21:1. AAA.
- Body text on `paper-warm`: `ink-soft` (#0F0F12) → 19.2:1. AAA.
- `muted` (#737373) on `paper`: 4.7:1. AA for body, AAA for large text.
- `muted-faint` (#A3A3A3) on `paper`: 2.6:1. **Not AA-compliant for body text** — restrict to non-essential metadata at sizes ≥ 14px, or to AA-essential text via `muted` instead.

---

## CSS custom properties (drop-in)

```css
:root {
  --color-paper:        #FFFFFF;
  --color-paper-warm:   #FAF8F4;
  --color-ink:          #000000;
  --color-ink-soft:     #0F0F12;
  --color-muted:        #737373;
  --color-muted-faint:  #A3A3A3;

  --rule-width: 0.5px;
  --rule-color: var(--color-ink);
}

@media (-webkit-min-device-pixel-ratio: 1) and (max-resolution: 1dppx) {
  :root { --rule-width: 1px; }
}
```

## Tailwind theme extension

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      paper:      '#FFFFFF',
      'paper-warm': '#FAF8F4',
      ink:        '#000000',
      'ink-soft': '#0F0F12',
    },
  },
},
```

## Discourse theme variables

```scss
$primary:           #000000;
$secondary:         #FFFFFF;
$tertiary:          #000000;   // links — keep editorial
$quaternary:        #000000;
$header_background: #FFFFFF;
$header_primary:    #000000;
$highlight:         #FAF8F4;   // gentle paper-warm for selected rows
$danger:            #000000;   // even errors stay editorial; rely on type for emphasis
$success:           #000000;
$love:              #000000;
```
