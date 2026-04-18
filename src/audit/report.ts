import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import type { AuditReport } from "./responsive-static";

export function writeAuditReport(projectRoot: string, report: AuditReport): void {
  mkdirSync(join(projectRoot, "halftone/audit"), { recursive: true });
  const filename = `${report.audit}.md`;
  const path = join(projectRoot, "halftone/audit", filename);

  const fm = [
    "---",
    `audit: ${report.audit}`,
    `run_at: ${new Date().toISOString()}`,
    `mode: ${report.mode}`,
    `result: ${report.result}`,
    `summary:`,
    `  pass: ${report.summary.pass}`,
    `  warn: ${report.summary.warn}`,
    `  fail: ${report.summary.fail}`,
    "---",
    "",
  ].join("\n");

  const checks = report.checks.map((c) => {
    const mark = c.result === "pass" ? "✓" : c.result === "warn" ? "⚠" : "✗";
    const detail = c.detail ? ` — ${c.detail}` : "";
    return `- ${mark} **${c.id}**: ${c.title}${detail}`;
  }).join("\n");

  const body = [
    `# ${report.audit === "responsive" ? "Responsive" : "A11y"} Audit Report`,
    "",
    "## Checks",
    "",
    checks,
    "",
  ].join("\n");

  writeFileSync(path, fm + body, "utf-8");
}
