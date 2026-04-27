#!/usr/bin/env python3
"""One-shot Discourse provisioning: color scheme, branding uploads, categories.

Reads the admin API key from ~/.config/svapna-discourse.key (chmod 600).
Idempotent for site_settings + colors. Category creation skips already-existing
slugs so re-running is safe.
"""
from __future__ import annotations
import json
import mimetypes
import os
import sys
import urllib.request
import urllib.parse
import urllib.error
import uuid
from pathlib import Path

DISCOURSE_URL = "https://community.svapnaproject.org"
KEY_PATH = Path.home() / ".config" / "svapna-discourse.key"
ROOT = Path(__file__).resolve().parent.parent
ASSET_DIR = ROOT / "marketing" / "discourse"
BANNER_DIR = ASSET_DIR / "category-banners"

API_USERNAME = "system"


def read_key() -> str:
    if not KEY_PATH.exists():
        sys.exit(f"Missing API key at {KEY_PATH}. Save it there with chmod 600.")
    return KEY_PATH.read_text().strip()


API_KEY = read_key()


# --- HTTP helpers ----------------------------------------------------------


def _headers(extra: dict | None = None) -> dict:
    h = {"Api-Key": API_KEY, "Api-Username": API_USERNAME, "Accept": "application/json"}
    if extra:
        h.update(extra)
    return h


def api(method: str, path: str, *, data: dict | None = None) -> dict:
    """JSON-in/JSON-out request."""
    url = DISCOURSE_URL + path
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(
        url, data=body, method=method,
        headers=_headers({"Content-Type": "application/json"}),
    )
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"HTTP {e.code} on {method} {path}: {body[:600]}")


