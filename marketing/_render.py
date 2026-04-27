"""
Svapna marketing asset renderer — canonical output pass.

Produces all Discourse + site assets at the agreed canvases:

    SVGs (text converted to paths, fully self-contained, transparent background):
        logo.svg          1200 × 300    (Discourse `logo`, site)
        logo-small.svg     200 × 200    (Discourse `logo_small`, mobile)
        logo-mobile.svg    800 × 200    (Discourse `mobile_logo`)
        favicon.svg         64 ×  64    (Discourse `favicon`, site)

    Raster (PNG, full-bleed where iOS/Android adds chrome; white where email is rendered):
        apple-touch-icon.png        180 × 180   (paper-warm bg)
        android-chrome-192.png      192 × 192   (paper-warm bg)
        email-logo.png              600 × 150   (white bg)
        og.jpg                     1200 × 630   (JPG q90, white bg)
        twitter-card.jpg           1200 × 600   (JPG q90, white bg)
        login-splash.jpg           1920 × 1080  (JPG q90, white bg)
        category-banners/*.jpg     1500 × 400   (twelve banners, white bg)

    Discourse import:
        svapna-colors.json     ten-variable color scheme

Mark = Mandukya four-states concentric rings. Outer = jāgrat (waking), second
ring = svapna (dream, emphasized 2.4×), inner = suṣupti, center dot = turīya.
Position-marker dot at top of svapna ring.

All raster type is rendered through Pillow with the actual Cormorant Garamond
and JetBrains Mono TTFs at ~/.fonts/. SVG type is converted to <path> via
fontTools so the SVGs are self-contained and don't depend on the rendering
page having the fonts available.
"""

import json, math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path("/sessions/focused-zen-allen/mnt/svapna/marketing")
FONTS = Path("/sessions/focused-zen-allen/.fonts")

CORMORANT_REG    = str(FONTS / "CormorantGaramond-Regular.ttf")
CORMORANT_LIGHT  = str(FONTS / "CormorantGaramond-Light.ttf")
CORMORANT_ITALIC = str(FONTS / "CormorantGaramond-Italic.ttf")
JBM_REG          = str(FONTS / "JetBrainsMono-Regular.ttf")
JBM_MED          = str(FONTS / "JetBrainsMono-Medium.ttf")

INK        = "#000000"
WHITE_HEX  = "#FFFFFF"
PAPER_WARM = (250, 248, 244)
INK_RGB    = (0, 0, 0)
INK_SOFT   = (15, 15, 18)
WHITE_RGB  = (255, 255, 255)

# Cache loaded TTFonts so we don't reopen on every glyph
_FONT_CACHE = {}
def _ttfont(path):
    if path not in _FONT_CACHE:
        _FONT_CACHE[path] = TTFont(path)
    return _FONT_CACHE[path]


# ---------- text → SVG path ----------

def text_to_svg(text, font_path, size_px, x, y, fill=INK,
                tracking_em=0.0, weight_class=None):
    """
    Convert a string to an SVG <g> of <path> elements positioned with the
    text baseline at (x, y) and total visual height matching `size_px`.

    `tracking_em` is letter-spacing in em-units (0.18 for the JBM labels).
    Returns an SVG fragment string.
    """
    font = _ttfont(font_path)
    cmap = font.getBestCmap()
    glyph_set = font.getGlyphSet()
    units_per_em = font["head"].unitsPerEm
    scale = size_px / units_per_em
    tracking_units = tracking_em * units_per_em

    parts = [f'<g fill="{fill}" stroke="none">']
    pen_x_units = 0.0
    for ch in text:
        cp = ord(ch)
        if cp not in cmap:
            # try common fallbacks for diacritical marks not in latin subset
            continue
        glyph_name = cmap[cp]
        glyph = glyph_set[glyph_name]
        pen = SVGPathPen(glyph_set)
        glyph.draw(pen)
        d = pen.getCommands()
        if d:
            tx = x + pen_x_units * scale
            parts.append(
                f'<path d="{d}" transform="translate({tx:.3f} {y:.3f}) '
                f'scale({scale:.4f} {-scale:.4f})"/>'
            )
        # advance by glyph width + tracking
        pen_x_units += glyph.width + tracking_units
    parts.append("</g>")
    return "\n".join(parts)


