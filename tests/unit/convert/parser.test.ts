import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { parsePreview, extractInitBody } from "../../../src/convert/parser";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "halftone-parser-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function writePreview(html: string, css = "", js = ""): string {
  const previewDir = join(dir, "preview");
  mkdirSync(previewDir, { recursive: true });
  writeFileSync(join(previewDir, "index.html"), html, "utf-8");
  writeFileSync(join(previewDir, "styles.css"), css, "utf-8");
  writeFileSync(join(previewDir, "motion.js"), js, "utf-8");
  return previewDir;
}

describe("extractInitBody", () => {
  test("extracts a single function body", () => {
    const js = `function initHero() {
  gsap.to('.x', { y: 100 });
}`;
    expect(extractInitBody(js, "initHero")).toContain("gsap.to");
  });

  test("returns empty string when function is missing", () => {
    expect(extractInitBody("// nothing", "initHero")).toBe("");
  });

  test("handles nested braces", () => {
    const js = `function initHero() {
  if (true) { console.log('nested'); }
  const o = { a: 1 };
}`;
    const body = extractInitBody(js, "initHero");
    expect(body).toContain("nested");
    expect(body).toContain("const o");
  });

  test("does not bleed into next function", () => {
    const js = `function initHero() {
  one();
}
function initFooter() {
  two();
}`;
    const body = extractInitBody(js, "initHero");
    expect(body).toContain("one()");
    expect(body).not.toContain("two()");
  });
});

describe("parsePreview", () => {
  test("returns three slots from a minimal preview", () => {
    const html = `<!doctype html><html><head><title>X</title></head><body>
<main>
  <section data-slot="hero"><h1>Hi</h1></section>
  <section data-slot="primary-motion"><p>scroll</p></section>
  <section data-slot="footer"><p>end</p></section>
</main></body></html>`;
    const previewDir = writePreview(html);
    const parsed = parsePreview(previewDir);
    expect(parsed.slots.map((s) => s.name)).toEqual([
      "hero",
      "primary-motion",
      "footer",
    ]);
    expect(parsed.title).toBe("X");
  });

  test("captures overlay slots (cursor, transition) when divs", () => {
    const html = `<!doctype html><html><head><title>X</title></head><body>
<div data-slot="cursor" aria-hidden="true"></div>
<div data-slot="transition" aria-hidden="true"></div>
<main>
  <section data-slot="hero"></section>
  <section data-slot="primary-motion"></section>
  <section data-slot="footer"></section>
</main></body></html>`;
    const previewDir = writePreview(html);
    const parsed = parsePreview(previewDir);
    const cursor = parsed.slots.find((s) => s.name === "cursor");
    const transition = parsed.slots.find((s) => s.name === "transition");
    expect(cursor?.position).toBe("overlay");
    expect(transition?.position).toBe("overlay");
  });

  test("attaches initX body per slot", () => {
    const html = `<!doctype html><html><head><title>X</title></head><body>
<main>
  <section data-slot="hero"></section>
  <section data-slot="primary-motion"></section>
  <section data-slot="footer"></section>
</main></body></html>`;
    const js = `function initHero() {
  gsap.from('.hero h1', { y: 60, opacity: 0 });
}
function initPrimaryMotion() {
  ScrollTrigger.create({ trigger: '.x' });
}
function initFooter() {}`;
    const previewDir = writePreview(html, "", js);
    const parsed = parsePreview(previewDir);
    expect(parsed.slots.find((s) => s.name === "hero")?.initBody).toContain("gsap.from");
    expect(parsed.slots.find((s) => s.name === "primary-motion")?.initBody).toContain("ScrollTrigger");
    expect(parsed.slots.find((s) => s.name === "footer")?.initBody).toBe("");
  });

  test("flags hasLenis when motion.js boots Lenis", () => {
    const html = `<!doctype html><html><head><title>X</title></head><body>
<main><section data-slot="hero"></section><section data-slot="primary-motion"></section><section data-slot="footer"></section></main>
</body></html>`;
    const js = `const lenis = new window.Lenis({});`;
    const previewDir = writePreview(html, "", js);
    expect(parsePreview(previewDir).hasLenis).toBe(true);
  });

  test("collects external font links and ignores local stylesheets", () => {
    const html = `<!doctype html><html><head>
<title>X</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader">
<link rel="stylesheet" href="./styles.css">
</head><body>
<main><section data-slot="hero"></section><section data-slot="primary-motion"></section><section data-slot="footer"></section></main>
</body></html>`;
    const previewDir = writePreview(html);
    const parsed = parsePreview(previewDir);
    expect(parsed.fontLinks).toHaveLength(1);
    expect(parsed.fontLinks[0]).toContain("Newsreader");
  });

  test("throws when index.html is missing", () => {
    const previewDir = join(dir, "missing");
    mkdirSync(previewDir, { recursive: true });
    expect(() => parsePreview(previewDir)).toThrow(/Preview HTML not found/);
  });
});
