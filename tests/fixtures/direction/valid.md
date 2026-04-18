---
version: 1
mood: editorial-warm
format: studio-landing
framework: sveltekit
palette:
  bg: "#0F0E0C"
  fg: "#E8E4DE"
  accent: "#D4622A"
  muted: "#8B7355"
  border: "rgba(232,228,222,0.08)"
typography:
  display: { family: "PP Editorial New", weight: 400 }
  body: { family: "Space Grotesk", weight: 400 }
  mono: { family: "JetBrains Mono", weight: 400 }
motion:
  language: "pinned scroll + per-letter reveal"
  patterns:
    hero: "heroes/asymmetric-editorial@sha256:abc123"
    primary-motion: "text-reveals/per-letter-gsap@sha256:def456"
    footer: "footers/editorial-outro@sha256:ghi789"
moodboard:
  source: "fallback"
  paths:
    - "halftone/moodboard/hero-bg.svg"
    - "halftone/moodboard/texture.svg"
    - "halftone/moodboard/ambient.svg"
    - "halftone/moodboard/detail.svg"
    - "halftone/moodboard/portrait.svg"
    - "halftone/moodboard/abstract.svg"
locked_at: "2026-04-19T16:30:00Z"
---

# Direction: Warm Editorial Studio

## Rationale
Brief asked for warm craft feel.

## Motion language
Per-letter reveal on load, pinned scroll.