def upload_file(path: Path, *, upload_type: str = "site_setting") -> dict:
    """POST /uploads.json with multipart. Returns the upload object (id, url, ...)."""
    boundary = "----svapna" + uuid.uuid4().hex
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    parts: list[bytes] = []

    def add_field(name: str, value: str) -> None:
        parts.append(f"--{boundary}\r\n".encode())
        parts.append(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode())
        parts.append(value.encode())
        parts.append(b"\r\n")

    add_field("type", upload_type)
    add_field("synchronous", "true")

    parts.append(f"--{boundary}\r\n".encode())
    parts.append(
        f'Content-Disposition: form-data; name="file"; filename="{path.name}"\r\n'.encode()
    )
    parts.append(f"Content-Type: {mime}\r\n\r\n".encode())
    parts.append(path.read_bytes())
    parts.append(b"\r\n")
    parts.append(f"--{boundary}--\r\n".encode())

    body = b"".join(parts)
    req = urllib.request.Request(
        DISCOURSE_URL + "/uploads.json",
        data=body, method="POST",
        headers=_headers({"Content-Type": f"multipart/form-data; boundary={boundary}"}),
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        msg = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Upload failed for {path.name}: HTTP {e.code} {msg[:300]}")


def set_site_setting(name: str, value) -> None:
    api("PUT", f"/admin/site_settings/{name}.json", data={name: value})


# --- Steps -----------------------------------------------------------------


def step_verify() -> None:
    print("Verifying API key…", end=" ", flush=True)
    api("GET", "/admin/site_settings.json?filter=title")
    print("ok.")


def step_site_basics() -> None:
    print("Setting site description…", end=" ", flush=True)
    desc = (
        "A community for the contemplative study and practice of dream yoga, "
        "lucid dreaming, and the cultivation of awareness across the states "
        "of consciousness."
    )
    set_site_setting("site_description", desc)
    print("ok.")


def step_color_scheme() -> None:
    print("Importing color scheme…", end=" ", flush=True)
    src = json.loads((ASSET_DIR / "svapna-colors.json").read_text())
    payload = {
        "color_scheme": {
            "name": src.get("name", "Svapna — Editorial"),
            "base_scheme_id": "Light",
            "colors": [{"name": k, "hex": v} for k, v in src["colors"].items()],
        }
    }
    existing = api("GET", "/admin/color_schemes.json")
    same = next(
        (s for s in existing if s["name"] == payload["color_scheme"]["name"]),
        None,
    )
    if same:
        scheme_id = same["id"]
        api("PUT", f"/admin/color_schemes/{scheme_id}.json", data=payload)
    else:
        scheme = api("POST", "/admin/color_schemes.json", data=payload)
        scheme_id = scheme["id"]
    # Activate by setting it on the default theme.
    themes = api("GET", "/admin/themes.json").get("themes", [])
    default_theme = next((t for t in themes if t.get("default")), None)
    if default_theme:
        api(
            "PUT",
            f"/admin/themes/{default_theme['id']}.json",
            data={"theme": {"color_scheme_id": scheme_id}},
        )
    print(f"ok (scheme id {scheme_id}, default theme {default_theme['id'] if default_theme else 'unknown'}).")


BRANDING = [
    ("logo",                    "logo.svg"),
    ("logo_small",              "logo-small.svg"),
    ("mobile_logo",             "logo-mobile.svg"),
    ("favicon",                 "favicon.svg"),
    ("apple_touch_icon",        "apple-touch-icon.png"),
    ("push_notifications_icon", "android-chrome-192.png"),
    ("opengraph_image",         "og.jpg"),
    ("x_summary_large_image",   "twitter-card.jpg"),
    ("digest_logo",             "email-logo.png"),
]


def step_branding() -> None:
    print("Uploading branding assets:")
    for setting, fname in BRANDING:
        path = ASSET_DIR / fname
        if not path.exists():
            print(f"  · {setting}: missing {fname}, skipping.")
            continue
        try:
            up = upload_file(path)
        except SystemExit as e:
            print(f"  · {setting}: {e}")
            continue
        try:
            set_site_setting(setting, up["url"])
        except SystemExit:
            try:
                set_site_setting(setting, up["id"])
            except SystemExit as e:
                print(f"  · {setting}: setting failed: {e}")
                continue
        print(f"  · {setting}: ok.")


CATEGORIES = [
    ("I", "Foundations", "foundations", "i-foundations.jpg",
     "For practice itself: dream journaling, sleep hygiene, attention through the day, "
     "the slow steady work that the rest of the community grows from. Beginners welcome. "
     "Specific techniques (MILD, WILD, recognition by inquiry) belong here. Threads about "
     "why a practice isn't sticking belong here. Ask your basic question — there are no wasted ones."),

    ("II", "History", "history", "ii-history.jpg",
     "For the lineages and traditions the course actually traces — Vedic, Upaniṣadic, Indian "
     "Buddhist, Mahāyāna, Tibetan, Daoist, Sufi, Western. Discuss a primary text, surface a "
     "translator's choice, ask about a teacher's place in the broader story. The aim is care "
     "with the material: name the source, cite the passage, hold each tradition on its own terms."),

    ("III", "Curriculum", "curriculum", "iii-curriculum.jpg",
     "One thread per lesson, anchored to the course material. If a lesson opened a question, "
     "take it here. New lessons get their threads as you move through them. Old threads stay "
     "open — coming back to a lesson months later and finding what someone else wrote in the "
     "meantime is one of the gifts of an asynchronous community."),

    ("IV", "Community", "community", "iv-community.jpg",
     "The town square. Introductions, announcements, gentle conversation that doesn't fit "
     "elsewhere. Tell us where you came in from, what brought you to this work, where you find "
     "yourself now. Welcome posts go here on your first day; we read them."),

    ("V", "Library", "library", "v-library.jpg",
     "For books, papers, films, podcasts, primary sources. Recommendations, summaries, critical "
     "readings, reading-group threads. The course's reading list seeds this category; everything "
     "you've found that the course missed is welcome here."),

    ("VI", "Support", "support", "vi-support.jpg",
     "For help with practice, with technical issues on the site, with life situations affecting "
     "your practice. Disrupted sleep, periods of fragmentation, returning after time away. "
     "Volunteers from the community lend their time; nothing here is treated as therapy or "
     "medical advice. The Code of Conduct is pinned at the top."),

    ("VII", "Dream-Sharing Circles", "dream-sharing-circles", "vii-dream-sharing-circles.jpg",
     "Small opt-in groups where members share dreams. Witnessing without interpretation, unless "
     "interpretation is invited. Circles cap at twelve. Post here to introduce yourself for "
     "circle matching: timezone, what kind of dreams you're holding, what kind of company you'd "
     "find supportive. Existing circles announce openings here."),

    ("VIII", "Practice Partners", "practice-partners", "viii-practice-partners.jpg",
     "1:1 mutual accountability for a specific practice. Post what you're working on (e.g., "
     "\"starting MILD, looking for someone keeping a journal\"). Other members reply or DM. "
     "Either of you can step away — accountability without obligation. The matching is yours; "
     "the platform is the bulletin board."),

    ("IX", "Experiences", "experiences", "ix-experiences.jpg",
     "Personal dream reports, lucidity reports, reports from the threshold. Format is open: a "
     "fragment, a long account, a question carried out of a dream. The community's job is to "
     "witness. Interpretation only when the poster invites it."),

    ("X", "Lineage and Teachers", "lineage-and-teachers", "x-lineage-and-teachers.jpg",
     "For specific teachers, specific transmissions, specific schools. Where a teaching the "
     "course covered shows up in someone you've actually studied with. Ask, share, contextualize. "
     "Avoid general endorsement; stay close to particular teachings, particular phrasings, "
     "particular books."),

    ("XI", "Meta", "meta", "xi-meta.jpg",
     "The forum about the forum. Feature requests, code-of-conduct interpretations, moderation "
     "questions, accessibility issues, trial-balloons for new categories. Mods read this category daily."),

    ("XII", "Off-Topic", "off-topic", "xii-off-topic.jpg",
     "Everything else. Music, food, gardening, what you're reading. Anything that doesn't have "
     "a home in the categories above and that the community wouldn't be poorer for. Code of "
     "Conduct still applies — disagreement is welcome; contempt isn't."),
]


def step_categories() -> None:
    print("Creating categories:")
    existing = {c["slug"]: c for c in api("GET", "/categories.json")["category_list"]["categories"]}
    for idx, (numeral, name, slug, banner_fname, desc) in enumerate(CATEGORIES, start=2):
        banner_path = BANNER_DIR / banner_fname
        banner_md = ""
        if banner_path.exists():
            try:
                up = upload_file(banner_path, upload_type="composer")
                banner_md = f"![{name} banner]({up['url']})\n\n"
            except SystemExit as e:
                print(f"  · {name}: banner upload failed ({e}); proceeding without.")
        full_desc = banner_md + desc
        if slug in existing:
            cat = existing[slug]
            payload = {
                "name": name, "slug": slug,
                "description": full_desc, "color": "000000", "text_color": "FFFFFF",
                "position": idx,
            }
            api("PUT", f"/categories/{cat['id']}.json", data=payload)
            print(f"  · {numeral}. {name}: updated.")
        else:
            payload = {
                "name": name, "slug": slug,
                "description": full_desc, "color": "000000", "text_color": "FFFFFF",
                "position": idx,
            }
            api("POST", "/categories.json", data=payload)
            print(f"  · {numeral}. {name}: created.")


def main() -> None:
    step_verify()
    step_site_basics()
    step_color_scheme()
    step_branding()
    step_categories()
    print("\nDone. Visit https://community.svapnaproject.org/categories to verify.")


if __name__ == "__main__":
    main()
