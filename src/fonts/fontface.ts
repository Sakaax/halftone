import { familyToSlug } from "./bundle";

export interface FontFaceRequest {
  family: string;
  weight: number;
  bundled: boolean;
  purchaseUrl?: string;
}

export function generateFontFaceCSS(requests: FontFaceRequest[]): string {
  const blocks: string[] = [];
  for (const r of requests) {
    const slug = familyToSlug(r.family);
    const filename = `${slug}-${r.weight}.woff2`;
    if (r.bundled) {
      blocks.push(
        `@font-face {\n` +
        `  font-family: "${r.family}";\n` +
        `  src: url("/fonts/${slug}/${filename}") format("woff2");\n` +
        `  font-weight: ${r.weight};\n` +
        `  font-style: normal;\n` +
        `  font-display: swap;\n` +
        `}`
      );
    } else {
      const url = r.purchaseUrl ?? "see halftone/README-fonts.md";
      blocks.push(
        `/*\n` +
        ` * ${r.family} requires a paid license.\n` +
        ` * Purchase: ${url}\n` +
        ` * Drop your WOFF2 at: static/fonts/${slug}/${filename}\n` +
        ` * Until then, fallback font stack will be used.\n` +
        ` */\n` +
        `@font-face {\n` +
        `  font-family: "${r.family}";\n` +
        `  src: url("/fonts/${slug}/${filename}") format("woff2");\n` +
        `  font-weight: ${r.weight};\n` +
        `  font-display: swap;\n` +
        `}`
      );
    }
  }
  return blocks.join("\n\n") + "\n";
}
