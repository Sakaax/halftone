import { describe, expect, test } from "bun:test";
import { version } from "../../src/index";

describe("smoke", () => {
  test("version is 0.1.0", () => {
    expect(version).toBe("0.1.0");
  });
});
