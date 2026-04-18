import { describe, expect, test } from "bun:test";
import { paletteToCSSVars, contrastRatio } from "../../../src/moods/palette";

describe("paletteToCSSVars", () => {
  test("converts palette tokens to CSS custom properties", () => {
    const vars = paletteToCSSVars({
      bg: "#0F0E0C", fg: "#E8E4DE", accent: "#D4622A",
      muted: "#8B7355", border: "rgba(232,228,222,0.08)",
    });
    expect(vars).toContain("--bg: #0F0E0C;");
    expect(vars).toContain("--accent: #D4622A;");
  });
});

describe("contrastRatio", () => {
  test("black on white = ~21", () => {
    const r = contrastRatio("#000000", "#FFFFFF");
    expect(r).toBeGreaterThan(20);
  });
  test("same color = 1", () => {
    const r = contrastRatio("#888888", "#888888");
    expect(r).toBeCloseTo(1, 1);
  });
});
