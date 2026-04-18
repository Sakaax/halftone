# Contributing to Halftone

## Core rules

- Every pattern has TWO framework variants (SvelteKit + Astro). PRs that update one MUST update the other.
- Commit conventions: Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `docs:`, `ci:`).
- Never `git commit --amend` on public main. Never bypass signing. Never force-push.

## Patterns

After adding or modifying a pattern:

```
bun run build:index
```

Commit the regenerated `patterns/index.json`. CI blocks if stale.

## Moods

v0.1 ships 7 curated moods. Adding a new mood requires:

- `moods/<slug>.json` passing the Zod schema
- `fallback-assets/<slug>/` with 6 curated SVGs (hero-bg, texture, ambient, detail, portrait, abstract)
- At least one pattern flagged `mood_compat: [<new-slug>]`
- CI green

## Tests

```
bun test                                      # unit + integration
HALFTONE_DEEP=1 bun test tests/audit-deep/    # Playwright deep audits
HALFTONE_VISUAL=1 bun test tests/visual/      # visual regression
bunx tsc --noEmit -p tsconfig.test.json       # type gate
```

## Code of Conduct

Be kind. Assume good intent. Critique craft, not people.
