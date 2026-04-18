import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { ensureGitignore } from "../../src/security/gitignore";
import { initState, transitionTo, readState } from "../../src/director/state";
import { writeDirection } from "../../src/direction/writer";
import { bundleFonts } from "../../src/fonts/bundle";
import { generateFontFaceCSS } from "../../src/fonts/fontface";
import type { Direction } from "../../src/direction/schema";

describe("end-to-end fallback workflow", () => {
  test("full brief → directions → fallback moodboard → lock → scaffold flow", async () => {
    const project = mkdtempSync(join(tmpdir(), "halftone-e2e-"));

    // 1. Init
    ensureGitignore(project);
    initState(project);
    expect(existsSync(join(project, "halftone/.state.json"))).toBe(true);
    expect(readFileSync(join(project, ".gitignore"), "utf-8")).toContain("/halftone/");

    // 2. Simulate brief phase transitions
    transitionTo(project, "brief");
    transitionTo(project, "directions", { chosen: 1 });
    transitionTo(project, "moodboard");

    // 3. Lock direction (write direction.md)
    const direction: Direction = {
      version: 1,
      mood: "editorial-warm",
      format: "studio-landing",
      framework: "sveltekit",
      palette: {
        bg: "#0F0E0C", fg: "#E8E4DE", accent: "#D4622A",
        muted: "#8B7355", border: "rgba(232,228,222,0.08)",
      },
      typography: {
        display: { family: "Newsreader", weight: 400 },
        body:    { family: "Space Grotesk", weight: 400 },
        mono:    { family: "JetBrains Mono", weight: 400 },
      },
      motion: {
        language: "pinned scroll",
        patterns: {
          hero: "heroes/asymmetric-editorial@sha256:abc",
          "primary-motion": "text-reveals/per-letter-gsap@sha256:def",
          footer: "footers/editorial-outro@sha256:ghi",
        },
      },
      moodboard: {
        source: "fallback",
        paths: ["1","2","3","4","5","6"].map((n) => `halftone/moodboard/${n}.svg`),
      },
      locked_at: new Date().toISOString(),
    };
    writeDirection(join(project, "halftone/direction.md"), direction, "# Direction\n\nRationale.");
    transitionTo(project, "locked");

    const state = readState(project);
    expect(state.current_step).toBe("locked");

    // 4. Bundle fonts (sveltekit destination)
    bundleFonts({
      projectRoot: project,
      pluginRoot: process.cwd(),
      families: [
        { family: "Newsreader", weight: 400 },
        { family: "Space Grotesk", weight: 400 },
      ],
    });
    // Font files are stub .woff2 at this phase — bundle just copies them.
    expect(existsSync(join(project, "static/fonts/newsreader/newsreader-400.woff2"))).toBe(true);

    // 5. Generate @font-face CSS
    const css = generateFontFaceCSS([
      { family: "Newsreader", weight: 400, bundled: true },
      { family: "Space Grotesk", weight: 400, bundled: true },
    ]);
    expect(css).toContain("@font-face");
    expect(css).toContain("Newsreader");

    // Cleanup
    rmSync(project, { recursive: true, force: true });
  });
});
