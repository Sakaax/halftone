#!/usr/bin/env bun
import { readFileSync, existsSync } from "fs";

interface HookInput {
  tool_name?: string;
  tool_input?: {
    file_path?: string;
    content?: string;
    new_string?: string;
  };
}

interface CheckResult {
  blocking: string[];
  warnings: string[];
}

const BANNED_FONTS = [
  "Inter",
  "Arial",
  "Roboto",
  "Helvetica Neue",
  "Open Sans",
  "Lato",
  "Montserrat",
];

const TAILWIND_DEFAULTS = [
  /\bbg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)\b/,
  /\btext-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)\b/,
];

const BANNED_GRADIENTS: { pattern: RegExp; label: string }[] = [
  {
    pattern: /linear-gradient\([^)]*\b(purple|violet|fuchsia|magenta|#[a-fA-F0-9]{0,6})[^)]*\b(pink|rose|hotpink|#f[a-fA-F0-9]{5})[^)]*\)/i,
    label: "purple-to-pink gradient",
  },
  {
    pattern: /linear-gradient\([^)]*(?:,\s*[^,)]+){4,}\)/,
    label: "rainbow gradient (4+ stops)",
  },
  {
    pattern: /text-shadow\s*:\s*[^;]*0\s*0\s*\d+px\s+(?:#?[a-fA-F0-9]{3,6}|rgba?\([^)]*\))[^;]*0\s*0\s*\d+px/i,
    label: "neon text-glow",
  },
];

const HERO_GENERIC = /<h1[^>]*>[^<]+<\/h1>\s*<p[^>]*>[^<]+<\/p>\s*<(?:button|a)[^>]*>[^<]+<\/(?:button|a)>/i;
const MOTION_TRIGGERS = /(?:gsap\.(?:to|from|fromTo|timeline)|@keyframes\s+\w+)/;
const REDUCED_MOTION_GUARD = /prefers-reduced-motion/;

const PREVIEW_PATH_FRAGMENT = "halftone/preview/";

export function runChecks(filePath: string, content: string): CheckResult {
  const blocking: string[] = [];
  const warnings: string[] = [];

  if (isCssLike(filePath) || isHtmlLike(filePath)) {
    for (const family of BANNED_FONTS) {
      const escaped = family.replace(/ /g, "\\s+");
      const re = new RegExp(`(?:font-family\\s*:[^;]*['"\`]?\\s*${escaped}\\b|family=${escaped.replace(/\\s\+/g, "\\+")})`, "i");
      if (re.test(content)) {
        blocking.push(`Banned font: ${family}`);
      }
    }
  }

  for (const { pattern, label } of BANNED_GRADIENTS) {
    if (pattern.test(content)) blocking.push(`Banned pattern: ${label}`);
  }

  if (isHtmlLike(filePath) || isJsLike(filePath)) {
    for (const re of TAILWIND_DEFAULTS) {
      const m = content.match(re);
      if (m) {
        blocking.push(`Tailwind default utility: ${m[0]}`);
        break;
      }
    }
  }

  if (isHtmlLike(filePath) && HERO_GENERIC.test(content)) {
    warnings.push("Generic hero structure (h1 + p + single button) — consider asymmetry or layered composition");
  }

  if ((isCssLike(filePath) || isJsLike(filePath)) && MOTION_TRIGGERS.test(content) && !REDUCED_MOTION_GUARD.test(content)) {
    warnings.push("Motion without prefers-reduced-motion guard");
  }

  return { blocking, warnings };
}

function isCssLike(p: string): boolean {
  return /\.(css|scss|sass|less|styl)$/i.test(p);
}
function isHtmlLike(p: string): boolean {
  return /\.(html|htm|svelte|astro|vue|jsx|tsx)$/i.test(p);
}
function isJsLike(p: string): boolean {
  return /\.(js|jsx|ts|tsx|mjs|cjs|svelte|astro|vue)$/i.test(p);
}

export function isInScope(filePath: string): boolean {
  if (!filePath) return false;
  const normalized = filePath.replace(/\\/g, "/");
  return normalized.includes(PREVIEW_PATH_FRAGMENT);
}

async function readStdin(): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Uint8Array);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

async function main(): Promise<void> {
  const raw = await readStdin();
  let payload: HookInput;
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    process.exit(0);
  }

  const filePath = payload.tool_input?.file_path ?? "";
  if (!isInScope(filePath)) process.exit(0);

  let content = payload.tool_input?.content ?? payload.tool_input?.new_string ?? "";
  if (!content && existsSync(filePath)) {
    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      content = "";
    }
  }
  if (!content) process.exit(0);

  const { blocking, warnings } = runChecks(filePath, content);

  if (warnings.length) {
    for (const w of warnings) process.stderr.write(`[halftone] warning: ${w}\n`);
  }
  if (blocking.length) {
    for (const b of blocking) {
      process.stderr.write(`[halftone] violation: ${b}. Fix before proceeding.\n`);
    }
    process.exit(2);
  }
  process.exit(0);
}

if (import.meta.main) {
  main();
}
