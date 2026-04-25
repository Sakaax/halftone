import { describe, expect, test } from "bun:test";
import { StateSchema, BriefSchema } from "../../../src/director/schema";

describe("StateSchema", () => {
  test("accepts full state", () => {
    const parsed = StateSchema.parse({
      current_step: "brief",
      history: [{ step: "init", completed_at: "2026-04-19T14:00:00Z" }],
      framework_override: null,
      chosen_direction: null,
      framework_choice: null,
    });
    expect(parsed.current_step).toBe("brief");
  });

  test("rejects unknown step", () => {
    expect(() => StateSchema.parse({
      current_step: "finalizing",
      history: [],
      framework_override: null,
      chosen_direction: null,
      framework_choice: null,
    })).toThrow();
  });

  test("rejects legacy v0.1 steps (moodboard, locked, scaffolded)", () => {
    for (const legacy of ["moodboard", "locked", "scaffolded"]) {
      expect(() => StateSchema.parse({
        current_step: legacy,
        history: [],
        framework_override: null,
        chosen_direction: null,
        framework_choice: null,
      })).toThrow();
    }
  });

  test("accepts every v0.2 step", () => {
    for (const step of [
      "init", "brief", "directions", "preview",
      "framework_chosen", "converted", "coded",
    ]) {
      const parsed = StateSchema.parse({
        current_step: step,
        history: [],
        framework_override: null,
        chosen_direction: null,
        framework_choice: null,
      });
      expect(parsed.current_step).toBe(step);
    }
  });

  test("validates chosen_direction range 1..3", () => {
    expect(() => StateSchema.parse({
      current_step: "preview",
      history: [],
      framework_override: null,
      chosen_direction: 4,
      framework_choice: null,
    })).toThrow();
    expect(() => StateSchema.parse({
      current_step: "preview",
      history: [],
      framework_override: null,
      chosen_direction: 0,
      framework_choice: null,
    })).toThrow();
  });
});

describe("BriefSchema v2", () => {
  const valid = {
    version: 2 as const,
    created_at: "2026-04-25T14:00:00Z",
    feeling: "editorial",
    loved_site: { url: "https://oddstudio.com", why: "texture" },
    non_negotiable: "brand color must stay terracotta #D4622A",
    format: "studio-landing" as const,
    has_existing_ux_brief: false,
    has_existing_brand_kit: false,
  };

  test("accepts a valid v2 brief", () => {
    const parsed = BriefSchema.parse(valid);
    expect(parsed.feeling).toBe("editorial");
    expect(parsed.loved_site.url).toBe("https://oddstudio.com");
  });

  test("rejects empty feeling", () => {
    expect(() => BriefSchema.parse({ ...valid, feeling: "" })).toThrow();
  });

  test("rejects loved_site without a valid URL", () => {
    expect(() =>
      BriefSchema.parse({ ...valid, loved_site: { url: "not-a-url", why: "ok" } })
    ).toThrow();
  });

  test("rejects non_negotiable longer than 200 chars", () => {
    expect(() =>
      BriefSchema.parse({ ...valid, non_negotiable: "x".repeat(201) })
    ).toThrow();
  });

  test("rejects v1 schema shape (audience/site_goal/mood_preference)", () => {
    expect(() =>
      BriefSchema.parse({
        version: 1,
        created_at: valid.created_at,
        audience: "indie dev",
        site_goal: "get leads",
        mood_preference: "editorial-warm",
        format: "studio-landing",
        has_existing_ux_brief: false,
        has_existing_brand_kit: false,
      })
    ).toThrow();
  });
});
