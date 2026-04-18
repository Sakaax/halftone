#!/usr/bin/env bun
import { readState } from "./director/state";
import { loadAllMoods } from "./moods/loader";
import { auditResponsiveStatic } from "./audit/responsive-static";
import { auditA11yStatic } from "./audit/a11y-static";
import { writeAuditReport } from "./audit/report";
import { installHook, uninstallHook } from "./security/precommit-hook";

export const version = "0.1.0";

interface ParsedFlags {
  positional: string[];
  flags: Record<string, boolean | string>;
}

function parseArgs(argv: string[]): ParsedFlags {
  const positional: string[] = [];
  const flags: Record<string, boolean | string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("-")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2);
  const { positional, flags } = parseArgs(argv);

  if (flags.version === true) {
    console.log(version);
    return 0;
  }

  const cmd = positional[0] ?? "status";

  if (cmd === "status") {
    try {
      const s = readState(process.cwd());
      console.log(`current step: ${s.current_step}`);
      console.log(`history: ${s.history.length} transitions`);
      return 0;
    } catch (e) {
      console.error((e as Error).message);
      return 1;
    }
  }

  if (cmd === "mood" && positional[1] === "list") {
    const moods = loadAllMoods("moods");
    for (const m of moods) {
      console.log(`${m.slug.padEnd(22)} ${m.name}`);
    }
    return 0;
  }

  if (cmd === "audit") {
    const deep = flags.deep === true;
    const responsive = deep
      ? (await import("./audit/responsive-deep")).auditResponsiveDeep({ url: "http://localhost:5173" })
      : Promise.resolve(auditResponsiveStatic(process.cwd()));
    const a11y = deep
      ? (await import("./audit/a11y-deep")).auditA11yDeep({ url: "http://localhost:5173" })
      : Promise.resolve(auditA11yStatic(process.cwd()));
    const [r, a] = await Promise.all([responsive, a11y]);
    writeAuditReport(process.cwd(), r);
    writeAuditReport(process.cwd(), a);
    console.log(`responsive: ${r.result} (${r.summary.fail} fail, ${r.summary.warn} warn)`);
    console.log(`a11y: ${a.result} (${a.summary.fail} fail, ${a.summary.warn} warn)`);
    return (r.result === "fail" || a.result === "fail") ? 2 : 0;
  }

  if (cmd === "hook" && positional[1] === "install") {
    installHook(process.cwd());
    console.log("pre-commit hook installed");
    return 0;
  }

  if (cmd === "hook" && positional[1] === "uninstall") {
    uninstallHook(process.cwd());
    console.log("pre-commit hook uninstalled");
    return 0;
  }

  if (cmd === "build:index") {
    const { buildIndex } = await import("./patterns/build-index");
    await buildIndex(process.cwd());
    console.log("manifest generated");
    return 0;
  }

  console.error(`Unknown command: ${cmd}`);
  console.error("Available: status, mood list, audit [--deep], hook install|uninstall, build:index");
  return 1;
}

if (import.meta.main) {
  const code = await main();
  process.exit(code);
}
