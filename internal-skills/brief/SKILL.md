---
name: halftone-brief
purpose: Run a 3-question design brief and write halftone/brief.md (schema v2 — feeling, loved site, non-negotiable)
inputs: user initial request, project state (absent or current_step == 'init')
outputs: halftone/brief.md, halftone/.state.json updated to current_step == 'brief'
dependencies: reads ux-pilot/ux-brief.md + brand-pilot/brand-kit.md if present
---

# Halftone — Brief phase (v0.2)

You are Claude running the brief phase of Halftone v0.2. The goal is to extract enough signal in three answers to produce three genuinely different art directions in the next step.

## HARD RULES

- MAX 3 questions. Count them. Stop at 3.
- One additional Q-format ("studio / saas / portfolio") because it drives template selection later — that one is mandatory and never skipped.
- Each Q is short answer or single choice. Never open-ended ("describe your vision").
- DO NOT write any code. DO NOT touch `src/`. Only `halftone/brief.md` and `halftone/.state.json`.

## STEPS

### 1. Check upstreams

- If `ux-pilot/ux-brief.md` exists: read its content as soft context. It does NOT replace the v0.2 questions (the v0.2 brief is feeling-based, ux-pilot is goal/audience-based — complementary, not redundant).
- If `brand-pilot/brand-kit.md` exists: surface its palette in the brief and skip the open question on color in Q3 — record `has_existing_brand_kit: true`.

### 2. Ask the three questions

- **Q1 — Feeling** (one word): *"One word that describes the feeling the site should give. Examples: editorial, brutalist, playful, severe, organic, cinematic, restrained, aggressive."*
- **Q2 — Loved site** (URL + one word): *"One existing site you love, and one word for why. Format: `https://example.com — texture` or `https://example.com — restraint`."*
- **Q3 — Non-negotiable** (one constraint): *"One non-negotiable constraint the design must satisfy. Examples: 'brand color must stay #D4622A', 'must support Cyrillic', 'must work fully offline', 'no scroll-jacking'."*

### 3. Always-ask format

- **Q-format**: *"Pick a format: [1] Studio / agency landing  [2] Premium SaaS  [3] Creative portfolio"*

### 4. Write halftone/brief.md

Write the file with this frontmatter (BriefSchema v2):

```yaml
---
version: 2
created_at: <ISO-8601 UTC>
feeling: <Q1 answer, lowercase, one word, ≤40 chars>
loved_site:
  url: <Q2 URL>
  why: <Q2 word, lowercase, ≤40 chars>
non_negotiable: <Q3 sentence, ≤200 chars>
format: studio-landing | saas-premium | creative-portfolio
has_existing_ux_brief: <true|false>
has_existing_brand_kit: <true|false>
---
```

Body (under the frontmatter): a short paragraph synthesizing the answers in your own words, so the directions phase has prose to riff on.

### 5. Transition state

Update `halftone/.state.json`: `current_step = "brief"`.
Exit with one line: *"Brief captured. Ready for directions."*
