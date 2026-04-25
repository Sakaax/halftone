---
name: halftone-convert
purpose: Mechanical conversion of the validated halftone/preview/ to a framework project (SvelteKit or Astro). Slot → component, initX() → onMount, Lenis init → root layout.
inputs: halftone/preview/, halftone/direction.md (framework_choice on state), state.current_step == "framework_chosen"
outputs: SvelteKit (src/lib/components/*.svelte, src/routes/+page.svelte, src/routes/+layout.svelte) or Astro (src/components/*.astro, src/layouts/Layout.astro, src/pages/index.astro), updated package.json, copied fonts, state transitions to converted
dependencies: src/convert/index.ts (parsePreview, convertToSvelteKit, convertToAstro, copyPreviewFonts), internal-skills/scaffold-sveltekit, internal-skills/scaffold-astro
---

# Halftone — Convert phase (v0.2)

You are Claude running the convert phase. The conversion is **mechanical** — no creative decisions, only mapping. If a step requires a judgment call, it does not belong in this phase.

## HARD RULES

- Run only when `state.current_step === "framework_chosen"` and `state.framework_choice ∈ {"sveltekit", "astro"}`.
- Do **not** rewrite motion logic. Each `initX()` body is moved verbatim into the component's `onMount` (SvelteKit) or `<script>` (Astro).
- Do **not** introduce new colors, fonts, or animations during conversion. The design is locked when the user validates the preview.
- GSAP and Lenis switch from CDN to npm dependencies. They are added to `package.json` if missing.
- The `prefers-reduced-motion` early-return is preserved on every component and on the Lenis bootstrap.

## STEPS

### 1. Bootstrap the framework project (delegated)

If the project root does not yet contain the framework skeleton (no `svelte.config.js` for SvelteKit / no `astro.config.mjs` for Astro), call:

- SvelteKit → read `internal-skills/scaffold-sveltekit/SKILL.md` and follow its bootstrap instructions for the chosen format (`halftone/direction.md → format`).
- Astro → read `internal-skills/scaffold-astro/SKILL.md` for the matching bootstrap.

These produce the canonical project skeleton at `templates/<framework>/<format>/`.

### 2. Run the converter

Call `convertPreview` from `src/convert/index.ts`:

```ts
import { convertPreview } from "../../src/convert";

const result = convertPreview({
  projectRoot,
  framework: state.framework_choice, // "sveltekit" | "astro"
});
```

The function:
1. Parses `halftone/preview/{index.html, styles.css, motion.js}` (`parsePreview`).
2. Generates one component file per `data-slot` (Hero, PrimaryMotion, FooterBlock, optional CursorOverlay/PageTransition).
3. Writes `+page.svelte` / `index.astro` that composes the components in the right order (overlays first, then `<main>` slots).
4. Writes `+layout.svelte` / `Layout.astro` with the Lenis bootstrap if the preview used it.
5. Updates `package.json` to add `gsap` and `lenis` as runtime dependencies.
6. Copies `halftone/preview/fonts/*` to `static/fonts/` (SvelteKit) or `public/fonts/` (Astro).

### 3. Sanity check

After conversion:
- `result.componentsWritten` should contain exactly one entry per parsed slot.
- `result.parsed.slots` length ≥ 3 (hero + primary-motion + footer minimum).
- `result.fonts.copied` ≥ 0 (zero is fine when the preview used CDN-only fonts).

If `result.parsed.slots.length === 0`, throw — the preview is malformed and conversion cannot proceed. Send the user back to the preview phase.

### 4. Transition state

Call `transitionTo(projectRoot, "converted", { framework: state.framework_choice })`.

The next phase (step 6 — Code) handles framework-specific additions: routing, forms, dynamic meta, sitemap.
