---
name: halftone-moodboard
deprecated: true
deprecated_in: v0.2.0
replaced_by: internal-skills/preview/SKILL.md
purpose: (deprecated) Generate 6-image moodboard (img-pilot) or use fallback SVGs
inputs: chosen direction, moods/<slug>.json
outputs: halftone/moodboard/*.{png,svg}, state transitions to moodboard
dependencies: integrations/img-pilot, fallback-assets/<mood>/
---

> **DEPRECATED in v0.2.** The live HTML preview (`internal-skills/preview/SKILL.md`)
> replaces the moodboard step with a stronger signal — full visual + motion design on
> `localhost:3737` instead of 6 static images. The 42 fallback SVGs in
> `fallback-assets/` and the moods catalog in `moods/` remain available for future
> pattern extensions but are no longer part of the default flow.

# Halftone — Moodboard phase (v0.1, archived)

## DETECTION

1. Check `~/.config/img-pilot/config.toml` exists.
2. Check `bunx img-pilot --version` returns 0.

If both succeed → call img-pilot. Else → fallback.

## IF IMG-PILOT AVAILABLE

Call with: palette (hex + semantic roles), mood name, 6 briefs: hero-bg, texture, ambient-shot, detail, portrait-or-object, abstract.
Pass `grain_overlay: true`.
Write 6 PNG to `halftone/moodboard/*.png`.
Retry up to 2× on user rejection before bouncing to re-brief.

## IF IMG-PILOT ABSENT

Copy 6 curated SVGs from `fallback-assets/<mood>/*.svg` → `halftone/moodboard/*.svg`.
Show banner in chat: "Using fallback assets — install img-pilot for AI-generated moodboards. [Continue]".

## RECORD

Set `moodboard.source` in state to "img-pilot" or "fallback".
Transition state to `moodboard`.
