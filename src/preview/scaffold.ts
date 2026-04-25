import type { SlotName } from "../types";
import {
  SLOT_INIT_FN,
  type PreviewScaffoldInput,
  type PreviewScaffoldOutput,
} from "./types";

const GSAP_VERSION = "3.12.5";
const LENIS_VERSION = "1.0.42";

const GSAP_CDN = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/gsap.min.js`;
const SCROLLTRIGGER_CDN = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/ScrollTrigger.min.js`;
const LENIS_CDN = `https://cdn.jsdelivr.net/npm/@studio-freight/lenis@${LENIS_VERSION}/dist/lenis.min.js`;

const REQUIRED_SLOTS: SlotName[] = ["hero", "primary-motion", "footer"];

export function buildScaffold(input: PreviewScaffoldInput): PreviewScaffoldOutput {
  const slots = orderSlots(dedupeRequired(input.slots));
  return {
    html: renderHtml(input.title, slots, input.displayFontHref, input.bodyFontHref),
    css: renderCss(),
    js: renderJs(slots),
  };
}

function dedupeRequired(slots: SlotName[]): SlotName[] {
  const set = new Set<SlotName>(slots);
  for (const required of REQUIRED_SLOTS) set.add(required);
  return Array.from(set);
}

function orderSlots(slots: SlotName[]): SlotName[] {
  const order: SlotName[] = ["cursor", "hero", "primary-motion", "transition", "footer"];
  return order.filter((s) => slots.includes(s));
}

function renderHtml(
  title: string,
  slots: SlotName[],
  displayFontHref?: string,
  bodyFontHref?: string
): string {
  const fontLinks = [displayFontHref, bodyFontHref]
    .filter((h): h is string => Boolean(h))
    .map((h) => `  <link rel="stylesheet" href="${h}">`)
    .join("\n");

  const sections = slots
    .filter((s) => s !== "cursor" && s !== "transition")
    .map((s) => `    <section data-slot="${s}"></section>`)
    .join("\n");

  const overlays = slots
    .filter((s) => s === "cursor" || s === "transition")
    .map((s) => `  <div data-slot="${s}" aria-hidden="true"></div>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
${fontLinks}
  <link rel="stylesheet" href="./styles.css">
  <script defer src="${GSAP_CDN}"></script>
  <script defer src="${SCROLLTRIGGER_CDN}"></script>
  <script defer src="${LENIS_CDN}"></script>
  <script defer src="./motion.js"></script>
</head>
<body>
${overlays}
  <main id="main-content">
${sections}
  </main>
</body>
</html>
`;
}

function renderCss(): string {
  return `:root {
  --bg: #0F0E0C;
  --fg: #E8E4DE;
  --accent: #D4622A;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--bg);
  color: var(--fg);
  min-height: 100%;
}

main { min-height: 100vh; }

[data-slot] { position: relative; }
`;
}

function renderJs(slots: SlotName[]): string {
  const initFns = slots.map((s) => SLOT_INIT_FN[s]);

  const initBodies = initFns
    .map(
      (fn) => `function ${fn}() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // motion authored per slot
}`
    )
    .join("\n\n");

  const calls = initFns.map((fn) => `  ${fn}();`).join("\n");

  return `${initBodies}

document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.Lenis && !reduced) {
    const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }
${calls}
});
`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
