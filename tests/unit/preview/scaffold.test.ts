import { describe, expect, test } from "bun:test";
import { buildScaffold } from "../../../src/preview/scaffold";

describe("buildScaffold", () => {
  test("includes the three required slots even if not requested", () => {
    const out = buildScaffold({ title: "Halftone", slots: [] });
    expect(out.html).toContain('data-slot="hero"');
    expect(out.html).toContain('data-slot="primary-motion"');
    expect(out.html).toContain('data-slot="footer"');
  });

  test("includes optional slots when requested", () => {
    const out = buildScaffold({
      title: "Halftone",
      slots: ["hero", "primary-motion", "footer", "cursor", "transition"],
    });
    expect(out.html).toContain('data-slot="cursor"');
    expect(out.html).toContain('data-slot="transition"');
  });

  test("includes GSAP, ScrollTrigger, and Lenis CDN scripts", () => {
    const out = buildScaffold({ title: "Halftone", slots: [] });
    expect(out.html).toContain("gsap@3.12.5/dist/gsap.min.js");
    expect(out.html).toContain("ScrollTrigger.min.js");
    expect(out.html).toContain("@studio-freight/lenis@");
  });

  test("links external stylesheet and script files", () => {
    const out = buildScaffold({ title: "Halftone", slots: [] });
    expect(out.html).toContain('href="./styles.css"');
    expect(out.html).toContain('src="./motion.js"');
  });

  test("escapes HTML in the title", () => {
    const out = buildScaffold({ title: "<x&y>", slots: [] });
    expect(out.html).toContain("&lt;x&amp;y&gt;");
    expect(out.html).not.toContain("<x&y>");
  });

  test("renders one initX function per slot", () => {
    const out = buildScaffold({
      title: "Halftone",
      slots: ["hero", "primary-motion", "footer"],
    });
    expect(out.js).toContain("function initHero()");
    expect(out.js).toContain("function initPrimaryMotion()");
    expect(out.js).toContain("function initFooter()");
  });

  test("init functions short-circuit on prefers-reduced-motion", () => {
    const out = buildScaffold({ title: "Halftone", slots: [] });
    const initHero = out.js.match(/function initHero\(\)\s*{[^}]+}/);
    expect(initHero).not.toBeNull();
    expect(initHero![0]).toContain("prefers-reduced-motion");
  });

  test("DOMContentLoaded boots Lenis raf and registers ScrollTrigger", () => {
    const out = buildScaffold({ title: "Halftone", slots: [] });
    expect(out.js).toContain("DOMContentLoaded");
    expect(out.js).toContain("new window.Lenis");
    expect(out.js).toContain("requestAnimationFrame(raf)");
    expect(out.js).toContain("registerPlugin(window.ScrollTrigger)");
  });

  test("CSS includes a prefers-reduced-motion guard", () => {
    const out = buildScaffold({ title: "Halftone", slots: [] });
    expect(out.css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  test("optional font links are injected when provided", () => {
    const out = buildScaffold({
      title: "Halftone",
      slots: [],
      displayFontHref: "https://fonts.googleapis.com/css2?family=Newsreader",
      bodyFontHref: "https://fonts.googleapis.com/css2?family=Space+Grotesk",
    });
    expect(out.html).toContain("Newsreader");
    expect(out.html).toContain("Space+Grotesk");
  });
});
