import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { convertToAstro } from "../../../src/convert/astro";
import type { ParsedPreview } from "../../../src/convert/parser";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "halftone-astro-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

const baseParsed = (): ParsedPreview => ({
  title: "Halftone portfolio",
  cssGlobal: "",
  fontLinks: [],
  hasLenis: true,
  slots: [
    { name: "hero", position: "main", innerHtml: "<h1>Hi</h1>", initBody: "gsap.from('.x', { y: 60 });" },
    { name: "primary-motion", position: "main", innerHtml: "<p>p</p>", initBody: "" },
    { name: "footer", position: "main", innerHtml: "<p>f</p>", initBody: "" },
  ],
});

describe("convertToAstro", () => {
  test("writes Hero, PrimaryMotion, FooterBlock astro components", () => {
    const r = convertToAstro(baseParsed(), dir);
    expect(r.componentsWritten).toHaveLength(3);
    expect(existsSync(join(dir, "src/components/Hero.astro"))).toBe(true);
    expect(existsSync(join(dir, "src/components/PrimaryMotion.astro"))).toBe(true);
    expect(existsSync(join(dir, "src/components/FooterBlock.astro"))).toBe(true);
  });

  test("Hero component embeds init body inside the script", () => {
    convertToAstro(baseParsed(), dir);
    const hero = readFileSync(join(dir, "src/components/Hero.astro"), "utf-8");
    expect(hero).toMatch(/<script>[\s\S]*gsap\.from/);
    expect(hero).toContain("prefers-reduced-motion");
    expect(hero).toContain('data-slot="hero"');
  });

  test("index.astro imports components and uses Layout wrapper", () => {
    convertToAstro(baseParsed(), dir);
    const page = readFileSync(join(dir, "src/pages/index.astro"), "utf-8");
    expect(page).toContain('import Layout from "../layouts/Layout.astro"');
    expect(page).toContain("import Hero");
    expect(page).toContain("<Hero />");
    expect(page).toContain('<Layout title="Halftone portfolio">');
  });

  test("Layout.astro contains Lenis bootstrap when hasLenis", () => {
    convertToAstro(baseParsed(), dir);
    const layout = readFileSync(join(dir, "src/layouts/Layout.astro"), "utf-8");
    expect(layout).toContain('import Lenis from "lenis"');
    expect(layout).toContain("new Lenis");
    expect(layout).toContain("prefers-reduced-motion");
  });

  test("Layout.astro is bare without Lenis when hasLenis is false", () => {
    const parsed = { ...baseParsed(), hasLenis: false };
    convertToAstro(parsed, dir);
    const layout = readFileSync(join(dir, "src/layouts/Layout.astro"), "utf-8");
    expect(layout).not.toContain("Lenis");
    expect(layout).toContain("<slot />");
  });

  test("package.json gets gsap + lenis", () => {
    convertToAstro(baseParsed(), dir);
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
    expect(pkg.dependencies.gsap).toBeTruthy();
    expect(pkg.dependencies.lenis).toBeTruthy();
  });
});