def text_width_px(text, font_path, size_px, tracking_em=0.0):
    font = _ttfont(font_path)
    cmap = font.getBestCmap()
    glyph_set = font.getGlyphSet()
    units_per_em = font["head"].unitsPerEm
    scale = size_px / units_per_em
    tracking_units = tracking_em * units_per_em
    total = 0.0
    n = len(text)
    for i, ch in enumerate(text):
        cp = ord(ch)
        if cp not in cmap:
            continue
        glyph = glyph_set[cmap[cp]]
        total += glyph.width + (tracking_units if i < n - 1 else 0)
    return total * scale


# ---------- SVG geometry helpers ----------

def four_states_svg(cx, cy, R, *, jagrat_w=1, svapna_w=2, susupti_w=1,
                    dot_r=2.4, marker_r=1.6, color=INK):
    """Return SVG string for the four-states ring stack centered at (cx, cy)
    with outer radius R."""
    r_jag = R
    r_sva = R * 0.62
    r_sus = R * 0.32
    return (
        f'<g fill="none" stroke="{color}" stroke-linecap="round">'
        f'<circle cx="{cx}" cy="{cy}" r="{r_jag}" stroke-width="{jagrat_w}"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r_sva}" stroke-width="{svapna_w}"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r_sus}" stroke-width="{susupti_w}"/>'
        f'</g>'
        f'<circle cx="{cx}" cy="{cy - r_sva}" r="{marker_r}" fill="{color}"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{dot_r}" fill="{color}"/>'
    )


# ---------- Pillow geometry helpers ----------

def four_states_px(draw, cx, cy, R, *, jagrat_w=1, svapna_w=2, susupti_w=1,
                   dot_r=2.4, marker_r=1.6, color=INK_RGB):
    r_jag = R
    r_sva = R * 0.62
    r_sus = R * 0.32
    for r, w in [(r_jag, jagrat_w), (r_sva, svapna_w), (r_sus, susupti_w)]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=w)
    draw.ellipse([cx - marker_r, cy - r_sva - marker_r,
                  cx + marker_r, cy - r_sva + marker_r], fill=color)
    draw.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=color)


def f(path, size):
    return ImageFont.truetype(path, size=size)


def draw_tracked(draw, xy, txt, font, fill, tracking_px=0):
    x, y = xy
    if not tracking_px:
        draw.text((x, y), txt, font=font, fill=fill)
        return
    for ch in txt:
        draw.text((x, y), ch, font=font, fill=fill)
        bb = draw.textbbox((0, 0), ch, font=font)
        x += (bb[2] - bb[0]) + tracking_px


def text_w_px(draw, txt, font, tracking_px=0):
    if not tracking_px:
        bb = draw.textbbox((0, 0), txt, font=font)
        return bb[2] - bb[0]
    w = 0
    for ch in txt:
        bb = draw.textbbox((0, 0), ch, font=font)
        w += (bb[2] - bb[0]) + tracking_px
    return max(0, w - tracking_px)


def hairline_px(draw, x1, y1, x2, y2, w=1, fill=INK_RGB):
    draw.line([x1, y1, x2, y2], fill=fill, width=w)


# ---------- SVG output ----------

def svg_doc(width, height, body, *, with_bg=False):
    bg = f'<rect width="{width}" height="{height}" fill="white"/>' if with_bg else ""
    return (
        f'<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {width} {height}" '
        f'width="{width}" height="{height}" '
        f'role="img" aria-label="Svapna">\n'
        f'{bg}\n{body}\n</svg>\n'
    )


