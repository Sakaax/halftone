import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { familyToSlug } from "./bundle";

export interface PaidFont {
  family: string;
  purchaseUrl: string;
  weights: number[];
}

export const PAID_FONTS: PaidFont[] = [
  { family: "PP Editorial New", purchaseUrl: "https://pangrampangram.com/products/editorial-new", weights: [400, 700] },
  { family: "Migra",            purchaseUrl: "https://pangrampangram.com/products/migra",          weights: [400, 700] },
  { family: "GT America",       purchaseUrl: "https://www.grillitype.com/typeface/gt-america",     weights: [400, 700] },
  { family: "PP Right Grotesk", purchaseUrl: "https://pangrampangram.com/products/right-grotesk",  weights: [400, 700] },
];

export function writeReadmeFonts(projectRoot: string, familiesInUse: string[]): void {
  const paidInUse = PAID_FONTS.filter((p) => familiesInUse.includes(p.family));
  if (paidInUse.length === 0) return;

  mkdirSync(join(projectRoot, "halftone"), { recursive: true });
  const lines: string[] = [
    "# Halftone — Paid Font Instructions",
    "",
    "Some fonts in your direction require a paid license. Halftone does NOT ship these files.",
    "",
  ];

  for (const font of paidInUse) {
    const slug = familyToSlug(font.family);
    lines.push(`## ${font.family}`);
    lines.push("");
    lines.push(`- **Purchase:** ${font.purchaseUrl}`);
    lines.push(`- **Expected filenames:**`);
    for (const w of font.weights) {
      lines.push(`  - \`static/fonts/${slug}/${slug}-${w}.woff2\``);
    }
    lines.push("");
    lines.push("Drop your purchased WOFF2 files at the exact paths above. Until then, the browser will fall back to the system serif/sans stack.");
    lines.push("");
  }

  writeFileSync(join(projectRoot, "halftone/README-fonts.md"), lines.join("\n"), "utf-8");
}
