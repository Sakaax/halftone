---
name: halftone-motion
purpose: Apply a motion pattern to a component file
inputs: pattern tag (e.g., "motion:text-reveal"), target file, direction
outputs: updated component file with motion integrated
dependencies: patterns/manifest (read), patterns/resolver
---

# Halftone — Motion phase

## HARD RULES

- NEVER use: random entry animations on every element, infinite bouncing arrows, auto-playing sliders, hover-scale on everything, fade-in on every section.
- ALWAYS gate motion with `@media (prefers-reduced-motion: no-preference)` at CSS level and with `if (!matchMedia("(prefers-reduced-motion: reduce)").matches)` at JS level.
- ALWAYS use custom `cubic-bezier` easing (example: `cubic-bezier(0.76, 0, 0.24, 1)`), never default `ease`.
- Motion must serve hierarchy, reveal, rhythm, or emotion — never decoration.

## STEPS

### 1. Look up pattern by tag

Load `patterns/index.json`, filter by `motion_tags`. Match user request to the tightest motion_tag available (e.g., "text-reveal", "marquee", "scroll-pinned", "cursor", "transition").

### 2. Resolve for direction.framework

Call `resolveSlotContent()` with the selected pattern + the framework in `direction.framework`. Verify the sha256 matches before use.

### 3. Inject into target file

Insert the pattern content at the requested location. For SvelteKit, wrap motion in `onMount` (runs after hydration). For Astro, use `<script>` (hydrates client-side) or `<script is:inline>` if pre-hydration is critical.

### 4. Update package.json deps

If the pattern has `deps: ["gsap"]`, ensure they are pinned in the project `package.json`.

## MOTION LANGUAGE

- **text-reveal**: per-letter or per-word staggered reveal (GSAP or CSS animation)
- **marquee**: horizontal infinite-scroll ticker for headlines/taglines
- **scroll-pinned**: IntersectionObserver-driven reveals as content enters viewport
- **cursor**: magnetic or custom cursor, desktop-only (gated by `pointer: coarse`)
- **transition**: fullscreen route transitions, not fades
