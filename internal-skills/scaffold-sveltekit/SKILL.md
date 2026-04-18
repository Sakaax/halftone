---
name: halftone-scaffold-sveltekit
purpose: Scaffold a SvelteKit project from direction.md
inputs: halftone/direction.md (framework=sveltekit), templates/sveltekit/<format>/
outputs: SvelteKit project files in project root + halftone/README-fonts.md if paid fonts
dependencies: templates/copy, templates/slots, templates/tokens, patterns/resolver, fonts/bundle, fonts/paid-stub
---

# Halftone — Scaffold SvelteKit

## HARD RULES

- NEVER overwrite files with `halftone:locked` frontmatter.
- ONLY write within allowed FS scope (src/, static/, package.json append, .gitignore).
- Add framework deps with user confirmation (one [Y/n] prompt per dep group).

## STEPS

### 1. Read direction

Parse `halftone/direction.md` with `parseDirection()`. Verify `framework === "sveltekit"`.

### 2. Copy template

Copy `templates/sveltekit/<direction.format>/` → project root. Preserve any existing file that has `halftone:locked` in its frontmatter.

### 3. Resolve slots

For each slot detected (via `detectSlots`), look up `direction.motion.patterns[slot.name]`. Copy the pattern content into the slot position. Inject tokens via mustache substitution.

### 4. Bundle fonts

Call `bundleFonts` with the 3 families from `direction.typography`. Generate `@font-face` CSS at `src/lib/fonts.css`.

### 5. Paid-font stubs

If any family is paid (PP Editorial New, Migra, GT America, PP Right Grotesk), call `writeReadmeFonts`.

### 6. Add deps

Prompt user: "Add SvelteKit + GSAP + Lenis to package.json? [Y/n]". If yes, merge deps from `templates/sveltekit/<format>/package.json` into user's `package.json`.

### 7. Transition state

Set `current_step = "scaffolded"`.
