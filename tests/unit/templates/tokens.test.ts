import { describe, expect, test } from "bun:test";
import { injectTokens } from "../../../src/templates/tokens";
import { TokenUnresolvedError } from "../../../src/types";
import type { Direction } from "../../../src/direction/schema";

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
    display: { family: "PP Editorial New", weight: 400 },
    body:    { family: "Space Grotesk",    weight: 400 },
    mono:    { family: "JetBrains Mono",   weight: 400 },
  },
  motion: {
    language: "pinned scroll",
    patterns: {
      hero: "heroes/x@sha256:a",
      "primary-motion": "text-reveals/y@sha256:b",
      footer: "footers/z@sha256:c",
    },
  },
  moodboard: {
    source: "fallback",
    paths: ["1","2","3","4","5","6"].map((n) => `halftone/moodboard/${n}.svg`),
  },
  locked_at: "2026-04-19T00:00:00Z",
};

describe("injectTokens", () => {
  test("replaces palette tokens", () => {
    const out = injectTokens("background: {{tokens.palette.accent}};", direction);
    expect(out).toBe("background: #D4622A;");
  });
  test("replaces typography family + weight", () => {
    const out = injectTokens(
      "font: {{tokens.typography.display.weight}} 2rem {{tokens.typography.display.family}};",
      direction
    );
    expect(out).toBe("font: 400 2rem PP Editorial New;");
  });
  test("replaces motion.language", () => {
    const out = injectTokens("/* {{tokens.motion.language}} */", direction);
    expect(out).toBe("/* pinned scroll */");
  });
  test("throws on invalid path", () => {
    expect(() => injectTokens("{{tokens.bogus.path}}", direction)).toThrow(TokenUnresolvedError);
  });
});
