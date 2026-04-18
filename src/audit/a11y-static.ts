import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { parse as parseHTML } from "node-html-parser";
import type { AuditCheck, AuditReport } from "./responsive-static";

function walk(dir: string, exts: Set<string>): string[] {
  const out: string[] = [];
  function recurse(d: string) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      try {
        if (statSync(p).isDirectory()) recurse(p);
        else {
          const dot = e.lastIndexOf(".");
          if (dot >= 0 && exts.has(e.slice(dot))) out.push(p);
        }
      } catch { /* ignore */ }
    }
  }
  recurse(dir);
  return out;
}

export function auditA11yStatic(projectRoot: string): AuditReport {
  const checks: AuditCheck[] = [];
  const htmls = walk(projectRoot, new Set([".html", ".svelte", ".astro"]));
  const csses = walk(projectRoot, new Set([".css", ".scss"]));

  // 1. alt=
  let allAlt = true;
  for (const p of htmls) {
    const root = parseHTML(readFileSync(p, "utf-8"));
    for (const img of root.querySelectorAll("img")) {
      const alt = img.getAttribute("alt");
      if (alt === undefined || alt === null) { allAlt = false; break; }
    }
    if (!allAlt) break;
  }
  checks.push({ id: "img-alt", title: "all <img> have alt=", result: allAlt ? "pass" : "fail" });

  // 2. html lang
  let hasLang = true;
  for (const p of htmls) {
    const content = readFileSync(p, "utf-8");
    if (!/<html[^>]*lang=/i.test(content)) { hasLang = false; break; }
  }
  checks.push({ id: "html-lang", title: "<html lang> set", result: hasLang ? "pass" : "fail" });

  // 3. focus styles present
  let hasFocus = false;
  for (const p of csses) {
    const content = readFileSync(p, "utf-8");
    if (/:focus(-visible)?\s*\{[^}]*outline[^:]*:[^;}]+/.test(content)) { hasFocus = true; break; }
  }
  checks.push({ id: "focus-styles", title: "focus-visible outline defined", result: hasFocus ? "pass" : "warn" });

  // 4. skip link
  let hasSkip = false;
  for (const p of htmls) {
    const content = readFileSync(p, "utf-8");
    if (/<a[^>]+href=["']#main[-_ ]?content?["'][^>]*>/i.test(content) ||
        /<a[^>]+href=["']#main["'][^>]*>/i.test(content)) { hasSkip = true; break; }
  }
  checks.push({ id: "skip-link", title: "skip-link present", result: hasSkip ? "pass" : "warn" });

  // 5. semantic landmarks
  let hasNav = false, hasMain = false, hasFooter = false;
  for (const p of htmls) {
    const content = readFileSync(p, "utf-8");
    if (/<nav\b/i.test(content)) hasNav = true;
    if (/<main\b/i.test(content)) hasMain = true;
    if (/<footer\b/i.test(content)) hasFooter = true;
  }
  checks.push({
    id: "landmarks",
    title: "nav/main/footer landmarks present",
    result: (hasNav && hasMain && hasFooter) ? "pass" : "warn"
  });

  const summary = {
    pass: checks.filter((c) => c.result === "pass").length,
    warn: checks.filter((c) => c.result === "warn").length,
    fail: checks.filter((c) => c.result === "fail").length,
  };

  return {
    audit: "a11y",
    mode: "static",
    result: summary.fail === 0 ? "pass" : "fail",
    summary,
    checks,
  };
}
