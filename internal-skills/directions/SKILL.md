---
name: halftone-directions
purpose: Generate 3 art directions in parallel from a brief
inputs: halftone/brief.md, moods/*.json, patterns/index.json
outputs: halftone/proposals/direction-{1,2,3}.md, state transitions to directions
dependencies: patterns manifest, moods loader
---

# Halftone — Directions phase

## HARD RULES

- Generate EXACTLY 3 directions. Never 2, never 4.
- Each direction MUST include: mood (1 of 7), typography pair (from mood.typography_options), framework recommendation (sveltekit|astro with 1-line justification), layout wireframe (ASCII), motion language (short paragraph), patterns chosen per slot, 3+ inspiration references.
- Filter patterns by mood_compat — if the mood doesn't appear in a pattern's mood_compat, don't recommend it.
- If brand-pilot/brand-kit.md exists: palette is fixed, mood still picked, typography must satisfy both brand-kit AND Halftone whitelist.

## STEPS

### 1. Dispatch 3 parallel subagents

Use superpowers:dispatching-parallel-agents. Each subagent receives:
- The brief
- The moods catalog (as JSON)
- The patterns manifest
- Constraint: "produce exactly one direction, written to halftone/proposals/direction-<N>.md"

### 2. Heuristics for framework recommendation

- **SvelteKit** for: dynamic SaaS, studio with heavy motion orchestration, client-state-heavy
- **Astro** for: content-heavy portfolios, editorial with static + islands, SaaS with built-in docs/blog

### 3. Wait for all 3 subagents

Collect all 3 proposals. Present to user with numbered options + framework override hint: "pick 1-3, or say 'direction N but in <sveltekit|astro>' to swap framework".

### 4. On user pick

Transition state to `moodboard`. Keep winning proposal, discard the other 2.

### 5. On "none fit"

Re-dispatch 3 fresh subagents with additional constraint from user's rejection feedback. Max 3 re-generation cycles before bouncing to a debrief conversation.
