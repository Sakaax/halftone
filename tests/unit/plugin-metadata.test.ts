import { describe, expect, test } from "bun:test";
import plugin from "../../.claude-plugin/plugin.json";
import marketplace from "../../.claude-plugin/marketplace.json";

describe("plugin metadata", () => {
  test("plugin.json has required fields", () => {
    expect(plugin.name).toBe("halftone");
    expect(plugin.version).toBe("0.1.0");
    expect(plugin.license).toBe("AGPL-3.0");
    expect(plugin.skills).toContain(".claude/skills/halftone");
    expect(plugin.author).toBe("Sakaax");
  });
  test("marketplace.json has display fields", () => {
    expect(marketplace.display_name).toBe("Halftone");
    expect(marketplace.tagline.length).toBeGreaterThan(0);
    expect(marketplace.category).toBe("design");
  });
});
