import { describe, expect, test } from "bun:test";
import plugin from "../../.claude-plugin/plugin.json";
import marketplace from "../../.claude-plugin/marketplace.json";

describe("plugin metadata", () => {
  test("plugin.json has required fields", () => {
    expect(plugin.name).toBe("halftone");
    expect(plugin.version).toBe("0.1.0");
    expect(plugin.license).toBe("AGPL-3.0");
    expect(plugin.skills).toContain("./.claude/skills/halftone");
    expect(plugin.author.name).toBe("Sakaax");
  });

  test("marketplace.json matches Claude Code schema", () => {
    expect(marketplace.name).toBe("halftone");
    expect(marketplace.id).toBe("halftone");
    expect(marketplace.owner.name).toBe("Sakaax");
    expect(marketplace.metadata.version).toBe("0.1.0");
    expect(Array.isArray(marketplace.plugins)).toBe(true);
    expect(marketplace.plugins.length).toBeGreaterThan(0);
    expect(marketplace.plugins[0].name).toBe("halftone");
    expect(marketplace.plugins[0].source).toBe("./");
    expect(marketplace.plugins[0].category).toBe("design");
  });
});
