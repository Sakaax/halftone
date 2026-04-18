import { describe, expect, test } from "bun:test";
import { assertWithinScope } from "../../../src/security/fs-scope";
import { FSScopeViolationError } from "../../../src/types";

describe("assertWithinScope", () => {
  const root = "/tmp/halftone-fs-test";

  test("allows halftone/ paths", () => {
    expect(() => assertWithinScope(root, `${root}/halftone/brief.md`)).not.toThrow();
  });
  test("allows src/halftone-generated/", () => {
    expect(() => assertWithinScope(root, `${root}/src/halftone-generated/Hero.svelte`)).not.toThrow();
  });
  test("allows static/fonts/", () => {
    expect(() => assertWithinScope(root, `${root}/static/fonts/newsreader.woff2`)).not.toThrow();
  });
  test("allows package.json", () => {
    expect(() => assertWithinScope(root, `${root}/package.json`)).not.toThrow();
  });
  test("allows .gitignore", () => {
    expect(() => assertWithinScope(root, `${root}/.gitignore`)).not.toThrow();
  });
  test("rejects .git/", () => {
    expect(() => assertWithinScope(root, `${root}/.git/config`)).toThrow(FSScopeViolationError);
  });
  test("rejects .ssh/", () => {
    expect(() => assertWithinScope(root, `${root}/.ssh/id_rsa`)).toThrow();
  });
  test("rejects absolute paths outside cwd", () => {
    expect(() => assertWithinScope(root, "/etc/passwd")).toThrow();
  });
  test("rejects traversal via ..", () => {
    expect(() => assertWithinScope(root, `${root}/halftone/../../../etc/shadow`)).toThrow();
  });
});
