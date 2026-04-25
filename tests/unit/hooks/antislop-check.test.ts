import { describe, expect, test } from "bun:test";
import { runChecks, isInScope } from "../../../hooks/antislop-check";

describe("isInScope", () => {
  test("matches files inside halftone/preview/", () => {
    expect(isInScope("/x/y/halftone/preview/index.html")).toBe(true);
    expect(isInScope("project/halftone/preview/styles.css")).toBe(true);
    expect(isInScope("halftone/preview/motion.js")).toBe(true);
  });

  test("rejects files outside halftone/preview/", () => {
    expect(isInScope("/x/y/halftone/audit/report.html")).toBe(false);
    expect(isInScope("/x/y/src/index.ts")).toBe(false);
    expect(isInScope("/x/y/halftone/direction.md")).toBe(false);
  });

  test("rejects empty path", () => {
    expect(isInScope("")).toBe(false);
  });

  test("normalizes Windows-style separators", () => {
    expect(isInScope("C:\\proj\\halftone\\preview\\index.html")).toBe(true);
  });
});

describe("runChecks — blocking violations", () => {
  test("flags Inter as banned font in CSS", () => {
    const css = `body { font-family: "Inter", sans-serif; }`;
    const r = runChecks("halftone/preview/styles.css", css);
    expect(r.blocking.some((s) => s.includes("Inter"))).toBe(true);
  });

  test("flags Roboto in HTML link", () => {
    const html = `<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400" rel="stylesheet">`;
    const r = runChecks("halftone/preview/index.html", html);
    expect(r.blocking.some((s) => s.includes("Roboto"))).toBe(true);
  });

  test("flags Helvetica Neue with whitespace tolerance", () => {
    const css = `h1 { font-family: 'Helvetica Neue', sans-serif; }`;
    const r = runChecks("halftone/preview/styles.css", css);
    expect(r.blocking.some((s) => s.includes("Helvetica Neue"))).toBe(true);
  });

  test("flags purple-to-pink gradient", () => {
    const css = `.hero { background: linear-gradient(45deg, purple, pink); }`;
    const r = runChecks("halftone/preview/styles.css", css);
    expect(r.blocking.some((s) => s.includes("purple-to-pink"))).toBe(true);
  });

  test("flags rainbow gradient (4+ stops)", () => {
    const css = `.x { background: linear-gradient(red, orange, yellow, green, blue); }`;
    const r = runChecks("halftone/preview/styles.css", css);
    expect(r.blocking.some((s) => s.includes("rainbow"))).toBe(true);
  });

  test("flags neon text-glow", () => {
    const css = `h1 { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff; }`;
    const r = runChecks("halftone/preview/styles.css", css);
    expect(r.blocking.some((s) => s.includes("neon"))).toBe(true);
  });

  test("flags Tailwind default bg-blue-500", () => {
    const html = `<div class="bg-blue-500 text-white">x</div>`;
    const r = runChecks("halftone/preview/index.html", html);
    expect(r.blocking.some((s) => s.includes("Tailwind default"))).toBe(true);
  });

  test("flags Tailwind default text-purple-600", () => {
    const html = `<a class="text-purple-600">link</a>`;
    const r = runChecks("halftone/preview/index.html", html);
    expect(r.blocking.some((s) => s.includes("Tailwind default"))).toBe(true);
  });
});

describe("runChecks — warnings", () => {
  test("warns on generic hero structure", () => {
    const html = `<section data-slot="hero">
      <h1>Build something</h1>
      <p>Subtitle goes here</p>
      <button>Get started</button>
    </section>`;
    const r = runChecks("halftone/preview/index.html", html);
    expect(r.blocking).toHaveLength(0);
    expect(r.warnings.some((w) => w.includes("Generic hero"))).toBe(true);
  });

  test("warns on motion without reduced-motion guard", () => {
    const js = `function init() { gsap.to('.x', { y: 100 }); }`;
    const r = runChecks("halftone/preview/motion.js", js);
    expect(r.warnings.some((w) => w.includes("prefers-reduced-motion"))).toBe(true);
  });

  test("does not warn when reduced-motion guard exists", () => {
    const js = `function init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.to('.x', { y: 100 });
    }`;
    const r = runChecks("halftone/preview/motion.js", js);
    expect(r.warnings).toHaveLength(0);
  });
});

describe("runChecks — clean files", () => {
  test("returns no violations for an editorial-warm preview", () => {
    const css = `:root { --bg: #0F0E0C; --fg: #E8E4DE; --accent: #D4622A; }
@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }
body { font-family: 'Newsreader', serif; background: var(--bg); color: var(--fg); }`;
    const r = runChecks("halftone/preview/styles.css", css);
    expect(r.blocking).toHaveLength(0);
    expect(r.warnings).toHaveLength(0);
  });
});

describe("runChecks — performance", () => {
  test("100 sequential runs stay well under the per-write budget", () => {
    // Spec says <500ms per write; 100 runs in <2000ms means <20ms p100.
    const css = `body { font-family: 'Newsreader', serif; background: #0F0E0C; }`;
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      runChecks("halftone/preview/styles.css", css);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });
});
