# CLAUDE.md — Halftone plugin

This is the codebase for the Halftone Claude Code plugin.

**Source spec:** `docs/superpowers/specs/2026-04-19-halftone-plugin-design.md` (in the private Pilot repo).
**Implementation plan:** `docs/superpowers/plans/2026-04-19-halftone-plugin.md` (in the private Pilot repo).

## Hard rules for contributors

- NEVER modify `patterns/index.json` by hand — run `bun run build:index`.
- Every pattern has both sveltekit + astro variants.
- Cap main SKILL.md < 10KB. Migrate content to internal skills if it grows.
- License: AGPL-3.0.
- Commit conventions: Conventional Commits. Never `--amend` on public main.

## Running tests

```
bun test                                     # unit + integration
HALFTONE_DEEP=1 bun test tests/audit-deep/   # Playwright deep audits
HALFTONE_VISUAL=1 bun test tests/visual/     # visual regression
bunx tsc --noEmit -p tsconfig.test.json      # type gate
```

## Architecture

- **Main orchestrator skill:** `.claude/skills/halftone/SKILL.md` (the ONLY public skill)
- **Internal skills:** `internal-skills/<name>/SKILL.md` (9 modules, read by orchestrator at runtime)
- **Pattern system:** `patterns/<slot>/<framework>/<slug>/` with `meta.json` per pattern, manifest at `patterns/index.json` (sha256 verified)
- **Templates:** `templates/<framework>/<format>/` (6 total: 3 formats × 2 frameworks)
- **Moods:** `moods/<slug>.json` (7 curated)
- **Fallback assets:** `fallback-assets/<mood>/` (42 SVGs, 7 moods × 6 briefs)
- **Fonts:** bundled WOFF2 in `fonts/<family>/`
- **Security:** `src/security/` (gitignore + chmod + fs-scope + prompt-injection + pre-commit hook)

See spec §4 for the canonical directory tree, §11 for the skill activation model, §10 for pattern composition.
