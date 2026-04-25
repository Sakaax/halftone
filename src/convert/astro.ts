import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import type { ParsedPreview, ParsedSlot } from "./parser";

export interface AstroConvertResult {
  componentsWritten: string[];
  pageWritten: string;
  layoutWritten: string;
  packageJsonUpdated: string;
}

const COMPONENT_NAME: Record<ParsedSlot["name"], string> = {
  hero: "Hero",
  "primary-motion": "PrimaryMotion",
  footer: "FooterBlock",
  cursor: "CursorOverlay",
  transition: "PageTransition",
};

export function convertToAstro(
  parsed: ParsedPreview,
  projectRoot: string
): AstroConvertResult {
  const componentsDir = join(projectRoot, "src/components");
  const layoutsDir = join(projectRoot, "src/layouts");
  const pagesDir = join(projectRoot, "src/pages");

  mkdirSync(componentsDir, { recursive: true });
  mkdirSync(layoutsDir, { recursive: true });
  mkdirSync(pagesDir, { recursive: true });

  const componentsWritten: string[] = [];
  for (const slot of parsed.slots) {
    const compName = COMPONENT_NAME[slot.name];
    const componentPath = join(componentsDir, `${compName}.astro`);
    writeFileSync(componentPath, renderAstroComponent(slot, compName), "utf-8");
    componentsWritten.push(componentPath);
  }

  const layoutPath = join(layoutsDir, "Layout.astro");
  writeFileSync(layoutPath, renderLayout(parsed.title, parsed.hasLenis), "utf-8");

  const pagePath = join(pagesDir, "index.astro");
  writeFileSync(pagePath, renderPage(parsed.slots, parsed.title), "utf-8");

  const pkgPath = join(projectRoot, "package.json");
  const pkgUpdated = upsertDeps(pkgPath);

  return {
    componentsWritten,
    pageWritten: pagePath,
    layoutWritten: layoutPath,
    packageJsonUpdated: pkgUpdated,
  };
}

function renderAstroComponent(slot: ParsedSlot, _name: string): string {
  const tag = slot.position === "overlay" ? "div" : "section";
  return `---
// halftone-converted component for slot "${slot.name}"
---

<${tag} data-slot="${slot.name}"${slot.position === "overlay" ? ' aria-hidden="true"' : ""}>
${indent(slot.innerHtml, 2)}
</${tag}>

<script>
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.registerPlugin(ScrollTrigger);
${indent(slot.initBody, 4)}
  }
</script>
`;
}

function renderPage(slots: ParsedSlot[], title: string): string {
  const imports = slots
    .map((s) => `import ${COMPONENT_NAME[s.name]} from "../components/${COMPONENT_NAME[s.name]}.astro";`)
    .join("\n");

  const overlays = slots
    .filter((s) => s.position === "overlay")
    .map((s) => `  <${COMPONENT_NAME[s.name]} />`)
    .join("\n");

  const main = slots
    .filter((s) => s.position === "main")
    .map((s) => `    <${COMPONENT_NAME[s.name]} />`)
    .join("\n");

  return `---
import Layout from "../layouts/Layout.astro";
${imports}
---

<Layout title="${escapeAttr(title)}">
${overlays}
  <main id="main-content">
${main}
  </main>
</Layout>
`;
}

function renderLayout(title: string, hasLenis: boolean): string {
  const lenisScript = hasLenis
    ? `
  <script>
    import Lenis from "lenis";
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
  </script>`
    : "";

  return `---
interface Props {
  title?: string;
}
const { title = "${escapeAttr(title)}" } = Astro.props;
---

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
</head>
<body>
  <slot />
${lenisScript}
</body>
</html>
`;
}

function upsertDeps(pkgPath: string): string {
  if (!existsSync(pkgPath)) {
    mkdirSync(dirname(pkgPath), { recursive: true });
    const fresh = {
      name: "halftone-site",
      type: "module",
      dependencies: { gsap: "^3.12.5", lenis: "^1.0.42" },
    };
    writeFileSync(pkgPath, JSON.stringify(fresh, null, 2), "utf-8");
    return pkgPath;
  }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  pkg.dependencies = pkg.dependencies ?? {};
  if (!pkg.dependencies.gsap) pkg.dependencies.gsap = "^3.12.5";
  if (!pkg.dependencies.lenis) pkg.dependencies.lenis = "^1.0.42";
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf-8");
  return pkgPath;
}

function indent(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.length > 0 ? pad + line : line))
    .join("\n");
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;");
}