def write_text(path, content):
    Path(path).write_text(content, encoding="utf-8")


# ---------- ASSETS: SVGs ----------

def render_logo_svg():
    """1200×300, transparent — Discourse `logo`, site `public/logo.svg`."""
    W, H = 1200, 300
    parts = []

    # mark
    cx, cy, R = 150, 150, 100
    parts.append(four_states_svg(cx, cy, R,
                                 jagrat_w=1, svapna_w=2.8, susupti_w=1,
                                 dot_r=4.5, marker_r=3))

    # divider
    parts.append(f'<line x1="300" y1="50" x2="300" y2="250" '
                 f'stroke="{INK}" stroke-width="0.6"/>')

    # eyebrow
    parts.append(text_to_svg("VOL. I  ·  EST. MMXXVI",
                             JBM_REG, 14, x=340, y=78, tracking_em=0.18))

    # wordmark
    parts.append(text_to_svg("Svapna",
                             CORMORANT_REG, 124, x=336, y=200))

    # tagline
    parts.append(text_to_svg("DREAM YOGA  ·  LUCID DREAMING",
                             JBM_REG, 13, x=340, y=246, tracking_em=0.18))

    write_text(ROOT / "logos" / "logo.svg", svg_doc(W, H, "\n".join(parts)))


def render_logo_small_svg():
    """200×200, transparent, mark only — Discourse `logo_small`."""
    W = H = 200
    cx = cy = 100
    R = 84
    body = four_states_svg(cx, cy, R,
                           jagrat_w=1, svapna_w=2.4, susupti_w=1,
                           dot_r=4, marker_r=2.6)
    write_text(ROOT / "logos" / "logo-small.svg", svg_doc(W, H, body))


def render_logo_mobile_svg():
    """800×200, transparent — Discourse `mobile_logo`."""
    W, H = 800, 200
    parts = []
    cx, cy, R = 100, 100, 70
    parts.append(four_states_svg(cx, cy, R,
                                 jagrat_w=1, svapna_w=2.4, susupti_w=1,
                                 dot_r=3.4, marker_r=2.4))
    parts.append(f'<line x1="200" y1="40" x2="200" y2="160" '
                 f'stroke="{INK}" stroke-width="0.6"/>')
    # eyebrow
    parts.append(text_to_svg("VOL. I  ·  MMXXVI",
                             JBM_REG, 11, x=232, y=66, tracking_em=0.18))
    # wordmark
    parts.append(text_to_svg("Svapna",
                             CORMORANT_REG, 84, x=228, y=140))
    write_text(ROOT / "logos" / "logo-mobile.svg", svg_doc(W, H, "\n".join(parts)))


def render_favicon_svg():
    """64×64, transparent — Discourse `favicon`, site `public/favicon.svg`.
    Strokes proportional to the 64-unit canvas. Inner suṣupti ring kept.
    """
    W = H = 64
    cx = cy = 32
    parts = [
        f'<g fill="none" stroke="{INK}" stroke-linecap="round">'
        f'<circle cx="{cx}" cy="{cy}" r="26" stroke-width="1.5"/>'
        f'<circle cx="{cx}" cy="{cy}" r="16" stroke-width="3.5"/>'
        f'<circle cx="{cx}" cy="{cy}" r="8" stroke-width="1.5"/>'
        f'</g>'
        f'<circle cx="{cx}" cy="{cy - 16}" r="2.2" fill="{INK}"/>'
        f'<circle cx="{cx}" cy="{cy}" r="2.8" fill="{INK}"/>'
    ]
    write_text(ROOT / "logos" / "favicon.svg", svg_doc(W, H, "\n".join(parts)))


# ---------- ASSETS: Raster ----------

