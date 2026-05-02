# Svapna site voice rules

All user-facing copy on the Svapna site is written in a detached, declarative voice — describing the work, not addressing the reader. The welcome lesson at [11_online/00_welcome.md](11_online/00_welcome.md) is the canonical example to model new content on.

**Why:** the warm/instructional voice typical of course material reads as out of register here. The site is meant to read as a piece of writing that exists, not a guide that speaks to the reader. Established through extensive iteration removing direct address, first-person voice, the noun "course", negative self-framing, reader-direction, and bold claims about the project's behavior ("we read everything", "we owe each of them").

## Scope

Every visible string on the site:

- All `.md` files under `reference-material/11_online/` (welcome, glossary, the 47 per-module lessons)
- About-page data in [`src/content.js`](../src/content.js) (`aboutPages.conduct`, `aboutPages.acknowledgments`, `aboutPages.contact`)
- Module overviews and curriculum metadata in [`src/content.js`](../src/content.js) (`curriculumModules`, `historyUnits`, `library`, `articles`, `themes`, `homeQuote`, `moduleDeepening`)
- Inline UI labels and prose in [`src/DreamYogaApp.jsx`](../src/DreamYogaApp.jsx) — section labels, kicker labels, footer prose, "Lesson in preparation" placeholders, anything visible
- The 12 Discourse category descriptions in [`scripts/setup-discourse.py`](../scripts/setup-discourse.py) (`CATEGORIES`)
- Marketing copy in `marketing/copy/*.md` and brand-spec docs

Form-state UI strings (button labels like "Send message", confirmations like "Thank you. A reply will follow.") are borderline — they're transactional, not editorial. "Thank you" in form-success states is accepted; treat similar tiny transactional strings with judgement.

## Rules

1. **No second-person.** Drop `you`, `your`, `yours`, contractions like `you'll` / `you've` / `you're`.
2. **No first-person.** Drop `I`, `me`, `my`, `mine`, `we`, `us`, `our`, `ours`. Watch for the editorial "we" ("anything *we* could call dream yoga", "gives *us* a structural framework", "**We** read everything", "**We** owe each of them") — restructure rather than translate token-for-token.
3. **No "course".** Replace with "the work" (or restructure). Watch for verb-noun collisions: "the work works with" → "the work draws on"; "the work will not pretend the material is simple. It will, however, work to make…" → drop the negative and use "take pains" or "labor" for the verb.
4. **No negatives about the work itself.** "It is not a practice manual" → drop entirely; "A note on what the work is not" → "A note on what the work is" + reframe the body. Negatives about external things (traditions, the experiment) are fine: "none of these traditions, on its own", "the outcome is not yet visible".
5. **No bold claims about behavior.** "We read everything", "Please tell us what you made so we can link to it", promises of timely reply. State what mail does, not what the project will do with it: "Mail about the work… lands at admin@svapnaproject.org. Replies arrive when they arrive."
6. **No reader instruction.** No imperatives directed at the reader ("Read in order", "Begin with…", "Quote responsibly", "Cite the source"), no reader-permissions ("a first reading can pass over them where they slow the going"), no reader-mention ("the reader who wants more should consult…", "with the intent that a serious reader come away with a clearer picture"). Code-of-Conduct items can be reframed in passive voice ("the dream is witnessed without interpretation" rather than "witness without interpretation").
7. **Drop "Take it to the community" prompt blocks** in lesson markdown. Delete the trailing `---` separator and the `> **Take it to the community.** …` blockquote at the end of each lesson. The React chrome's `lesson.prompt && (…)` gate at [`src/DreamYogaApp.jsx`](../src/DreamYogaApp.jsx) hides the section automatically when no prompt is parsed.
8. **Preserve direct quotations verbatim.** `>` blockquotes and italicised wordings from primary sources stay untouched, even when they contain "you/we/I". The work is committed to quoting where quotation is possible.

## Epistemic stance

The rules above govern person, register, and reader-relation. They do not address how the project's own prose handles contemplative or metaphysical claims. The site's voice describes traditions and attributes claims; it does not endorse them.

