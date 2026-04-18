---
name: halftone-scaffold-astro
purpose: Scaffold an Astro project from direction.md
inputs: halftone/direction.md (framework=astro), templates/astro/<format>/
outputs: Astro project files in project root + halftone/README-fonts.md if paid fonts
dependencies: templates/copy, templates/slots, templates/tokens, patterns/resolver, fonts/bundle, fonts/paid-stub
---

# Halftone — Scaffold Astro

## HARD RULES

- NEVER overwrite files with `halftone:locked` frontmatter.
- ONLY write within allowed FS scope (src/, public/, package.json append, .gitignore).
- Add deps with user confirmation (one [Y/n] prompt per dep group).
- Motion libraries must load on client islands — static sections stay static.

## STEPS

### 1. Read direction

Parse `halftone/direction.md` with `parseDirection()`. Verify `framework === "astro"`.

### 2. Copy template

Copy `templates/astro/<direction.format>/` → project root. Preserve any existing file with `halftone:locked` frontmatter.

### 3. Resolve slots

For each slot detected (via `detectSlots`), look up `direction.motion.patterns[slot.name]`. Copy the .astro pattern content into the slot position. Inject tokens via mustache substitution.

### 4. Bundle fonts

Call `bundleFonts` with families from `direction.typography`. Generate `@font-face` CSS at `src/styles/fonts.css`.

### 5. Paid-font stubs

If any paid family in use, call `writeReadmeFonts`.

### 6. Add deps

Prompt user: "Add Astro + GSAP + Lenis to package.json? [Y/n]". Merge deps from `templates/astro/<format>/package.json` on approval.

### 7. Transition state

Set `current_step = "scaffolded"`.

## ASTRO-SPECIFIC NOTES

- Motion patterns should use `<script>` blocks (client-side) or `<script is:inline>` for critical pre-hydration work.
- Keep static sections (manifesto, about, footer) free of client directives to preserve zero-JS-by-default footprint.
- Pages go in `src/pages/`, not `src/routes/`.
- Global styles via `src/styles/tokens.css` + `src/styles/fonts.css`.
