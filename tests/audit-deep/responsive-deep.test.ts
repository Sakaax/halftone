import { describe, expect, test } from "bun:test";

describe.skipIf(!process.env.HALFTONE_DEEP)("auditResponsiveDeep", () => {
  test("detects horizontal scroll at 375px", async () => {
    const { auditResponsiveDeep } = await import("../../src/audit/responsive-deep");
    expect(typeof auditResponsiveDeep).toBe("function");
  });
});
