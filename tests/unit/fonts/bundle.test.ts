import { describe, expect, test } from "bun:test";
import { bundleFonts, familyToSlug } from "../../../src/fonts/bundle";
import { mkdtempSync, rmSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("familyToSlug", () => {
  test("PP Editorial New → pp-editorial-new", () => {
    expect(familyToSlug("PP Editorial New")).toBe("pp-editorial-new");
  });
  test("Space Grotesk → space-grotesk", () => {
    expect(familyToSlug("Space Grotesk")).toBe("space-grotesk");
  });
});

describe("bundleFonts", () => {
  test("copies only requested families", () => {
    const project = mkdtempSync(join(tmpdir(), "halftone-fb-"));
    bundleFonts({
      projectRoot: project,
      pluginRoot: process.cwd(),
      families: [
        { family: "Newsreader", weight: 400 },
        { family: "Space Grotesk", weight: 400 },
      ],
    });
    expect(existsSync(join(project, "static/fonts/newsreader/newsreader-400.woff2"))).toBe(true);
    expect(existsSync(join(project, "static/fonts/space-grotesk/space-grotesk-400.woff2"))).toBe(true);
    expect(existsSync(join(project, "static/fonts/jetbrains-mono/jetbrains-mono-400.woff2"))).toBe(false);
    rmSync(project, { recursive: true, force: true });
  });
});
