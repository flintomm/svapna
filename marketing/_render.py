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

def four_states_svg(cx, cy, R, *, dot_r=None, color=INK, **_ignored):
    """Return SVG string for the ∴ tridot mark — three solid dots arranged
    in an equilateral triangle, apex up (one top, two bottom).

    The function name is preserved for call-site compatibility; it now
    renders the new mark. R is the circumscribed-circle radius — distance
    from the geometric center to each dot's center. dot_r defaults to
    R × 0.22 which holds visual weight at every supported scale.

    Extra kwargs from the previous ring-stack signature are accepted and
    ignored (jagrat_w, svapna_w, susupti_w, marker_r).
    """
    if dot_r is None:
        dot_r = R * 0.30
    shift = R / 4
    h_factor = 0.74
    # Three positions, each labelled with which edges face OUTWARD from the
    # triangle's centroid. Outward edges are rendered as straight lines so the
    # composite outer border reads as a triangle. Inward edges keep the
    # sparkle curve at k=0.87.
    # Edge keys: tr (top→right), rb (right→bottom), bl (bottom→left), lt (left→top).
    arrangements = [
        # (cx_off, cy_off, flat_edges)
        (0,                 -R + shift,        {"lt", "tr"}),         # apex
        (-R * h_factor,     R * 0.5 + shift,   {"lt", "bl"}),         # bottom-left
        (R * h_factor,      R * 0.5 + shift,   {"tr", "rb"}),         # bottom-right
    ]
    k = 0.87  # control-point reach toward the bounding-square corners

    def _seg(end_x, end_y, ctrl_x, ctrl_y, flat):
        if flat:
            return f"L {end_x:.3f} {end_y:.3f} "
        return f"Q {ctrl_x:.3f} {ctrl_y:.3f} {end_x:.3f} {end_y:.3f} "

    paths = []
    for cx_off, cy_off, flat in arrangements:
        x = cx + cx_off
        y = cy + cy_off
        c_tr = (x + k * dot_r, y - k * dot_r)
        c_rb = (x + k * dot_r, y + k * dot_r)
        c_bl = (x - k * dot_r, y + k * dot_r)
        c_lt = (x - k * dot_r, y - k * dot_r)
        d = (
            f"M {x:.3f} {y - dot_r:.3f} "
            + _seg(x + dot_r, y,         c_tr[0], c_tr[1], "tr" in flat)
            + _seg(x,         y + dot_r, c_rb[0], c_rb[1], "rb" in flat)
            + _seg(x - dot_r, y,         c_bl[0], c_bl[1], "bl" in flat)
            + _seg(x,         y - dot_r, c_lt[0], c_lt[1], "lt" in flat)
            + "Z"
        )
        paths.append(f'<path d="{d}" fill="{color}"/>')
    return "".join(paths)


# ---------- Pillow geometry helpers ----------

def four_states_px(draw, cx, cy, R, *, dot_r=None, color=INK_RGB, **_ignored):
    """Pillow renderer for the ∴ tridot mark — three filled dots in an
    equilateral triangle. R is circumscribed-circle radius; dot_r defaults
    to R × 0.22. Old kwargs (jagrat_w, svapna_w, susupti_w, marker_r) are
    accepted and ignored so callers don't have to change."""
    if dot_r is None:
        dot_r = R * 0.30
    shift = R / 4
    h_factor = 0.74
    arrangements = [
        (0,             -R + shift,        {"lt", "tr"}),
        (-R * h_factor, R * 0.5 + shift,   {"lt", "bl"}),
        (R * h_factor,  R * 0.5 + shift,   {"tr", "rb"}),
    ]
    def _qbez(p0, p1, p2, n=14):
        pts = []
        for i in range(n + 1):
            t = i / n
            u = 1 - t
            x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0]
            y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]
            pts.append((x, y))
        return pts

    k = 0.87
    for cx_off, cy_off, flat in arrangements:
        x = cx + cx_off
        y = cy + cy_off
        v_top    = (x,         y - dot_r)
        v_right  = (x + dot_r, y)
        v_bottom = (x,         y + dot_r)
        v_left   = (x - dot_r, y)
        c_tr = (x + k * dot_r, y - k * dot_r)
        c_rb = (x + k * dot_r, y + k * dot_r)
        c_bl = (x - k * dot_r, y + k * dot_r)
        c_lt = (x - k * dot_r, y - k * dot_r)

        def _edge(p_start, p_end, ctrl, is_flat):
            if is_flat:
                return [p_start, p_end]
            return _qbez(p_start, ctrl, p_end)

        polyline = []
        polyline += _edge(v_top,    v_right,  c_tr, "tr" in flat)[:-1]
        polyline += _edge(v_right,  v_bottom, c_rb, "rb" in flat)[:-1]
        polyline += _edge(v_bottom, v_left,   c_bl, "bl" in flat)[:-1]
        polyline += _edge(v_left,   v_top,    c_lt, "lt" in flat)[:-1]
        draw.polygon(polyline, fill=color)


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

    # mark — ∴ at R=80 with default dot_r (R×0.4 = 32) sits comfortably in the 200×200 left panel
    cx, cy, R = 150, 150, 80
    parts.append(four_states_svg(cx, cy, R))

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
    # R=70 fits the mark within the 200-square with a comfortable margin.
    body = four_states_svg(cx, cy, 70)
    write_text(ROOT / "logos" / "logo-small.svg", svg_doc(W, H, body))


