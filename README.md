# Halftone

> The Claude Code plugin for award-tier expressive web design.
> No shadcn. No Inter. No purple gradients.

![banner](.github/banner.png)

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![CI](https://github.com/Sakaax/halftone/actions/workflows/ci.yml/badge.svg)](https://github.com/Sakaax/halftone/actions)

## What it does

Halftone forces Claude into a **design-director mode** before writing code. It generates expressive, award-tier web designs (studio landings, premium SaaS, creative portfolios) in SvelteKit or Astro, with hardcoded anti-AI-slop rules.

**The 6-step workflow:**
1. **Brief** — 3 questions max
2. **Directions** — 3 art directions in parallel
3. **Moodboard** — img-pilot (or fallback SVGs)
4. **Lock** — commit `direction.md`
5. **Scaffold** — slot-based composition
6. **Code** — motion + typography + audit

## Install

```
/plugin marketplace add Sakaax/halftone
/plugin install halftone@halftone
```

## Why

Claude Code by default ships shadcn-clean SaaS design. Competent but dead. Halftone pushes Claude toward the editorial, motion-rich, asymmetric craft that wins Awwwards.

**What's banned, hardcoded:**
- Fonts: Inter, Arial, Roboto, Helvetica Neue, Open Sans, Lato, Montserrat
- Gradients: purple-to-pink, rainbow, neon text glow
- Colors: Bootstrap primary blue, Tailwind defaults used as-is
- Motion: random animations, bouncing arrows, auto-playing sliders, fade-in-on-every-section

**What's allowed:**
- Typography: Newsreader, PP Editorial New, Migra, Fraunces, Mondwest, PP Neue Montreal, Space Grotesk, JetBrains Mono, GT America, PP Right Grotesk
- 7 curated moods: editorial-warm, brutalist-mono, swiss-editorial, organic-earth, y2k-glitch, dark-academic, soft-pastel-print
- Motion: GSAP + Lenis + Motion One (reason-driven, `prefers-reduced-motion` gated, custom cubic-bezier)

## Stack

- **Frameworks generated:** SvelteKit **and** Astro (both V1 first-class)
- **Motion:** GSAP + Lenis + Motion One
- **Typography:** self-hosted (no Google Fonts hotlinking)
- **Audits:** WCAG 2.1 AA static + optional axe-core via Playwright `--deep`

## Ecosystem

Halftone works alongside the [[Sakaax pilot ecosystem]](https://github.com/Sakaax):

- **[ux-pilot](https://ux-pilot.sakaax.com)** — UX flows → Halftone reads `ux-pilot/ux-brief.md`
- **[brand-pilot](https://brand-pilot.sakaax.com)** — brand guardian → Halftone reads `brand-pilot/brand-kit.md`
- **[img-pilot](https://img-pilot.sakaax.com)** — AI image generation → Halftone calls for moodboards + hero imagery (optional, falls back to SVGs)

Halftone sits **outside** the `*-pilot` family, intentionally. It's a next-step product, not a sibling.

## FAQ

**Q: Is my generated site AGPL-3.0 too?**
No. AGPL-3.0 covers **Halftone's plugin source**. Your generated sites can use any license.

**Q: Does it work with Next.js?**
No. Banned explicitly.

**Q: Video?**
Not in v0.1. v2+ consideration.

**Q: What if img-pilot isn't installed?**
Halftone runs end-to-end on curated SVG fallbacks. 42 hand-curated SVGs ship in-tree (7 moods × 6 briefs). You can still generate a full site, you just get placeholder moodboards instead of AI-generated ones.

## Links

- [Landing](https://halftone.sakaax.com) (coming soon)
- [Spec](docs/superpowers/specs/2026-04-19-halftone-plugin-design.md) (in the private Pilot design repo)

## License

[AGPL-3.0](LICENSE). Halftone's plugin code must stay open source if redistributed or hosted as a service. Your generated sites can use any license.