def render_apple_touch_icon():
    """180×180 PNG — full-bleed paper-warm, ink mark + small wordmark."""
    s = 4   # render at 4x then downsample
    W = H = 180 * s
    img = Image.new("RGB", (W, H), PAPER_WARM)
    d = ImageDraw.Draw(img)
    cx = cy = 90 * s
    R = 56 * s
    four_states_px(d, cx, cy - 12 * s, R,
                   jagrat_w=2, svapna_w=5, susupti_w=2,
                   dot_r=3.5 * s, marker_r=2.4 * s, color=INK_SOFT)
    # tiny wordmark below
    wm_font = f(CORMORANT_REG, 22 * s)
    txt = "Svapna"
    bb = d.textbbox((0, 0), txt, font=wm_font)
    tw = bb[2] - bb[0]
    d.text((cx - tw // 2 - bb[0], 130 * s), txt, font=wm_font, fill=INK_SOFT)
    img.resize((180, 180), Image.LANCZOS).save(ROOT / "logos" / "apple-touch-icon.png")


def render_android_chrome_192():
    """192×192 PNG — full-bleed paper-warm + mark, parallels apple-touch."""
    s = 4
    W = H = 192 * s
    img = Image.new("RGB", (W, H), PAPER_WARM)
    d = ImageDraw.Draw(img)
    cx = cy = 96 * s
    R = 60 * s
    four_states_px(d, cx, cy - 14 * s, R,
                   jagrat_w=2, svapna_w=5, susupti_w=2,
                   dot_r=3.7 * s, marker_r=2.6 * s, color=INK_SOFT)
    wm_font = f(CORMORANT_REG, 24 * s)
    txt = "Svapna"
    bb = d.textbbox((0, 0), txt, font=wm_font)
    tw = bb[2] - bb[0]
    d.text((cx - tw // 2 - bb[0], 138 * s), txt, font=wm_font, fill=INK_SOFT)
    img.resize((192, 192), Image.LANCZOS).save(ROOT / "logos" / "android-chrome-192.png")


def render_email_logo():
    """600×150 PNG, white bg — Discourse digest logo. Mark + wordmark + tagline."""
    s = 4
    W, H = 600 * s, 150 * s
    img = Image.new("RGB", (W, H), WHITE_RGB)
    d = ImageDraw.Draw(img)
    # mark
    cx, cy, R = 80 * s, 75 * s, 50 * s
    four_states_px(d, cx, cy, R,
                   jagrat_w=2, svapna_w=5, susupti_w=2,
                   dot_r=3 * s, marker_r=2 * s, color=INK_RGB)
    # divider
    hairline_px(d, 156 * s, 36 * s, 156 * s, 114 * s, w=2)
    # wordmark
    tx = 178 * s
    wm = f(CORMORANT_REG, 56 * s)
    d.text((tx - 4 * s, 22 * s), "Svapna", font=wm, fill=INK_RGB)
    # tagline
    tg = f(JBM_REG, 11 * s)
    draw_tracked(d, (tx, 105 * s), "DREAM YOGA  ·  LUCID DREAMING",
                 tg, INK_RGB, tracking_px=int(2.2 * s))
    img.resize((600, 150), Image.LANCZOS).save(ROOT / "email" / "email-logo.png")


def _composed_card(W, H, *, scale=2):
    """Shared composition for OG / Twitter — horizontal editorial layout.
    Returns the rendered image at supersampled size; caller resizes & saves.
    """
    img = Image.new("RGB", (W * scale, H * scale), WHITE_RGB)
    d = ImageDraw.Draw(img)
    s = scale
    margin = 60 * s
    d.rectangle([margin, margin, W * s - margin, H * s - margin],
                outline=INK_RGB, width=max(1, s // 2 or 1))

    # eyebrow
    eb = f(JBM_REG, 18 * s)
    draw_tracked(d, (margin + 28 * s, margin + 22 * s),
                 "SVAPNA  ·  VOL. I  ·  ISS. I", eb, INK_RGB, tracking_px=int(4 * s))
    right_txt = "MMXXVI"
    rw = text_w_px(d, right_txt, eb, tracking_px=int(4 * s))
    draw_tracked(d, (W * s - margin - 28 * s - rw, margin + 22 * s),
                 right_txt, eb, INK_RGB, tracking_px=int(4 * s))
    hairline_px(d, margin + 28 * s, margin + 60 * s,
                W * s - margin - 28 * s, margin + 60 * s, w=max(1, s // 2 or 1))

    # mark
    mark_cx = margin + 220 * s
    mark_cy = (H * s) // 2 + 10 * s
    R = 150 * s
    four_states_px(d, mark_cx, mark_cy, R,
                   jagrat_w=max(1, s), svapna_w=max(2, int(3 * s)),
                   susupti_w=max(1, s), dot_r=8 * s, marker_r=5 * s)
    hairline_px(d, mark_cx + R + 80 * s, margin + 100 * s,
                mark_cx + R + 80 * s, H * s - margin - 100 * s,
                w=max(1, s // 2 or 1))

    # right column
    text_x = mark_cx + R + 120 * s
    sub_font = f(JBM_REG, 14 * s)
    draw_tracked(d, (text_x, mark_cy - 130 * s),
                 "DREAM YOGA  ·  LUCID DREAMING",
                 sub_font, INK_RGB, tracking_px=int(3 * s))
    h_font = f(CORMORANT_REG, 96 * s)
    h_italic = f(CORMORANT_ITALIC, 96 * s)
    d.text((text_x - 6 * s, mark_cy - 100 * s),
           "Awaken within", font=h_font, fill=INK_RGB)
    d.text((text_x - 6 * s, mark_cy + 0 * s),
           "the dream.", font=h_italic, fill=INK_RGB)
    body = f(CORMORANT_LIGHT, 28 * s) if Path(CORMORANT_LIGHT).exists() else f(CORMORANT_REG, 28 * s)
    d.text((text_x, mark_cy + 110 * s),
           "A course in the contemplative art", font=body, fill=INK_RGB)
    d.text((text_x, mark_cy + 144 * s),
           "of dream yoga.", font=body, fill=INK_RGB)

    # bottom rule + meta
    hairline_px(d, margin + 28 * s, H * s - margin - 60 * s,
                W * s - margin - 28 * s, H * s - margin - 60 * s,
                w=max(1, s // 2 or 1))
    bottom_left = "JĀGRAT · SVAPNA · SUṢUPTI · TURĪYA"
    draw_tracked(d, (margin + 28 * s, H * s - margin - 38 * s),
                 bottom_left, eb, INK_RGB, tracking_px=int(4 * s))
    bottom_right = "SVAPNA.SCHOOL"
    brw = text_w_px(d, bottom_right, eb, tracking_px=int(4 * s))
    draw_tracked(d, (W * s - margin - 28 * s - brw, H * s - margin - 38 * s),
                 bottom_right, eb, INK_RGB, tracking_px=int(4 * s))

    return img


def render_og_jpg():
    """1200×630 JPG q90."""
    img = _composed_card(1200, 630, scale=2)
    img.resize((1200, 630), Image.LANCZOS).save(
        ROOT / "social" / "og.jpg", "JPEG", quality=90, optimize=True)


def render_twitter_jpg():
    """1200×600 JPG q90 (2:1, summary_large_image)."""
    img = _composed_card(1200, 600, scale=2)
    img.resize((1200, 600), Image.LANCZOS).save(
        ROOT / "social" / "twitter-card.jpg", "JPEG", quality=90, optimize=True)


def render_login_splash_jpg():
    """1920×1080 JPG q90 — same composition as before, JPG export."""
    s = 2
    W, H = 1920 * s, 1080 * s
    img = Image.new("RGB", (W, H), WHITE_RGB)
    d = ImageDraw.Draw(img)
    margin = 96 * s
    d.rectangle([margin, margin, W - margin, H - margin],
                outline=INK_RGB, width=max(1, s // 2 or 1))
    eb = f(JBM_REG, 16 * s)
    draw_tracked(d, (margin + 32 * s, margin + 28 * s),
                 "SVAPNA  ·  EST. MMXXVI", eb, INK_RGB, tracking_px=int(4 * s))
    rgt = "DREAM YOGA & LUCID DREAMING"
    rw = text_w_px(d, rgt, eb, tracking_px=int(4 * s))
    draw_tracked(d, (W - margin - 32 * s - rw, margin + 28 * s),
                 rgt, eb, INK_RGB, tracking_px=int(4 * s))

    cx = int(W * 0.30)
    cy = H // 2
    R = 200 * s
    four_states_px(d, cx, cy, R,
                   jagrat_w=max(1, s), svapna_w=max(2, int(3 * s)),
                   susupti_w=max(1, s), dot_r=10 * s, marker_r=6 * s)
    hairline_px(d, cx + R + 120 * s, margin + 160 * s,
                cx + R + 120 * s, H - margin - 160 * s, w=max(1, s // 2 or 1))

    tx = cx + R + 160 * s
    draw_tracked(d, (tx, cy - 220 * s),
                 "VOL. I  ·  ISS. I", eb, INK_RGB, tracking_px=int(4 * s))
    big = f(CORMORANT_REG, 124 * s)
    big_it = f(CORMORANT_ITALIC, 124 * s)
    d.text((tx - 6 * s, cy - 180 * s), "Awaken within", font=big, fill=INK_RGB)
    d.text((tx - 6 * s, cy - 50 * s), "the dream.", font=big_it, fill=INK_RGB)
    body = f(CORMORANT_LIGHT, 30 * s) if Path(CORMORANT_LIGHT).exists() else f(CORMORANT_REG, 30 * s)
    d.text((tx, cy + 130 * s),
           "A course in the contemplative art", font=body, fill=INK_RGB)
    d.text((tx, cy + 175 * s),
           "of dream yoga.", font=body, fill=INK_RGB)
    hairline_px(d, margin + 32 * s, H - margin - 64 * s,
                W - margin - 32 * s, H - margin - 64 * s, w=max(1, s // 2 or 1))
    draw_tracked(d, (margin + 32 * s, H - margin - 40 * s),
                 "JĀGRAT  ·  SVAPNA  ·  SUṢUPTI  ·  TURĪYA",
                 eb, INK_RGB, tracking_px=int(4 * s))
    sign = "“I RECEIVED, AND NOW I GIVE.”"
    sw = text_w_px(d, sign, eb, tracking_px=int(4 * s))
    draw_tracked(d, (W - margin - 32 * s - sw, H - margin - 40 * s),
                 sign, eb, INK_RGB, tracking_px=int(4 * s))
    img.resize((1920, 1080), Image.LANCZOS).save(
        ROOT / "social" / "login-splash.jpg", "JPEG", quality=90, optimize=True)


# Twelve categories from copy/04-category-descriptions.md
CATEGORY_BANNERS = [
    ("I",     "Foundations",            "PRACTICE  ·  JOURNALING  ·  SLEEP"),
    ("II",    "History",                "ROOTS OF THE PRACTICE"),
    ("III",   "Curriculum",             "TWELVE WEEKS, SIX PHASES"),
    ("IV",    "Community",              "INTRODUCTIONS  ·  REGIONAL  ·  GATHERING"),
    ("V",     "Library",                "TEXTS  ·  PAPERS  ·  FILMS  ·  GLOSSARY"),
    ("VI",    "Support",                "A FOOTNOTE, IN THE SPIRIT OF DĀNA"),
    ("VII",   "Dream sharing circles",  "SMALL OPT-IN GROUPS  ·  ASYNCHRONOUS"),
    ("VIII",  "Practice partners",      "ACCOUNTABILITY MATCHING"),
    ("IX",    "Experiences",            "LUCID MOMENTS  ·  PLATEAUS  ·  RETURNS"),
    ("X",     "Lineage & teachers",     "ACKNOWLEDGMENTS  ·  RECOMMENDATIONS"),
    ("XI",    "Meta",                   "CODE OF CONDUCT  ·  MODERATION  ·  FEEDBACK"),
    ("XII",   "Off-topic",              "THE TEAHOUSE"),
]

def render_category_banners():
    """1500×400 each, JPG q90, white bg, hairline frame."""
    s = 2
    W, H = 1500 * s, 400 * s
    out_dir = ROOT / "discourse" / "category-banners"
    out_dir.mkdir(exist_ok=True)
    for roman, title, kicker in CATEGORY_BANNERS:
        img = Image.new("RGB", (W, H), WHITE_RGB)
        d = ImageDraw.Draw(img)
        margin = 60 * s
        d.rectangle([margin, margin, W - margin, H - margin],
                    outline=INK_RGB, width=max(1, s // 2 or 1))
        # left: roman numeral
        rn = f(CORMORANT_LIGHT, 96 * s) if Path(CORMORANT_LIGHT).exists() else f(CORMORANT_REG, 96 * s)
        d.text((margin + 40 * s, margin + 24 * s), roman, font=rn, fill=INK_RGB)
        # vertical divider
        hairline_px(d, margin + 200 * s, margin + 36 * s,
                    margin + 200 * s, H - margin - 36 * s,
                    w=max(1, s // 2 or 1))
        # eyebrow
        eb = f(JBM_REG, 14 * s)
        draw_tracked(d, (margin + 232 * s, margin + 36 * s),
                     kicker, eb, INK_RGB, tracking_px=int(3 * s))
        # title
        title_size = 96 * s if len(title) <= 18 else 76 * s
        ttl = f(CORMORANT_REG, title_size)
        d.text((margin + 228 * s, margin + 76 * s), title, font=ttl, fill=INK_RGB)
        # right side: tiny mark
        mcx = W - margin - 90 * s
        mcy = H // 2
        four_states_px(d, mcx, mcy, 56 * s,
                       jagrat_w=max(1, s), svapna_w=max(2, int(2.4 * s)),
                       susupti_w=max(1, s), dot_r=3 * s, marker_r=2 * s)
        # bottom rule + meta
        hairline_px(d, margin + 232 * s, H - margin - 60 * s,
                    W - margin - 200 * s, H - margin - 60 * s,
                    w=max(1, s // 2 or 1))
        draw_tracked(d, (margin + 232 * s, H - margin - 36 * s),
                     "JĀGRAT · SVAPNA · SUṢUPTI · TURĪYA",
                     eb, INK_RGB, tracking_px=int(3 * s))
        slug = title.lower().replace(" & ", "-and-").replace(" ", "-")
        img.resize((1500, 400), Image.LANCZOS).save(
            out_dir / f"{roman.lower()}-{slug}.jpg",
            "JPEG", quality=90, optimize=True)


# ---------- Discourse colors ----------

def write_colors_json():
    colors = {
        "name": "Svapna — Editorial",
        "version": 1,
        "colors": {
            "primary":            "000000",
            "secondary":          "FFFFFF",
            "tertiary":           "000000",
            "quaternary":         "000000",
            "header_background":  "FFFFFF",
            "header_primary":     "000000",
            "highlight":          "FAF8F4",
            "danger":             "000000",
            "success":            "000000",
            "love":               "000000",
        },
    }
    write_text(ROOT / "discourse" / "svapna-colors.json",
               json.dumps(colors, indent=2) + "\n")


# ---------- Favicon raster fallbacks (PNG + ICO) ----------

def render_favicon_pngs():
    """Render PNG/ICO fallbacks at 16/32/48 from favicon.svg geometry directly."""
    s = 8
    W = H = 64 * s
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = cy = 32 * s
    # Use the same geometry as render_favicon_svg
    for r, w in [(26 * s, max(1, int(1.5 * s))),
                 (16 * s, max(2, int(3.5 * s))),
                 (8  * s, max(1, int(1.5 * s)))]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=INK_RGB, width=w)
    mr = int(2.2 * s)
    d.ellipse([cx - mr, cy - 16 * s - mr, cx + mr, cy - 16 * s + mr], fill=INK_RGB)
    cr = int(2.8 * s)
    d.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=INK_RGB)

    img64 = img.resize((64, 64), Image.LANCZOS)
    img32 = img.resize((32, 32), Image.LANCZOS)
    img16 = img.resize((16, 16), Image.LANCZOS)
    img48 = img.resize((48, 48), Image.LANCZOS)

    img64.save(ROOT / "logos" / "favicon-64.png")
    img48.save(ROOT / "logos" / "favicon-48.png")
    img32.save(ROOT / "logos" / "favicon-32.png")
    img16.save(ROOT / "logos" / "favicon-16.png")
    img32.save(ROOT / "logos" / "favicon.ico", format="ICO",
               sizes=[(16, 16), (32, 32), (48, 48)])


# ---------- Wire canonical filenames ----------

PUBLIC = Path("/sessions/focused-zen-allen/mnt/svapna/public")
DISCOURSE = ROOT / "discourse"

def install_canonical():
    """Copy/rename final outputs into marketing/discourse/ and /public so the
    Discourse upload + the live site can pick them up directly."""
    DISCOURSE.mkdir(exist_ok=True)
    pairs = [
        # (source under marketing/, destination under discourse/, also-to-public?)
        ("logos/logo.svg",                 "logo.svg",                  True),
        ("logos/logo-small.svg",           "logo-small.svg",            True),
        ("logos/logo-mobile.svg",          "logo-mobile.svg",           True),
        ("logos/favicon.svg",              "favicon.svg",               True),
        ("logos/favicon.ico",              "favicon.ico",               True),
        ("logos/favicon-32.png",           "favicon-32.png",            True),
        ("logos/favicon-16.png",           "favicon-16.png",            True),
        ("logos/apple-touch-icon.png",     "apple-touch-icon.png",      True),
        ("logos/android-chrome-192.png",   "android-chrome-192.png",    True),
        ("email/email-logo.png",           "email-logo.png",            False),
        ("social/og.jpg",                  "og.jpg",                    True),
        ("social/twitter-card.jpg",        "twitter-card.jpg",          True),
        ("social/login-splash.jpg",        "login-splash.jpg",          False),
    ]
    import shutil
    for src, dst, to_public in pairs:
        src_p = ROOT / src
        if not src_p.exists():
            print(f"  MISSING: {src}")
            continue
        shutil.copy2(src_p, DISCOURSE / dst)
        if to_public:
            shutil.copy2(src_p, PUBLIC / dst)
    # colors json lives only in discourse/
    if (DISCOURSE / "svapna-colors.json").exists():
        pass


# ---------- main ----------

if __name__ == "__main__":
    print("logo.svg…");          render_logo_svg()
    print("logo-small.svg…");    render_logo_small_svg()
    print("logo-mobile.svg…");   render_logo_mobile_svg()
    print("favicon.svg…");       render_favicon_svg()
    print("favicon PNGs/ICO…");  render_favicon_pngs()
    print("apple-touch-icon…");  render_apple_touch_icon()
    print("android-chrome…");    render_android_chrome_192()
    print("email-logo…");        render_email_logo()
    print("og.jpg…");            render_og_jpg()
    print("twitter-card.jpg…");  render_twitter_jpg()
    print("login-splash.jpg…");  render_login_splash_jpg()
    print("category banners…");  render_category_banners()
    print("svapna-colors.json…"); write_colors_json()
    print("install canonical…"); install_canonical()
    print("done.")
