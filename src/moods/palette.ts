import type { PaletteTokens } from "../types";

export function paletteToCSSVars(p: PaletteTokens): string {
  return [
    `--bg: ${p.bg};`,
    `--fg: ${p.fg};`,
    `--accent: ${p.accent};`,
    `--muted: ${p.muted};`,
    `--border: ${p.border};`,
  ].join("\n");
}

// WCAG relative luminance (https://www.w3.org/WAI/GL/wiki/Relative_luminance)
function relLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.match(/^#([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const h = m[1]!;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
