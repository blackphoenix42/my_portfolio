import { describe, it, expect } from "vitest";
import {
  QUIRKY_TAGS,
  ALL_QUIRKY_FILTER,
  isQuirkyTag,
  filterByQuirkyTag,
  availableQuirkyTags,
} from "@/lib/quirky-tags";

type Item = { id: string; quirkyTags?: readonly string[] };

const items: Item[] = [
  { id: "a", quirkyTags: ["favorite", "ai"] },
  { id: "b", quirkyTags: ["systems"] },
  { id: "c" }, // no quirky tags
  { id: "d", quirkyTags: ["favorite", "research"] },
];

describe("isQuirkyTag", () => {
  it("accepts known tags", () => {
    for (const tag of QUIRKY_TAGS) {
      expect(isQuirkyTag(tag)).toBe(true);
    }
  });

  it("rejects unknown strings", () => {
    expect(isQuirkyTag("nope")).toBe(false);
    expect(isQuirkyTag("")).toBe(false);
    expect(isQuirkyTag(ALL_QUIRKY_FILTER)).toBe(false);
  });
});

describe("filterByQuirkyTag", () => {
  it("returns a copy of the list for 'all'", () => {
    const result = filterByQuirkyTag(items, ALL_QUIRKY_FILTER);
    expect(result).toHaveLength(items.length);
    expect(result).not.toBe(items);
  });

  it("returns the full list for an unknown filter", () => {
    expect(filterByQuirkyTag(items, "bogus")).toHaveLength(items.length);
  });

  it("filters to items carrying the tag", () => {
    expect(filterByQuirkyTag(items, "favorite").map((i) => i.id)).toEqual(["a", "d"]);
    expect(filterByQuirkyTag(items, "systems").map((i) => i.id)).toEqual(["b"]);
  });

  it("excludes items without quirkyTags", () => {
    expect(filterByQuirkyTag(items, "ai").map((i) => i.id)).toEqual(["a"]);
  });
});

describe("availableQuirkyTags", () => {
  it("returns present tags in canonical order", () => {
    expect(availableQuirkyTags(items)).toEqual(["favorite", "research", "ai", "systems"]);
  });

  it("returns an empty array when nothing is tagged", () => {
    const untagged: Item[] = [{ id: "x" }];
    expect(availableQuirkyTags(untagged)).toEqual([]);
  });
});
