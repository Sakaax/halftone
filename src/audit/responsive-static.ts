import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import postcss from "postcss";
import { parse as parseHTML } from "node-html-parser";
import type { AuditResult } from "../types";

export interface AuditCheck {
  id: string;
  title: string;
  result: AuditResult;
  detail?: string;
}

export interface AuditReport {
  audit: "responsive" | "a11y";
  mode: "static" | "deep";
  result: "pass" | "fail";
  summary: { pass: number; warn: number; fail: number };
  checks: AuditCheck[];
}

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

export function auditResponsiveStatic(projectRoot: string): AuditReport {
  const checks: AuditCheck[] = [];

  // 1. viewport meta
  const htmls = walk(projectRoot, new Set([".html", ".svelte", ".astro"]));
  const hasViewport = htmls.some((p) => {
    const content = readFileSync(p, "utf-8");
    return /<meta[^>]+name=["']viewport["'][^>]+width=device-width/i.test(content);
  });
  checks.push({
    id: "viewport-meta",
    title: "viewport meta tag present",
    result: hasViewport ? "pass" : "fail",
  });

  // 2. clamp() in CSS
  const csses = walk(projectRoot, new Set([".css", ".scss"]));
  let hasClamp = false;
  for (const p of csses) {
    const content = readFileSync(p, "utf-8");
    const root = postcss.parse(content);
    root.walkDecls((decl) => { if (/clamp\s*\(/.test(decl.value)) hasClamp = true; });
  }
  checks.push({
    id: "fluid-clamp",
    title: "fluid type uses clamp()",
    result: hasClamp ? "pass" : "warn",
  });

  // 3. min-height on buttons
  let has48pxButton = false;
  for (const p of csses) {
    const content = readFileSync(p, "utf-8");
    if (/button\s*\{[^}]*min-height:\s*(48px|3rem)/i.test(content)) has48pxButton = true;
  }
  checks.push({
    id: "tap-target-48px",
    title: "buttons have min-height: 48px",
    result: has48pxButton ? "pass" : "warn",
  });

  // 4. prefers-reduced-motion
  let hasRRM = false;
  for (const p of csses) {
    const content = readFileSync(p, "utf-8");
    if (/@media[^{]*prefers-reduced-motion/i.test(content)) hasRRM = true;
  }
  checks.push({
    id: "reduced-motion",
    title: "prefers-reduced-motion gates motion rules",
    result: hasRRM ? "pass" : "warn",
  });

  // 5. loading="lazy"
  let hasLazy = true;
  for (const p of htmls) {
    const root = parseHTML(readFileSync(p, "utf-8"));
    for (const img of root.querySelectorAll("img")) {
      if (img.getAttribute("loading") !== "lazy") { hasLazy = false; break; }
    }
  }
  checks.push({
    id: "img-lazy",
    title: "all <img> have loading=\"lazy\"",
    result: hasLazy ? "pass" : "warn",
  });

  const summary = {
    pass: checks.filter((c) => c.result === "pass").length,
    warn: checks.filter((c) => c.result === "warn").length,
    fail: checks.filter((c) => c.result === "fail").length,
  };

  return {
    audit: "responsive",
    mode: "static",
    result: summary.fail === 0 ? "pass" : "fail",
    summary,
    checks,
  };
}
