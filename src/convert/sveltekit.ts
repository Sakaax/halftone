import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import type { ParsedPreview, ParsedSlot } from "./parser";

export interface SvelteKitConvertResult {
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

export function convertToSvelteKit(
  parsed: ParsedPreview,
  projectRoot: string
): SvelteKitConvertResult {
  const componentsDir = join(projectRoot, "src/lib/components");
  const routesDir = join(projectRoot, "src/routes");

  mkdirSync(componentsDir, { recursive: true });
  mkdirSync(routesDir, { recursive: true });

  const componentsWritten: string[] = [];
  for (const slot of parsed.slots) {
    const compName = COMPONENT_NAME[slot.name];
    const componentPath = join(componentsDir, `${compName}.svelte`);
    writeFileSync(componentPath, renderSvelteComponent(slot, compName), "utf-8");
    componentsWritten.push(componentPath);
  }

  const pagePath = join(routesDir, "+page.svelte");
  writeFileSync(pagePath, renderPage(parsed.slots), "utf-8");

  const layoutPath = join(routesDir, "+layout.svelte");
  writeFileSync(layoutPath, renderLayout(parsed.hasLenis), "utf-8");

  const pkgPath = join(projectRoot, "package.json");
  const pkgUpdated = upsertDeps(pkgPath);

  return {
    componentsWritten,
    pageWritten: pagePath,
    layoutWritten: layoutPath,
    packageJsonUpdated: pkgUpdated,
  };
}

function renderSvelteComponent(slot: ParsedSlot, name: string): string {
  const initBody = indent(slot.initBody, 4);
  const tag = slot.position === "overlay" ? "div" : "section";
  return `<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
${initBody}
  });
</script>

<${tag} data-slot="${slot.name}"${slot.position === "overlay" ? ' aria-hidden="true"' : ""}>
${indent(slot.innerHtml, 2)}
</${tag}>
`;
}

function renderPage(slots: ParsedSlot[]): string {
  const overlayImports = slots.filter((s) => s.position === "overlay");
  const mainSlots = slots.filter((s) => s.position === "main");

  const imports = slots
    .map((s) => `  import ${COMPONENT_NAME[s.name]} from "$lib/components/${COMPONENT_NAME[s.name]}.svelte";`)
    .join("\n");

  const overlayTags = overlayImports.map((s) => `<${COMPONENT_NAME[s.name]} />`).join("\n");
  const mainTags = mainSlots.map((s) => `  <${COMPONENT_NAME[s.name]} />`).join("\n");

  return `<script lang="ts">
${imports}
</script>

${overlayTags}

<main id="main-content">
${mainTags}
</main>
`;
}

function renderLayout(hasLenis: boolean): string {
  if (!hasLenis) {
    return `<script lang="ts">
  import "$lib/tokens.css";
</script>

<slot />
`;
  }
  return `<script lang="ts">
  import { onMount } from "svelte";
  import Lenis from "lenis";
  import "$lib/tokens.css";

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });
</script>

<slot />
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
