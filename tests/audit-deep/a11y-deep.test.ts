import { describe, expect, test } from "bun:test";

describe.skipIf(!process.env.HALFTONE_DEEP)("auditA11yDeep", () => {
  test("axe integration available", async () => {
    const { auditA11yDeep } = await import("../../src/audit/a11y-deep");
    expect(typeof auditA11yDeep).toBe("function");
  });
});
