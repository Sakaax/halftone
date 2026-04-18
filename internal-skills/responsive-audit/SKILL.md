---
name: halftone-responsive-audit
purpose: Audit generated site for mobile responsiveness (static + optional Playwright deep)
inputs: scaffolded project, --deep flag (optional)
outputs: halftone/audit/responsive.md with pass|warn|fail checklist
dependencies: src/audit/responsive-static.ts, src/audit/responsive-deep.ts, src/audit/report.ts
---

# Halftone — Responsive Audit

## STATIC CHECKS (default)

- `clamp()` present in type-related CSS
- Button/CTA CSS has `min-height: 48px`
- Viewport meta tag present
- `@media (prefers-reduced-motion)` gates motion
- No `hover:` without touch alternative
- Full-screen overlay nav (structural heuristic)
- `loading="lazy"` on `<img>` tags

Run: `bun run src/audit/responsive-static.ts <project-root>`

## DEEP CHECKS (--deep flag)

Requires Playwright installed (`bunx playwright install --with-deps chromium`).

- Launch dev server, open in 375/390/414 viewports
- Measure no horizontal scroll (scrollWidth <= innerWidth)
- Measure real tap targets ≥ 48px
- Interact with nav — assert full-screen overlay opens
- Simulate prefers-reduced-motion — assert animations disabled

## OUTPUT

Write `halftone/audit/responsive.md` with frontmatter: `audit: responsive`, `mode: static|deep`, `result: pass|fail`, `summary: {pass, warn, fail counts}`, and a numbered checklist of all checks with per-check pass|warn|fail status.

## PASS/FAIL

- `result: pass` requires 0 fails. Warns acceptable but flagged.
- Each check returns `pass` | `warn` | `fail` independently.
