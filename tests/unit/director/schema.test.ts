import { describe, expect, test } from "bun:test";
import { StateSchema, BriefSchema } from "../../../src/director/schema";

describe("StateSchema", () => {
  test("accepts full state", () => {
    const parsed = StateSchema.parse({
      current_step: "brief",
      history: [{ step: "init", completed_at: "2026-04-19T14:00:00Z" }],
      framework_override: null,
      moodboard_source: null,
    });
    expect(parsed.current_step).toBe("brief");
  });
  test("rejects unknown step", () => {
    expect(() => StateSchema.parse({
      current_step: "finalizing",
      history: [],
      framework_override: null,
      moodboard_source: null,
    })).toThrow();
  });
});

describe("BriefSchema", () => {
  test("accepts brief frontmatter", () => {
    const parsed = BriefSchema.parse({
      version: 1,
      created_at: "2026-04-19T14:00:00Z",
      audience: "indie dev",
      site_goal: "get leads",
      mood_preference: "editorial-warm",
      format: "studio-landing",
      has_existing_ux_brief: false,
      has_existing_brand_kit: false,
    });
    expect(parsed.format).toBe("studio-landing");
  });
});
