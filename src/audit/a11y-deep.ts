import type { AuditReport, AuditCheck } from "./responsive-static";

export async function auditA11yDeep(opts: { url: string }): Promise<AuditReport> {
  const pw = await import("playwright");
  const { AxeBuilder } = await import("@axe-core/playwright");

  const browser = await pw.chromium.launch();
  const checks: AuditCheck[] = [];

  try {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(opts.url);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    for (const v of results.violations) {
      const impact = v.impact ?? "minor";
      const result: "fail" | "warn" =
        impact === "critical" || impact === "serious" ? "fail" : "warn";
      checks.push({
        id: `axe-${v.id}`,
        title: v.help,
        result,
        detail: `${v.nodes.length} nodes; impact=${impact}`,
      });
    }
  } finally {
    await browser.close();
  }

  const summary = {
    pass: 0,
    warn: checks.filter((c) => c.result === "warn").length,
    fail: checks.filter((c) => c.result === "fail").length,
  };

  return {
    audit: "a11y",
    mode: "deep",
    result: summary.fail === 0 ? "pass" : "fail",
    summary,
    checks,
  };
}
