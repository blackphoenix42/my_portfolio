import { describe, expect, it } from "vitest";
import { cn, formatDate, accentRing, accentText, accentBg, slugify } from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("filters falsy", () => {
    expect(cn("a", false && "b", null, undefined, "c")).toBe("a c");
  });
  it("merges conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("supports nested arrays / objects via clsx", () => {
    expect(cn(["a", { b: true, c: false }], "d")).toBe("a b d");
  });
});

describe("formatDate", () => {
  it("formats an ISO date to 'Mon YYYY'", () => {
    const out = formatDate("2024-03-15");
    expect(out).toMatch(/Mar 2024/);
  });
});

describe("accent maps", () => {
  it("provides cyan/violet/emerald/amber for ring/text/bg", () => {
    for (const key of ["cyan", "violet", "emerald", "amber"]) {
      expect(accentRing[key]).toBeDefined();
      expect(accentText[key]).toBeDefined();
      expect(accentBg[key]).toBeDefined();
    }
  });
});

describe("slugify", () => {
  it("lowercases and replaces non-alphanumeric runs with single dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("  spaced  out  ")).toBe("spaced-out");
  });
  it("normalizes en/em dashes", () => {
    expect(slugify("foo \u2013 bar")).toBe("foo-bar");
    expect(slugify("foo \u2014 bar")).toBe("foo-bar");
  });
  it("strips leading and trailing dashes", () => {
    expect(slugify("--abc--")).toBe("abc");
  });
});
