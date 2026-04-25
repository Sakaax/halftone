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

describe("end-to-end v0.2 workflow (preview-led)", () => {
  test("init → brief → directions → preview → framework_chosen → converted → fonts bundled", async () => {
    const project = mkdtempSync(join(tmpdir(), "halftone-e2e-"));

    // 1. Init
    ensureGitignore(project);
    initState(project);
    expect(existsSync(join(project, "halftone/.state.json"))).toBe(true);
    const gi = readFileSync(join(project, ".gitignore"), "utf-8");
    expect(gi).toContain("/halftone/preview/");

    // 2. v0.2 step transitions
    transitionTo(project, "brief");
    transitionTo(project, "directions", { chosen: 1 });
    transitionTo(project, "preview");
    transitionTo(project, "framework_chosen");

    // 3. Persist chosen direction (no moodboard section in v0.2)
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
      locked_at: new Date().toISOString(),
    };
    writeDirection(join(project, "halftone/direction.md"), direction, "# Direction\n\nRationale.");
    transitionTo(project, "converted");

    const state = readState(project);
    expect(state.current_step).toBe("converted");

    // 4. Bundle fonts (sveltekit destination)
    bundleFonts({
      projectRoot: project,
      pluginRoot: process.cwd(),
      families: [
        { family: "Newsreader", weight: 400 },
        { family: "Space Grotesk", weight: 400 },
      ],
    });
    expect(existsSync(join(project, "static/fonts/newsreader/newsreader-400.woff2"))).toBe(true);

    // 5. Generate @font-face CSS
    const css = generateFontFaceCSS([
      { family: "Newsreader", weight: 400, bundled: true },
      { family: "Space Grotesk", weight: 400, bundled: true },
    ]);
    expect(css).toContain("@font-face");
    expect(css).toContain("Newsreader");

    rmSync(project, { recursive: true, force: true });
  });
});
