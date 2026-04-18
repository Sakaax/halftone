---
name: halftone-brief
purpose: Run a 3-question design brief and write halftone/brief.md
inputs: user initial request, project state (absent or current_step == 'init')
outputs: halftone/brief.md, halftone/.state.json updated to current_step == 'brief'
dependencies: reads ux-pilot/ux-brief.md + brand-pilot/brand-kit.md if present
---

# Halftone — Brief phase

You are Claude running the brief phase of Halftone's design-director workflow.

## HARD RULES

- MAX 3 questions. Count them. Stop at 3.
- Each question is multiple-choice or 1-sentence free-text. No open-ended "describe your vision".
- DO NOT write any code. DO NOT touch `src/`. Only `halftone/brief.md` and `halftone/.state.json`.

## STEPS

### 1. Check upstreams

- If `ux-pilot/ux-brief.md` exists: read audience + goal. Skip Q1. Ask 1-line confirmation only.
- If `brand-pilot/brand-kit.md` exists AND its palette matches one of the 7 moods: skip Q2. Show banner "brand-kit.md palette matches <mood>, using it [Y/n]".

### 2. Ask remaining questions

- **Q1** (if not pre-filled): "Describe the client or product in one sentence, and say what the site should achieve."
- **Q2** (if not pre-filled): "Pick a mood: [1] Editorial Warm [2] Brutalist Mono [3] Swiss Editorial [4] Organic Earth [5] Y2K Glitch [6] Dark Academic [7] Soft Pastel Print [8] surprise me"
- **Q3**: "Pick a format: [1] Studio/agency landing [2] Premium SaaS [3] Creative portfolio"

### 3. Write halftone/brief.md

Use the frontmatter schema in spec §5.1.

### 4. Transition state

Update `halftone/.state.json`: `current_step = "brief"`.
Exit with 1-line confirmation: "Brief captured. Ready for directions."
