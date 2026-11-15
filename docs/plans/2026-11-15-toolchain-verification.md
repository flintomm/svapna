# Milestone 3 — toolchain verification

## Runtime and migration boundary

The project now requires **Node >=22.23.4 <23** in `package.json`. The repo-owned `.node-version` and GitHub Actions `setup-node` configuration both pin **22.23.4**, so local version managers and production builds select the qualified Node 22 patch release. The workflow's only change is this runtime pin; deployment behavior is otherwise unchanged.

Qualification used the official **Node 22.23.4 / npm 10.9.9** macOS ARM64 distribution extracted into `/Users/flint/.hermes/cache/scratch/svapna-node-22.23.4`, outside the repository. Its archive SHA-256 was verified against Node's published `SHASUMS256.txt`. Its `bin` directory was prepended to PATH only for the verification shell. Hermes's bundled `/Users/flint/.hermes/node/bin/node` was checked before and after and remains **v22.22.3**, as expected. No Hermes/system runtime, system Python, global tooling, shell profile, or `~/.local/bin` was modified.

Live npm registry metadata identified **Astro 7.4.12** and **@astrojs/react 7.1.9** as the current stable releases, both requiring Node **>=22.23.4**. These are exact direct pins, and the lockfile was updated under the raised runtime with engine checks enabled. Tailwind remains **3.4.19**; all unrelated direct dependency choices are unchanged. No content, routes, visual-design source, Workers, DNS, or production changes were made. Nothing was pushed or deployed.

The earlier Astro 7 migration review covered Vite 8, Rust compiler, Sätteri Markdown, experimental flags, reserved fetch file, removed APIs, and whitespace handling. The existing `compressHTML: true` setting continues to preserve Astro 6's inline whitespace semantics instead of adopting Astro 7's JSX whitespace default. No additional source migration was needed; this site's lesson renderer remains unchanged.

## Audit result — no open exceptions

| Audit | Before Milestone 3 | Before runtime-floor completion | Final |
| --- | --- | --- | --- |
| `npm audit` | 23 (3 low, 6 moderate, 13 high, 1 critical) | 1 moderate package finding | **0 vulnerabilities; exit 0** |
| `npm audit --omit=dev` | 18 (3 low, 2 moderate, 12 high, 1 critical) | 1 moderate package finding | **0 vulnerabilities; exit 0** |

The former single `astro@7.4.1` finding grouped two advisories. Both are resolved by installed **Astro 7.4.12**:

1. **[GHSA-mh32-jxcr-mh9f](https://github.com/advisories/GHSA-mh32-jxcr-mh9f)** / CVE-2026-126361 — low, XSS via attribute injection in dynamic tag names; patched in **7.4.5**.
2. **[GHSA-r3h5-4585-7x3w](https://github.com/advisories/GHSA-r3h5-4585-7x3w)** / CVE-2026-126364 — moderate, image endpoint can read a case-variant sibling output directory; patched in **7.4.7**.

The authorized project runtime-floor increase removes the previous compatibility blocker. There is no accepted advisory exception. No force fix, engine bypass, or dependency override was used.

## Verification

All npm commands below ran with **Node 22.23.4 / npm 10.9.9**, not Hermes's bundled Node:

- `npm install --save-exact --engine-strict astro@7.4.12 @astrojs/react@7.1.9`: passes; updates manifest and lockfile.
- `npm ci --engine-strict`: clean install passes; 388 packages installed, 389 audited, zero vulnerabilities.
- `npm audit`: **0 vulnerabilities**, exit **0**.
- `npm audit --omit=dev`: **0 vulnerabilities**, exit **0**.
- `npm run test:markdown`: **10/10** pass; zero failed or skipped.
- `npm run lint`: passes.
- `npm run build`: passes, reports **160 pages**; independently counted **160 HTML files** with Python `Path('dist').rglob('*.html')`.
- `git diff --check`: passes.
- `xmllint --noout dist/sitemap-index.xml dist/sitemap-0.xml dist/rss.xml dist/letter.xml`: passes for all four XML outputs.
- Python built-artifact checks pass for HTML and H1 elements at `/`, `/curriculum`, `/curriculum/module-01/brhadaranyaka-dreamer-as-creator`, `/history`, `/library`, `/glossary`, and `/about/privacy`. These are generated-file checks, not a claim of a new deployment or browser visual review. No route was added or renamed.
- `/Users/flint/.hermes/node/bin/node --version`: still **v22.22.3**, intentionally unchanged.

## Lockfile review

Compared the lockfile package map against baseline `dbafc04`. Changes are the requested Astro/React integration upgrades and their dependency trees: updated Astro helpers, Sätteri, and `p-queue`; added Astro renderer/runtime/Vite-plugin packages and `mri`; removed superseded `eventemitter3`, `p-timeout`, and `yargs-parser` packages. npm consolidated Rolldown's duplicate tree onto **1.2.19** and its matching platform bindings, removing the nested Vite copy. No overrides or unrelated direct upgrades were introduced. Programmatic comparison confirms every other production direct pin and the complete `devDependencies` map are unchanged.
