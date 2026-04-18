---
name: halftone-typography
purpose: Write type tokens, @font-face rules, fluid clamp type scale
inputs: direction.typography
outputs: src/lib/fonts.css (SvelteKit) or src/styles/fonts.css (Astro), src/lib/tokens.css (fluid type)
dependencies: fonts/bundle, fonts/fontface, fonts/paid-stub
---

# Halftone — Typography phase

## HARD RULES

- NEVER use banned fonts: Inter, Arial, Roboto, Helvetica Neue, Open Sans, Lato, Montserrat.
- ONLY use whitelist: Newsreader, PP Editorial New, Migra, Fraunces, Mondwest, PP Neue Montreal, Space Grotesk, JetBrains Mono, GT America, PP Right Grotesk.
- ALWAYS use `clamp()` for type scale — never fixed px breakpoints.
- ALWAYS self-host fonts — no Google Fonts hotlinking in production.

## STEPS

### 1. Write @font-face

Call `generateFontFaceCSS` with the 3 families + weights from `direction.typography`. Output to `src/lib/fonts.css` (SvelteKit) or `src/styles/fonts.css` (Astro).

### 2. Write fluid type scale

Emit these CSS custom properties in `src/lib/tokens.css`:

```css
:root {
  --type-caption: clamp(0.75rem, 0.6rem + 0.5vw, 0.875rem);
  --type-body: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --type-lead: clamp(1.25rem, 1rem + 1vw, 1.5rem);
  --type-h3: clamp(1.5rem, 1rem + 2vw, 2.25rem);
  --type-h2: clamp(2rem, 1rem + 4vw, 4rem);
  --type-h1: clamp(3rem, 1rem + 10vw, 9rem);
}
```

### 3. Weight pairing

- display family: weight from `direction.typography.display.weight` (usually 400 or 700)
- body family: 400 as default, 500 for emphasis, 700 for strong
- mono family: 400 default

### 4. Paid-font stubs

If any family in `direction.typography` is a paid family (PP Editorial New, Migra, GT America, PP Right Grotesk), call `writeReadmeFonts` to emit `halftone/README-fonts.md` with purchase URLs + expected WOFF2 filenames.
