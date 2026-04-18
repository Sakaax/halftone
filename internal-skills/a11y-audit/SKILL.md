---
name: halftone-a11y-audit
purpose: Audit generated site for WCAG 2.1 AA (static + optional axe-core deep)
inputs: scaffolded project, --deep flag (optional)
outputs: halftone/audit/a11y.md with pass|warn|fail checklist
dependencies: src/audit/a11y-static.ts, src/audit/a11y-deep.ts, src/audit/report.ts
---

# Halftone — A11y Audit

## SCOPE

WCAG 2.1 **AA only**. No AAA checks in v0.1.

## STATIC CHECKS (default)

- `alt=` on every `<img>`
- `<html lang>` set
- Focus styles defined (no `outline: none` without replacement `:focus-visible` rule)
- Skip-link present
- Palette contrast ratios ≥ 4.5:1 (text) / ≥ 3:1 (large text), computed by pairing every `--text`-like token with every `--bg`-like token
- `prefers-reduced-motion` gates motion
- Semantic landmarks (`<nav>`, `<main>`, `<footer>`)

Run: `bun run src/audit/a11y-static.ts <project-root>`

## DEEP CHECKS (--deep flag)

Requires Playwright installed (`bunx playwright install --with-deps chromium`).

Inject `@axe-core/playwright`, run `axe` analyze. Group violations by impact (critical/serious/moderate/minor).

- critical + serious = `fail`
- moderate + minor = `warn`
- Focus-order check (axe rule `tabindex`)
- ARIA usage validation (axe rule `aria-valid-attr-value`, `aria-required-attr`)
- Full keyboard-navigation simulation (tab through interactive elements, assert focus visible + order logical)

## OUTPUT

Write `halftone/audit/a11y.md` with same schema as responsive.md: `audit: a11y`, `mode: static|deep`, `result: pass|fail`, `summary: {pass, warn, fail counts}`, and a numbered checklist.

## PASS/FAIL

- `result: pass` requires 0 `fail` entries (critical + serious axe violations count as fail).
- Warns acceptable but flagged.

## AUTO-FIX PROPOSALS

The audit report's "Suggested fixes" section offers auto-fix for:
- Missing `alt` text (prompts user for text, then writes)
- Missing `lang` attr on `<html>`
- Missing `loading="lazy"` on images
- `outline: none` → replace with `outline: 2px solid var(--accent); outline-offset: 2px;` on `:focus-visible`
- Missing viewport meta tag

User confirms each auto-fix (batch [Y/n]).