def render_logo_mobile_svg():
    """800×200, transparent — Discourse `mobile_logo`."""
    W, H = 800, 200
    parts = []
    cx, cy, R = 100, 100, 60
    parts.append(four_states_svg(cx, cy, R))
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
    The ∴ tridot, sized to remain readable down to 16×16. Bigger dots
    relative to the canvas because at favicon scale we need every glyph
    to read from across the room."""
    W = H = 64
    cx = cy = 32
    # R = 18 puts dots ~18px from center; dot_r = 7 gives ~14px diameter,
    # which survives 4× downscale to 16×16 (≈3.5px dots — still visible).
    # R=18, default dot_r=7.2 — survives 4× downscale to 16×16 (~3.6px dots).
    body = four_states_svg(cx, cy, 18)
    write_text(ROOT / "logos" / "favicon.svg", svg_doc(W, H, body))


# ---------- ASSETS: Raster ----------

def render_apple_touch_icon():
    """180×180 PNG — full-bleed paper-warm, ink mark + small wordmark."""
    s = 4   # render at 4x then downsample
    W = H = 180 * s
    img = Image.new("RGB", (W, H), PAPER_WARM)
    d = ImageDraw.Draw(img)
    cx = cy = 90 * s
    R = 44 * s
    four_states_px(d, cx, cy - 14 * s, R, color=INK_SOFT)
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
    R = 48 * s
    four_states_px(d, cx, cy - 14 * s, R, color=INK_SOFT)
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
    cx, cy, R = 80 * s, 75 * s, 38 * s
    four_states_px(d, cx, cy, R, color=INK_RGB)
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
    mark_cx = margin + 200 * s
    mark_cy = (H * s) // 2 + 10 * s
    R = 100 * s
    four_states_px(d, mark_cx, mark_cy, R)
    hairline_px(d, mark_cx + 170 * s, margin + 100 * s,
                mark_cx + 170 * s, H * s - margin - 100 * s,
                w=max(1, s // 2 or 1))

    # right column
    text_x = mark_cx + 210 * s
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


def _door_card(W, H, *, eyebrow_left, eyebrow_right, kicker,
               headline_top, headline_bottom_italic,
               sub_top, sub_bottom, scale=2):
    """OG-card composition tuned for the Door variants.

    Mirrors the editorial layout of `_composed_card` — same paper-white
    ground, same hairline frame, same ∴ tridot mark on the left, same
    JBM eyebrow / Cormorant headline / Cormorant Light body — but lets the
    caller substitute the per-door strings. Produced at supersampled size;
    caller resizes & saves.
    """
    img = Image.new("RGB", (W * scale, H * scale), WHITE_RGB)
    d = ImageDraw.Draw(img)
    s = scale
    margin = 60 * s
    d.rectangle([margin, margin, W * s - margin, H * s - margin],
                outline=INK_RGB, width=max(1, s // 2 or 1))

    # eyebrow row
    eb = f(JBM_REG, 18 * s)
    draw_tracked(d, (margin + 28 * s, margin + 22 * s),
                 eyebrow_left, eb, INK_RGB, tracking_px=int(4 * s))
    rw = text_w_px(d, eyebrow_right, eb, tracking_px=int(4 * s))
    draw_tracked(d, (W * s - margin - 28 * s - rw, margin + 22 * s),
                 eyebrow_right, eb, INK_RGB, tracking_px=int(4 * s))
    hairline_px(d, margin + 28 * s, margin + 60 * s,
                W * s - margin - 28 * s, margin + 60 * s, w=max(1, s // 2 or 1))

    # mark
    mark_cx = margin + 200 * s
    mark_cy = (H * s) // 2 + 10 * s
    R = 100 * s
    four_states_px(d, mark_cx, mark_cy, R)
    hairline_px(d, mark_cx + 170 * s, margin + 100 * s,
                mark_cx + 170 * s, H * s - margin - 100 * s,
                w=max(1, s // 2 or 1))

    # right column
    text_x = mark_cx + 210 * s
    sub_font = f(JBM_REG, 14 * s)
    draw_tracked(d, (text_x, mark_cy - 130 * s),
                 kicker, sub_font, INK_RGB, tracking_px=int(3 * s))

    # headline — tighten when the line is long so it stays in-frame
    avail_w = W * s - margin - 28 * s - text_x
    h_size = 96 * s
    h_font = f(CORMORANT_REG, h_size)
    h_italic = f(CORMORANT_ITALIC, h_size)
    while h_size > 48 * s and (
        text_w_px(d, headline_top, h_font) > avail_w
        or text_w_px(d, headline_bottom_italic, h_italic) > avail_w
    ):
        h_size -= 4 * s
        h_font = f(CORMORANT_REG, h_size)
        h_italic = f(CORMORANT_ITALIC, h_size)

    d.text((text_x - 6 * s, mark_cy - 100 * s),
           headline_top, font=h_font, fill=INK_RGB)
    d.text((text_x - 6 * s, mark_cy + 0 * s),
           headline_bottom_italic, font=h_italic, fill=INK_RGB)

    body = f(CORMORANT_LIGHT, 28 * s) if Path(CORMORANT_LIGHT).exists() else f(CORMORANT_REG, 28 * s)
    d.text((text_x, mark_cy + 110 * s), sub_top, font=body, fill=INK_RGB)
    d.text((text_x, mark_cy + 144 * s), sub_bottom, font=body, fill=INK_RGB)

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


def render_og_lucid_jpg():
    """1200×630 JPG q90 — Door A (/start/lucid). Headline echoes the page
    H1 'How to lucid dream.' and the italic subtitle beneath it."""
    img = _door_card(
        1200, 630,
        eyebrow_left  = "SVAPNA  ·  ENTRY  ·  DOOR A",
        eyebrow_right = "MMXXVI",
        kicker        = "ENTRY  ·  LUCID DREAMING",
        headline_top  = "How to lucid",
        headline_bottom_italic = "dream.",
        sub_top    = "A working technique, and the empirical",
        sub_bottom = "tradition that produced it.",
        scale=2,
    )
    img.resize((1200, 630), Image.LANCZOS).save(
        ROOT / "social" / "og-lucid.jpg", "JPEG", quality=90, optimize=True)


def render_og_contemplative_jpg():
    """1200×630 JPG q90 — Door B (/start/contemplative). Headline echoes
    the page H1 'The fourth, and the three it contains.'"""
    img = _door_card(
        1200, 630,
        eyebrow_left  = "SVAPNA  ·  ENTRY  ·  DOOR B",
        eyebrow_right = "MMXXVI",
        kicker        = "ENTRY  ·  CONTEMPLATIVE",
        headline_top  = "The fourth, and the",
        headline_bottom_italic = "three it contains.",
        sub_top    = "On the Māṇḍūkya's four states, and the",
        sub_bottom = "thousand-year practice tradition.",
        scale=2,
    )
    img.resize((1200, 630), Image.LANCZOS).save(
        ROOT / "social" / "og-contemplative.jpg", "JPEG", quality=90, optimize=True)


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
    R = 150 * s
    four_states_px(d, cx, cy, R)
    hairline_px(d, cx + 220 * s, margin + 160 * s,
                cx + 220 * s, H - margin - 160 * s, w=max(1, s // 2 or 1))

    tx = cx + 260 * s
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
    out_dir = ROOT / "community" / "category-banners"
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
        four_states_px(d, mcx, mcy, 44 * s)
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
    write_text(ROOT / "community" / "svapna-colors.json",
               json.dumps(colors, indent=2) + "\n")


# ---------- Favicon raster fallbacks (PNG + ICO) ----------

def render_favicon_pngs():
    """Render PNG/ICO fallbacks at 16/32/48/64 — same ∴ tridot geometry as the SVG."""
    s = 8
    W = H = 64 * s
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    four_states_px(d, 32 * s, 32 * s, 18 * s)

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
COMMUNITY = ROOT / "community"

def install_canonical():
    """Copy/rename final outputs into marketing/community/ and /public so the
    in-house community surface + the live site can pick them up directly."""
    COMMUNITY.mkdir(exist_ok=True)
    pairs = [
        # (source under marketing/, destination under community/, also-to-public?)
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
        ("social/og-lucid.jpg",            "og-lucid.jpg",              True),
        ("social/og-contemplative.jpg",    "og-contemplative.jpg",      True),
        ("social/twitter-card.jpg",        "twitter-card.jpg",          True),
        ("social/login-splash.jpg",        "login-splash.jpg",          False),
    ]
    import shutil
    for src, dst, to_public in pairs:
        src_p = ROOT / src
        if not src_p.exists():
            print(f"  MISSING: {src}")
            continue
        shutil.copy2(src_p, COMMUNITY / dst)
        if to_public:
            shutil.copy2(src_p, PUBLIC / dst)
    # colors json lives only in community/
    if (COMMUNITY / "svapna-colors.json").exists():
        pass


# ---------- main ----------

# Targets dispatchable from the CLI. Each entry is (name, callable, label).
# `all` (the default when no args are given) runs the full canonical pass.
TARGETS = {
    "logo":              (render_logo_svg,          "logo.svg"),
    "logo-small":        (render_logo_small_svg,    "logo-small.svg"),
    "logo-mobile":       (render_logo_mobile_svg,   "logo-mobile.svg"),
    "favicon":           (render_favicon_svg,       "favicon.svg"),
    "favicon-pngs":      (render_favicon_pngs,      "favicon PNGs/ICO"),
    "apple-touch-icon":  (render_apple_touch_icon,  "apple-touch-icon"),
    "android-chrome":    (render_android_chrome_192,"android-chrome"),
    "email-logo":        (render_email_logo,        "email-logo"),
    "og":                (render_og_jpg,            "og.jpg"),
    "og-lucid":          (render_og_lucid_jpg,      "og-lucid.jpg"),
    "og-contemplative":  (render_og_contemplative_jpg, "og-contemplative.jpg"),
    "twitter":           (render_twitter_jpg,       "twitter-card.jpg"),
    "login-splash":      (render_login_splash_jpg,  "login-splash.jpg"),
    "category-banners":  (render_category_banners,  "category banners"),
    "colors":            (write_colors_json,        "svapna-colors.json"),
    "install":           (install_canonical,        "install canonical"),
}

# Order used by the default `all` pass.
DEFAULT_ORDER = [
    "logo", "logo-small", "logo-mobile", "favicon", "favicon-pngs",
    "apple-touch-icon", "android-chrome", "email-logo",
    "og", "og-lucid", "og-contemplative",
    "twitter", "login-splash", "category-banners", "colors", "install",
]


def main(argv):
    if not argv or argv == ["all"]:
        names = DEFAULT_ORDER
    else:
        names = []
        for a in argv:
            if a not in TARGETS:
                print(f"unknown target: {a}")
                print(f"available: all, {', '.join(DEFAULT_ORDER)}")
                return 2
            names.append(a)
    for name in names:
        fn, label = TARGETS[name]
        print(f"{label}…")
        fn()
    print("done.")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main(sys.argv[1:]))
