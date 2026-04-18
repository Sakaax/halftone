import { describe, expect, test } from "bun:test";
import { generateFontFaceCSS } from "../../../src/fonts/fontface";

describe("generateFontFaceCSS", () => {
  test("emits @font-face for bundled family", () => {
    const css = generateFontFaceCSS([
      { family: "Newsreader", weight: 400, bundled: true },
    ]);
    expect(css).toContain("@font-face");
    expect(css).toContain("font-family: \"Newsreader\"");
    expect(css).toContain("/fonts/newsreader/newsreader-400.woff2");
    expect(css).toContain("font-display: swap");
  });
  test("emits stub comment for paid family", () => {
    const css = generateFontFaceCSS([
      { family: "PP Editorial New", weight: 400, bundled: false, purchaseUrl: "https://pangrampangram.com/products/editorial-new" },
    ]);
    expect(css).toContain("paid license");
    expect(css).toContain("https://pangrampangram.com/products/editorial-new");
  });
});
