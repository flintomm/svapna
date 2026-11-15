# Milestone 3 — toolchain verification

## Runtime and migration boundary

Node **22.22.3** and npm **10.9.8** are unchanged. Tailwind remains **3.4.19**. No system Python, content, routes, visual-design source, Workers, DNS, deployment workflow, or production changes were made.

Live npm registry metadata was checked rather than relying on an outdated-package snapshot. Astro **7.4.1** and `@astrojs/react` **7.1.0** are the newest stable releases compatible with this fixed Node runtime. Astro 7.4.2–7.4.12 and React integration 7.1.1–7.1.9 require Node **>=22.23.4**. Direct versions are exact pins so a subsequent install cannot silently cross this runtime boundary. The other direct dependencies were updated within their existing major versions; current versions of Tailwind, `@eslint/js`, and `eslint-plugin-react-hooks` were retained.

Reviewed the [Astro 7 migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/): Vite 8, Rust compiler, Sätteri Markdown, experimental flags, reserved fetch file, removed APIs, and whitespace handling. The only required configuration change is `compressHTML: true`, preserving Astro 6's inline whitespace semantics instead of adopting Astro 7's JSX whitespace default. No source migration was needed; this site's lesson renderer remains unchanged.

## Audit result and explicit open exceptions

| Audit | Before | After |
| --- | --- | --- |
| `npm audit` | 23 (3 low, 6 moderate, 13 high, 1 critical) | 1 moderate package finding |
| `npm audit --omit=dev` | 18 (3 low, 2 moderate, 12 high, 1 critical) | 1 moderate package finding |

Both final audit commands exit **1**, not zero. npm groups the following **two advisories** under the single installed `astro@7.4.1` finding:

1. **[GHSA-mh32-jxcr-mh9f](https://github.com/advisories/GHSA-mh32-jxcr-mh9f)** / CVE-2026-126361 — low, XSS via attribute injection in dynamic tag names. Affects Astro <=7.4.4; patched in **7.4.5**. Exploitation requires untrusted input to choose an element name. This build generates fixed HTML from repository-controlled templates/content; source inspection found no untrusted-input-selected dynamic tag names. GitHub Pages does not run Astro to render requests. This does not make the dependency patched: do not introduce untrusted element names or treat static hosting as sanitization of untrusted build inputs.
2. **[GHSA-r3h5-4585-7x3w](https://github.com/advisories/GHSA-r3h5-4585-7x3w)** / CVE-2026-126364 — moderate, image endpoint can read a case-variant sibling output directory. Affects Astro >=5.14.3 through 7.4.6; patched in **7.4.7**. Exploitation requires on-demand rendering using `@astrojs/node`, a case-sensitive server filesystem, and a case-variant sibling directory. This project uses `output: 'static'`, has no `@astrojs/node` dependency, and serves generated files through GitHub Pages, not an Astro image endpoint. That runtime attack path is absent from this deployment.

**Patched releases do exist**, but none support the explicitly retained Node 22.22.3 runtime. These are runtime-compatibility exceptions, not claims that the registry has no fixes. No force fix, engine bypass, or incompatible dependency override was used. Resolving the last finding requires authorization to raise Node to at least 22.23.4 and then upgrade Astro to a patched release (currently 7.4.12) and its React integration, with renewed qualification.

## Verification

- `npm ci --engine-strict`: passes under Node 22.22.3/npm 10.9.8.
- `npm run test:markdown`: **10/10** pass.
- `npm run lint`: passes.
- `npm run build`: passes, reports **160 pages**; independently counted **160 HTML files**.
- `git diff --check`: passes.
- `xmllint --noout`: passes for `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `dist/rss.xml`, and `dist/letter.xml`.
- Built HTML exists and contains HTML and H1 elements for home, curriculum, `curriculum/module-01/brhadaranyaka-dreamer-as-creator`, history, library, glossary, and **`about/privacy`**. An initial probe of `legal/privacy` failed because that is not this site's route; the existing privacy route is `/about/privacy`, which passed. No route was added or renamed.

## Lockfile review

Reviewed the lockfile's changed package trees and dependency parents. There is one tree each for Astro, its React integration, Vite, React, React DOM, PostCSS, Tailwind, Sharp, and Zod; no old Astro/Vite major remains. The new duplicate major trees are expected transitive requirements: `hookified` 1/2 via ESLint's cache packages, and `@emnapi/core`, `@emnapi/runtime`, and `@emnapi/wasi-threads` 1/2 via optional Astro/Sätteri/Rolldown WASM bindings. No overrides were introduced. The optional Rolldown WASM dependency explicitly requests the upstream `@emnapi` 2.0.0-beta.2 releases; this is not a direct prerelease upgrade.

On this macOS install npm labels eight optional WASM-support packages as `extraneous` in `npm ls --depth=0`, including after a fresh `npm ci --engine-strict`. They are represented in the lockfile's optional platform dependency trees, not unexpected direct manifest dependencies. The clean install, tests, and build succeed; no manual lockfile deletion or unsupported deduplication was used to suppress these labels.
