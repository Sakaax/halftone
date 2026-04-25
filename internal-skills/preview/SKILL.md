---
name: halftone-preview
purpose: Build a vanilla HTML preview of the chosen direction with full motion, then serve it on localhost:3737
inputs: chosen direction (halftone/direction.md), state.current_step == "directions"
outputs: halftone/preview/{index.html,styles.css,motion.js,fonts/*}, running server on :3737, state transitions to preview
dependencies: src/preview/scaffold.ts, src/preview/server.ts
---

# Halftone — Preview phase

You are Claude running the preview phase of Halftone v0.2.

## HARD RULES

- Output directory is **always** `halftone/preview/`. Never write outside it during this phase.
- Use **vanilla HTML + CSS + JS only**. No SvelteKit, no Astro, no React, no build tooling.
- **GSAP + Lenis from CDN** (`cdn.jsdelivr.net`) — never npm in the preview.
- Slot markers are HTML attributes: `<section data-slot="hero">`. Never HTML comments.
- Motion organized as `initX()` functions, one per slot, called from `DOMContentLoaded`.
- Every motion path must early-return on `prefers-reduced-motion: reduce`.
- Banned fonts (Inter, Arial, Roboto, Helvetica Neue, Open Sans, Lato, Montserrat) and banned gradients (purple-to-pink, rainbow, neon glow) are blocked by the PostToolUse hook on every save — fix before continuing if the hook flags something.
- DO NOT touch `src/`, `templates/`, or any framework directory. Preview is its own world.

## STEPS

### 1. Read the chosen direction

`halftone/direction.md` (frontmatter + body) — palette, typography, motion language, slot patterns.

### 2. Scaffold the files

Call `buildScaffold` from `src/preview/scaffold.ts` with:
- `title`: short site title from the brief
- `slots`: at minimum `["hero", "primary-motion", "footer"]`. Add `"cursor"` and/or `"transition"` if the direction calls for them.
- `displayFontHref` / `bodyFontHref`: Google Fonts CSS URLs for the typography pair (only whitelisted families).

Write the three outputs to:
- `halftone/preview/index.html`
- `halftone/preview/styles.css`
- `halftone/preview/motion.js`

### 3. Author each slot

Replace the empty `<section data-slot="X">` bodies with **real, well-crafted content** (never lorem ipsum). Match the direction's motion language inside the corresponding `initX()` function. Use the palette tokens from the direction; do not introduce new colors.

### 4. Bundle local fonts (optional)

If the direction picks self-hosted fonts, copy the WOFF2 files from `fonts/<family>/` into `halftone/preview/fonts/<family>/` and add `@font-face` rules to `styles.css`.

### 5. Launch the server and open the browser

Call `startServer` from `src/preview/server.ts` with `projectRoot`. The function:
- picks a runner: `bun` → `python3` → `npx` (in that order)
- spawns it detached on port 3737
- writes the PID to `halftone/.preview-pid` (auto-killed on the next preview launch)
- opens `http://localhost:3737` in the default browser

### 6. Iterate in natural language

Tell the user: *"Preview live at http://localhost:3737. Tell me what to change in plain language — colors, copy, motion, layout. The PostToolUse hook will block AI-slop patterns automatically."*

When the user asks for changes, edit only files inside `halftone/preview/`. The hook fires on every save.

### 7. Transition state

Once files are written and the server is up, transition state to `preview`. When the user validates ("ça me va", "good", "ship it"), the orchestrator transitions to `framework_chosen` and asks SvelteKit vs Astro.

## WHAT NOT TO PUT IN THE PREVIEW

These are deferred to the framework conversion (step 05) — say so explicitly if the user asks for them in this phase:
- Multi-page routing
- Stateful forms (multi-step, validation, submission)
- SSR-dependent / CMS content
- Astro islands / Svelte stores
- Per-route dynamic meta / SEO
- Sitemap / robots.txt

Tell the user: *"The preview covers the full visual design and all motion. When we convert to SvelteKit/Astro, we'll add: routing, forms, server-rendered content, per-route SEO. The design stays identical."*
