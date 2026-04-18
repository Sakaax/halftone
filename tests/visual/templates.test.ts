import { describe, expect, test } from "bun:test";

describe.skipIf(!process.env.HALFTONE_VISUAL)("visual regression (smoke)", () => {
  test("screenshot harness exists", async () => {
    const { captureScreenshot } = await import("./screenshot-harness");
    expect(typeof captureScreenshot).toBe("function");
  });
});
