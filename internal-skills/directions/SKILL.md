---
name: halftone-directions
purpose: Generate 3 art directions in parallel from the v0.2 brief, transition state to preview on user pick
inputs: halftone/brief.md, moods/*.json, patterns/index.json
outputs: halftone/proposals/direction-{1,2,3}.md, state transitions to directions then preview on pick
dependencies: patterns manifest, moods loader
---

# Halftone — Directions phase (v0.2)

## HARD RULES

- Generate EXACTLY 3 directions. Never 2, never 4.
- Each direction MUST include: mood (1 of 7), typography pair (from `mood.typography_options`), framework recommendation (sveltekit | astro with 1-line justification), layout wireframe (ASCII), motion language (short paragraph), patterns chosen per slot, 3+ inspiration references.
- Filter patterns by `mood_compat` — if the mood doesn't appear in a pattern's `mood_compat`, don't recommend it.
- If `brand-pilot/brand-kit.md` exists: palette is fixed; mood + typography must satisfy both brand-kit AND Halftone whitelist.

## DERIVING THE MOOD FROM THE v0.2 BRIEF

The brief no longer contains an explicit `mood_preference`. Instead, derive a candidate mood from `feeling` + `loved_site`:

| Brief signal (feeling + loved_site.why) | Candidate moods |
|---|---|
| editorial, restrained, refined, considered, magazine | editorial-warm, swiss-editorial |
| brutalist, raw, severe, industrial, anti-design | brutalist-mono |
| swiss, grid, structured, technical, precise | swiss-editorial |
| organic, warm, earthy, tactile, handmade, natural | organic-earth, editorial-warm |
| y2k, glitch, chrome, internet, lo-fi, weird | y2k-glitch |
| dark academic, scholarly, libraryish, archival, leather | dark-academic |
| pastel, soft, print, risograph, gentle, calm | soft-pastel-print |

Each of the 3 parallel subagents picks **one mood** from the candidate set (or the closest of the 7 if no exact match), so the user gets at least 2 distinct moods across the 3 directions.

## STEPS

### 1. Dispatch 3 parallel subagents

Use `superpowers:dispatching-parallel-agents`. Each subagent receives:

- The v0.2 brief (feeling, loved_site.url + why, non_negotiable, format)
- The moods catalog (as JSON)
- The patterns manifest
- The constraint: *"produce exactly one direction, written to `halftone/proposals/direction-<N>.md`"*

### 2. Heuristics for framework recommendation

Each subagent picks `sveltekit` or `astro` based on the format + motion intensity it proposes:

- **SvelteKit** for: dynamic SaaS, studio with heavy motion orchestration, client-state-heavy
- **Astro** for: content-heavy portfolios, editorial with static + islands, SaaS with built-in docs/blog

The chosen direction's framework recommendation is reused at the end of the preview phase — when the user validates the preview, this becomes the default suggestion ("Recommended: X").

### 3. Wait for all 3 subagents

Collect the 3 proposals. Present to the user with numbered options + framework override hint:
*"Pick 1 / 2 / 3, or say 'direction N but in <sveltekit|astro>' to override the framework now."*

### 4. On user pick

- Persist the chosen number into the state via `transitionTo(projectRoot, "preview", { chosen: <N> })`.
- Write the chosen direction to `halftone/direction.md` (not the discarded ones).
- Hand off to `internal-skills/preview/SKILL.md`.

### 5. On "none fit"

Re-dispatch 3 fresh subagents with additional constraint from the user's rejection feedback. Max 3 re-generation cycles before bouncing back to the brief for a soft re-debrief.
