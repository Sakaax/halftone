import { describe, expect, test } from "bun:test";
import { DirectionSchema } from "../../../src/direction/schema";

const valid = {
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
    language: "pinned scroll + per-letter reveal",
    patterns: {
      hero: "heroes/asymmetric-editorial@sha256:abc",
      "primary-motion": "text-reveals/per-letter-gsap@sha256:def",
      footer: "footers/editorial-outro@sha256:ghi",
    },
  },
  moodboard: {
    source: "fallback",
    paths: [
      "halftone/moodboard/hero-bg.svg",
      "halftone/moodboard/texture.svg",
      "halftone/moodboard/ambient.svg",
      "halftone/moodboard/detail.svg",
      "halftone/moodboard/portrait.svg",
      "halftone/moodboard/abstract.svg",
    ],
  },
  locked_at: "2026-04-19T16:30:00Z",
};

describe("DirectionSchema", () => {
  test("accepts valid direction", () => {
    const parsed = DirectionSchema.parse(valid);
    expect(parsed.framework).toBe("sveltekit");
  });
  test("rejects invalid framework", () => {
    const invalid = { ...valid, framework: "nextjs" };
    expect(() => DirectionSchema.parse(invalid)).toThrow();
  });
  test("requires exactly 6 moodboard paths", () => {
    const invalid = { ...valid, moodboard: { ...valid.moodboard, paths: ["only", "two"] } };
    expect(() => DirectionSchema.parse(invalid)).toThrow();
  });
  test("requires hero + primary-motion + footer patterns", () => {
    const invalid = {
      ...valid,
      motion: { ...valid.motion, patterns: { hero: "x@sha256:a" } },
    };
    expect(() => DirectionSchema.parse(invalid)).toThrow();
  });
});
