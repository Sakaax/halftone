import { PromptInjectionError } from "../types";

const PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /ignore\s+(previous|prior|above)/i, label: "ignore previous" },
  { re: /you\s+are\s+now\s+/i, label: "you are now" },
  { re: /run\s+the\s+following/i, label: "run the following" },
  { re: /```(bash|sh|zsh|shell)[\s\S]*?```/i, label: "shell fence" },
  { re: /disregard\s+.{0,40}\s+instructions/i, label: "disregard instructions" },
];

export function detectInjection(body: string): string | null {
  for (const { re, label } of PATTERNS) {
    if (re.test(body)) return label;
  }
  return null;
}

export function assertSafeBody(source: string, body: string): void {
  const match = detectInjection(body);
  if (match) {
    throw new PromptInjectionError(source, match);
  }
}