The mechanism is paragraph-local attribution. Wherever the prose asserts a contemplative or metaphysical claim, the same paragraph or sentence marks the source: a tradition ("On the Dzogchen view…", "The Geluk treatment teaches…", "The Māṇḍūkya makes the claim that…"), a named teacher ("Namkhai Norbu's account is…", "Wallace holds that…"), or a primary text ("verse 7 says…", "the verse establishes…"). Direct quotation is the cleanest case and is preferred where available.

**Patterns to avoid in project voice:**

- Sweeping epochal claims ("For three millennia, contemplatives have entered the dream knowingly…").
- Bare metaphysical assertions ("the awareness is already present", "the projection runs at a slower frame rate").
- Cross-tradition equivalences asserted by the prose itself ("the awareness the Māṇḍūkya called turīya" used to identify a referent rather than to describe a term).
- Devotional register ("It asks for nothing but attention. The work was given freely, and passes forward.").

**Patterns that work:**

- Tradition-internal framing in the same sentence as the claim.
- Quotation, with translator named on first occurrence.
- Historical and structural statements ("Every later Indian dream-tradition either accepts this framework, modifies it, or argues against it.") — these describe texts and traditions, not metaphysics.
- Hedged scientific summaries ("on the present scientific record", "the laboratory work has begun to catch up to it").

**The test:** a sceptical reader who disagrees with Vajrayana metaphysics should be able to read a project-voice paragraph without feeling argued at. Tradition-internal claims they see attributed; they do not see the project endorsing them.

Direct quotation in `>` blockquotes can use any register the source uses. The constraint is on the project's own prose.

## Title format constraint

The parser at [`src/lessons.js`](../src/lessons.js) needs lesson titles to keep the `# Module N, Lesson M — Title` prefix exactly (em-dash). Only the Title portion gets edited.

## Verification commands

```bash
# Sweep one editorial markdown file (strips blockquotes, italics, quoted spans):
F=path/to/file.md
grep -v '^>' "$F" | sed -E 's/\*[^*]*\*//g; s/"[^"]*"//g; s/'\''[^'\'']*'\''//g' \
  | grep -iE '\byou\b|\byour\b|\bI\b|\bme\b|\bmy\b|\bwe\b|\bus\b|\bour\b|\bcourse\b'

# Sweep all lesson markdown at once:
for f in reference-material/11_online/module_*/*.md; do
  v=$(grep -v '^>' "$f" | sed -E 's/\*[^*]*\*//g; s/"[^"]*"//g' \
        | grep -ciE '\byou\b|\byour\b|\bI\b|\bme\b|\bmy\b|\bwe\b|\bus\b|\bour\b|\bcourse\b')
  [ "$v" -gt 0 ] && echo "$v  $f"
done | sort -rn

# Sweep the JS content + JSX strings (more false positives expected):
grep -nE '\byou\b|\byour\b|\bwe\b|\bus\b|\bour\b|\bcourse\b' \
  src/content.js src/DreamYogaApp.jsx
```

Editorial sweeps should return nothing — or only false positives like translator initials ("J.I. Beare"), Roman-numeral citation references ("(I 304.16)"), and "course" used in non-website senses ("the dream's course" = trajectory). The JSX/JS sweep needs human judgement (matches inside code, comments, or transactional strings are fine).

## Epistemic-stance sweep

A second sweep flags candidates for unmarked metaphysical claims in project voice. The terms hit do not violate the rule by themselves — the question is whether the same paragraph attributes the claim to a tradition, teacher, or text:

```bash
F=path/to/file.md
grep -nv '^>' "$F" \
  | grep -iE 'pristine awareness|primordial consciousness|mind'\''s nature|self-transcendence|liberation|enlighten|awaken(ed|ing)?|the awareness that|the dream itself'
```

Hits inside attribution clauses are fine ("On Wallace's view…", "the Dzogchen claim is that…", "Namkhai Norbu calls this…"). Hits in bare project-voice prose are candidates for either attribution or rewording. Quoted material in `>` blockquotes is excluded by the leading filter.
