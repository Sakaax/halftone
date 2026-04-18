import { describe, expect, test } from "bun:test";
import { auditResponsiveStatic } from "../../../src/audit/responsive-static";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("auditResponsiveStatic", () => {
  test("flags missing viewport meta", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-rs-"));
    mkdirSync(join(dir, "src"), { recursive: true });
    writeFileSync(join(dir, "src/index.html"), "<html><head></head><body></body></html>");
    writeFileSync(join(dir, "src/style.css"), "body { font-size: 16px; }");
    const report = auditResponsiveStatic(dir);
    const viewport = report.checks.find((c) => c.id === "viewport-meta");
    expect(viewport?.result).toBe("fail");
    rmSync(dir, { recursive: true, force: true });
  });

  test("passes with clamp() + 48px buttons + viewport", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-rs-"));
    mkdirSync(join(dir, "src"), { recursive: true });
    writeFileSync(join(dir, "src/index.html"), '<html><head><meta name="viewport" content="width=device-width"></head><body></body></html>');
    writeFileSync(join(dir, "src/style.css"), `
      :root { --type-body: clamp(1rem, 1vw, 1.2rem); }
      button { min-height: 48px; }
      @media (prefers-reduced-motion: reduce) { * { animation: none; } }
    `);
    const report = auditResponsiveStatic(dir);
    expect(report.result).toBe("pass");
    rmSync(dir, { recursive: true, force: true });
  });
});
