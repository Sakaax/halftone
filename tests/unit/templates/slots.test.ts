import { describe, expect, test } from "bun:test";
import { detectSlots } from "../../../src/templates/slots";
import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("detectSlots", () => {
  test("finds all slot markers in .svelte files", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-slot-"));
    const file = join(dir, "Page.svelte");
    writeFileSync(file, `<!-- slot:hero -->\n<section/>\n<!-- slot:primary-motion -->\n<!-- slot:footer -->`);

    const slots = detectSlots(dir);
    const names = slots.map((s) => s.name).sort();
    expect(names).toEqual(["footer", "hero", "primary-motion"]);
    rmSync(dir, { recursive: true, force: true });
  });

  test("ignores non-slot comments", () => {
    const dir = mkdtempSync(join(tmpdir(), "halftone-slot-"));
    const file = join(dir, "Page.astro");
    writeFileSync(file, `<!-- regular comment -->\n<!-- slot:hero -->`);

    const slots = detectSlots(dir);
    expect(slots).toHaveLength(1);
    expect(slots[0]!.name).toBe("hero");
    rmSync(dir, { recursive: true, force: true });
  });
});
