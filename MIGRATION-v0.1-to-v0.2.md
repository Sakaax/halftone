# Halftone v0.1 → v0.2 migration

> **TL;DR.** v0.2 is a breaking change. There is no auto-migration. Re-run `/halftone` from scratch on each project. The moodboard + lock steps are replaced by a live HTML preview on `localhost:3737`. Anti-slop rules are now enforced by a PostToolUse hook on every preview save.

## Why the rewrite

v0.1 had three confirmed pain points:

1. **Onboarding too long** — too many steps before the user saw anything visual.
2. **Design not reached fast enough** — moodboard + lock gates delayed the wow moment.
3. **Token-heavy** — generating SvelteKit/Astro projects for every iteration burned tokens on framework scaffolding instead of design.

v0.2 separates **design exploration (cheap, iterative HTML preview)** from **framework implementation (one-shot, mechanical conversion)**.

## Flow comparison

| | v0.1 | v0.2 |
|---|---|---|
| Step 1 | Brief (audience / goal / mood / format) | Brief (feeling / loved site / non-negotiable / format) |
| Step 2 | Directions (3 in parallel) | Directions (3 in parallel) — unchanged |
| Step 3 | Moodboard (6 images) | **Preview HTML** on `localhost:3737` |
| Step 4 | Lock direction.md | **Validation + framework choice** |
| Step 5 | Scaffold framework | **Convert** preview → framework |
| Step 6 | Code | Code (routing, forms, audits) |

## Breaking changes

### State machine (`halftone/.state.json`)

The `current_step` enum changed:

```diff
- "init" | "brief" | "directions" | "moodboard" | "locked" | "scaffolded" | "coded"
+ "init" | "brief" | "directions" | "preview" | "framework_chosen" | "converted" | "coded"
```

The `moodboard_source` field is removed. Two new fields are added: `chosen_direction: 1|2|3|null` and `framework_choice: "sveltekit"|"astro"|null`.

If a `halftone/.state.json` file exists from v0.1, **delete it**. There is no migration helper. Run `/halftone` to re-init.

### Brief schema (`halftone/brief.md`)

`version: 1` → `version: 2`. Schema changed from goal-oriented to feeling-oriented:

```diff
- audience: indie dev
- site_goal: get leads
- mood_preference: editorial-warm
+ feeling: editorial
+ loved_site:
+   url: https://oddstudio.com
+   why: texture
+ non_negotiable: brand color must stay #D4622A
  format: studio-landing
  has_existing_ux_brief: false
  has_existing_brand_kit: false
```

### Direction artifact (`halftone/direction.md`)

The `moodboard` frontmatter section becomes optional. New v0.2 directions don't write it. Reading old v0.1 `direction.md` files still works because the schema accepts the field.

### Output directory

```diff
- halftone/moodboard/   (6 images per direction)
+ halftone/preview/     (vanilla HTML/CSS/JS — full motion preview)
+ halftone/.preview-pid (running server PID, auto-cleaned)
```

Both paths are auto-added to `.gitignore` by `ensureGitignore()`. `.gitignore` entries from v0.1 referencing `/halftone/moodboard/` can stay (harmless) or be removed manually.

### Slot markers in templates

```diff
- <!-- slot:hero -->
+ <section data-slot="hero"></section>
```

The new `data-slot` attribute is required by the v0.2 converter (`src/convert/parser.ts`). All six framework templates (`templates/{sveltekit,astro}/{studio-landing,saas-premium,creative-portfolio}/`) ship with the new markers.

### GSAP / Lenis dependency

Preview phase loads GSAP + Lenis from CDN (CDNjs / jsdelivr). Conversion phase moves them to npm dependencies in `package.json`. v0.1 had GSAP/Lenis only as runtime template additions.

### Hook system

A new PostToolUse hook (`hooks/antislop-check.ts`, auto-discovered from `hooks/hooks.json`) fires on every Write/Edit and self-filters by `halftone/preview/**`. Five fast regex checks (banned fonts, gradients, Tailwind defaults, generic hero, motion without `prefers-reduced-motion`). Performance budget <500ms per write.

This is invisible to v0.1 users, but anyone running v0.2 in a project with hooks already installed should verify there are no conflicts in their global hook config.

## Deprecated, but kept in repo

Per spec §7, the following are not deleted:

- `internal-skills/moodboard/SKILL.md` — frontmatter `deprecated: true`, content preserved as reference for future pattern extensions.
- `fallback-assets/<mood>/*.svg` — 42 hand-curated SVGs, untouched. Useful for img-pilot work or v0.3+ pattern catalogs.
- `moods/<slug>.json` — still loaded by the directions phase (mood derivation from `feeling`).
- `internal-skills/scaffold-{sveltekit,astro}/SKILL.md` — still used by the convert phase for project bootstrap.

## What did not change

- Banned fonts list (Inter, Arial, Roboto, Helvetica Neue, Open Sans, Lato, Montserrat).
- Banned gradients (purple-to-pink, rainbow, neon glow).
- Banned framework: Next.js — still banned, no exceptions.
- The 7 curated moods catalog.
- The 6 framework templates (3 formats × SvelteKit + Astro), now with `data-slot` markers.
- License: AGPL-3.0.
- Pre-commit secret scanner hook (`hooks/pre-commit.sh`).

## Re-running on a v0.1 project

```bash
# 1. Remove v0.1 state
rm -rf halftone/.state.json halftone/moodboard halftone/proposals halftone/direction.md halftone/brief.md

# 2. Verify your .gitignore has the v0.2 entries (optional — Halftone re-runs ensureGitignore)
echo "/halftone/preview/" >> .gitignore
echo "/halftone/.preview-pid" >> .gitignore

# 3. Re-run from scratch
/halftone
```
