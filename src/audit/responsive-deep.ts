import type { AuditReport, AuditCheck } from "./responsive-static";

export interface DeepAuditOptions {
  url: string;
  viewports?: Array<{ width: number; height: number }>;
}

export async function auditResponsiveDeep(opts: DeepAuditOptions): Promise<AuditReport> {
  const pw = await import("playwright");
  const viewports = opts.viewports ?? [
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 414, height: 896 },
  ];

  const browser = await pw.chromium.launch();
  const checks: AuditCheck[] = [];

  try {
    for (const vp of viewports) {
      const ctx = await browser.newContext({ viewport: vp });
      const page = await ctx.newPage();
      await page.goto(opts.url);

      // no horizontal scroll
      const scrollW = await page.evaluate<number>("document.documentElement.scrollWidth");
      const innerW = await page.evaluate<number>("window.innerWidth");
      checks.push({
        id: `no-horizontal-scroll-${vp.width}`,
        title: `no horizontal scroll at ${vp.width}px`,
        result: scrollW <= innerW ? "pass" : "fail",
        detail: scrollW > innerW ? `scrollWidth=${scrollW}, innerWidth=${innerW}` : undefined,
      });

      // tap targets
      const smallTargets = await page.evaluate<number>(
        `(() => {
          const els = document.querySelectorAll("button, a");
          let count = 0;
          els.forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.width < 48 || r.height < 48) count++;
          });
          return count;
        })()`
      );
      checks.push({
        id: `tap-targets-${vp.width}`,
        title: `tap targets ≥ 48px at ${vp.width}px`,
        result: smallTargets === 0 ? "pass" : "fail",
        detail: smallTargets > 0 ? `${smallTargets} targets below 48px` : undefined,
      });

      await ctx.close();
    }
  } finally {
    await browser.close();
  }

  const summary = {
    pass: checks.filter((c) => c.result === "pass").length,
    warn: checks.filter((c) => c.result === "warn").length,
    fail: checks.filter((c) => c.result === "fail").length,
  };

  return {
    audit: "responsive",
    mode: "deep",
    result: summary.fail === 0 ? "pass" : "fail",
    summary,
    checks,
  };
}
