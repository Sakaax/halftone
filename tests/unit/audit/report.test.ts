import { describe, expect, test } from "bun:test";
import { writeAuditReport } from "../../../src/audit/report";
import { mkdtempSync, rmSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import type { AuditReport } from "../../../src/audit/responsive-static";

describe("writeAuditReport", () => {
  test("writes responsive report with frontmatter", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-rr-"));
    const report: AuditReport = {
      audit: "responsive",
      mode: "static",
      result: "pass",
      summary: { pass: 5, warn: 0, fail: 0 },
      checks: [{ id: "viewport-meta", title: "viewport", result: "pass" }],
    };
    writeAuditReport(dir, report);
    const raw = readFileSync(join(dir, "halftone/audit/responsive.md"), "utf-8");
    expect(raw).toContain("audit: responsive");
    expect(raw).toContain("result: pass");
    expect(raw).toContain("viewport-meta");
    rmSync(dir, { recursive: true, force: true });
  });
});
