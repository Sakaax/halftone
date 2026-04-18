import { describe, expect, test } from "bun:test";
import { auditA11yStatic } from "../../../src/audit/a11y-static";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("auditA11yStatic", () => {
  test("flags missing alt text", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-a11y-"));
    mkdirSync(join(dir, "src"), { recursive: true });
    writeFileSync(join(dir, "src/page.html"), '<html lang="en"><body><img src="x.png"></body></html>');
    const report = auditA11yStatic(dir);
    const altCheck = report.checks.find((c) => c.id === "img-alt");
    expect(altCheck?.result).toBe("fail");
    rmSync(dir, { recursive: true, force: true });
  });

  test("passes on clean HTML", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-a11y-"));
    mkdirSync(join(dir, "src"), { recursive: true });
    writeFileSync(join(dir, "src/page.html"), '<html lang="en"><body><a href="#main">Skip</a><nav></nav><main id="main"><img src="x.png" alt="x"></main><footer></footer></body></html>');
    writeFileSync(join(dir, "src/style.css"), `:focus-visible { outline: 2px solid blue; }`);
    const report = auditA11yStatic(dir);
    expect(report.result).toBe("pass");
    rmSync(dir, { recursive: true, force: true });
  });
});
