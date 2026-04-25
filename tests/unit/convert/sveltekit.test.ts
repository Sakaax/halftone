import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { convertToSvelteKit } from "../../../src/convert/sveltekit";
import type { ParsedPreview } from "../../../src/convert/parser";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "halftone-sk-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

const baseParsed = (): ParsedPreview => ({
  title: "Halftone studio",
  cssGlobal: ":root { --bg: #0F0E0C; }",
  fontLinks: [],
  hasLenis: true,
  slots: [
    {
      name: "hero",
      position: "main",
      innerHtml: '<h1>Studio</h1>',
      initBody: 'gsap.from(".hero h1", { y: 60 });',
    },
    {
      name: "primary-motion",
      position: "main",
      innerHtml: '<p>scroll</p>',
      initBody: '',
    },
    {
      name: "footer",
      position: "main",
      innerHtml: '<p>end</p>',
      initBody: '',
    },
  ],
});

describe("convertToSvelteKit", () => {
  test("writes Hero, PrimaryMotion, FooterBlock components", () => {
    const r = convertToSvelteKit(baseParsed(), dir);
    expect(r.componentsWritten).toHaveLength(3);
    expect(existsSync(join(dir, "src/lib/components/Hero.svelte"))).toBe(true);
    expect(existsSync(join(dir, "src/lib/components/PrimaryMotion.svelte"))).toBe(true);
    expect(existsSync(join(dir, "src/lib/components/FooterBlock.svelte"))).toBe(true);
  });

  test("Hero component embeds the init body in onMount", () => {
    convertToSvelteKit(baseParsed(), dir);
    const hero = readFileSync(join(dir, "src/lib/components/Hero.svelte"), "utf-8");
    expect(hero).toContain("onMount(() =>");
    expect(hero).toContain('gsap.from(".hero h1"');
    expect(hero).toContain("prefers-reduced-motion");
  });

  test("Hero component preserves the slot innerHTML", () => {
    convertToSvelteKit(baseParsed(), dir);
    const hero = readFileSync(join(dir, "src/lib/components/Hero.svelte"), "utf-8");
    expect(hero).toContain("<h1>Studio</h1>");
    expect(hero).toContain('data-slot="hero"');
  });

  test("+page.svelte imports and instantiates every component", () => {
    convertToSvelteKit(baseParsed(), dir);
    const page = readFileSync(join(dir, "src/routes/+page.svelte"), "utf-8");
    expect(page).toContain("import Hero");
    expect(page).toContain("<Hero />");
    expect(page).toContain("<PrimaryMotion />");
    expect(page).toContain("<FooterBlock />");
    expect(page).toContain('id="main-content"');
  });

  test("+layout.svelte adds Lenis bootstrap when hasLenis is true", () => {
    convertToSvelteKit(baseParsed(), dir);
    const layout = readFileSync(join(dir, "src/routes/+layout.svelte"), "utf-8");
    expect(layout).toContain('import Lenis from "lenis"');
    expect(layout).toContain("new Lenis");
    expect(layout).toContain("prefers-reduced-motion");
    expect(layout).toContain("requestAnimationFrame(raf)");
  });

  test("+layout.svelte stays minimal when hasLenis is false", () => {
    const parsed = { ...baseParsed(), hasLenis: false };
    convertToSvelteKit(parsed, dir);
    const layout = readFileSync(join(dir, "src/routes/+layout.svelte"), "utf-8");
    expect(layout).not.toContain("Lenis");
    expect(layout).toContain("<slot />");
  });

  test("creates a fresh package.json with gsap + lenis when missing", () => {
    convertToSvelteKit(baseParsed(), dir);
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.dependencies.gsap).toBeTruthy();
    expect(pkg.dependencies.lenis).toBeTruthy();
  });

  test("preserves existing dependencies when adding gsap/lenis", () => {
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "x", dependencies: { svelte: "^5.0.0" } }, null, 2),
      "utf-8"
    );
    convertToSvelteKit(baseParsed(), dir);
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.dependencies.svelte).toBe("^5.0.0");
    expect(pkg.dependencies.gsap).toBeTruthy();
  });

  test("overlay slots become divs not sections", () => {
    const parsed = baseParsed();
    parsed.slots.push({
      name: "cursor",
      position: "overlay",
      innerHtml: "",
      initBody: "",
    });
    convertToSvelteKit(parsed, dir);
    const cursor = readFileSync(join(dir, "src/lib/components/CursorOverlay.svelte"), "utf-8");
    expect(cursor).toContain("<div data-slot=\"cursor\"");
    expect(cursor).toContain('aria-hidden="true"');
    expect(cursor).not.toMatch(/<section/);
  });
});
