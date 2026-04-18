import { describe, expect, test } from "bun:test";
import { MoodSchema } from "../../../src/moods/schema";

const valid = {
  slug: "editorial-warm",
  name: "Editorial Warm",
  description: "Warm browns.",
  palette: {
    bg: "#0F0E0C", fg: "#E8E4DE", accent: "#D4622A",
    muted: "#8B7355", border: "rgba(232,228,222,0.08)",
  },
  typography_options: [
    {
      display: { family: "PP Editorial New", weights: [400, 700] },
      body: { family: "Space Grotesk", weights: [400] },
      mono: { family: "JetBrains Mono", weights: [400] },
    },
  ],
  fallback_assets_dir: "fallback-assets/editorial-warm",
  motion_affinity: ["text-reveal"],
  format_affinity: ["studio-landing"],
};

describe("MoodSchema", () => {
  test("accepts valid mood", () => {
    const parsed = MoodSchema.parse(valid);
    expect(parsed.slug).toBe("editorial-warm");
  });
  test("rejects missing palette", () => {
    const invalid = { ...valid, palette: undefined };
    expect(() => MoodSchema.parse(invalid)).toThrow();
  });
  test("requires >=1 typography_options", () => {
    const invalid = { ...valid, typography_options: [] };
    expect(() => MoodSchema.parse(invalid)).toThrow();
  });
  test("rejects unknown mood slug", () => {
    const invalid = { ...valid, slug: "neon-overload" };
    expect(() => MoodSchema.parse(invalid)).toThrow();
  });
});
