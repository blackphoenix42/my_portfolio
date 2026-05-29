import { describe, expect, it } from "vitest";
import { COUNTRIES, DEFAULT_COUNTRY_ISO, findCountry, flagFor } from "../countries";

describe("countries", () => {
  it("pins India as the first entry", () => {
    expect(COUNTRIES[0]?.iso).toBe(DEFAULT_COUNTRY_ISO);
    expect(COUNTRIES[0]?.iso).toBe("IN");
    expect(COUNTRIES[0]?.dial).toBe("91");
  });

  it("each country has a non-empty ISO, dial code, and sane min/max", () => {
    for (const c of COUNTRIES) {
      expect(c.iso).toMatch(/^[A-Z]{2}$/);
      expect(c.dial).toMatch(/^\d{1,4}$/);
      expect(c.min).toBeGreaterThan(0);
      expect(c.max).toBeGreaterThanOrEqual(c.min);
      expect(c.name.length).toBeGreaterThan(0);
    }
  });

  it("ISO codes are unique", () => {
    const seen = new Set<string>();
    for (const c of COUNTRIES) {
      expect(seen.has(c.iso)).toBe(false);
      seen.add(c.iso);
    }
  });

  describe("flagFor", () => {
    it("maps a two-letter ISO code to a regional-indicator flag", () => {
      expect(flagFor("IN")).toBe("🇮🇳");
      expect(flagFor("us")).toBe("🇺🇸");
      expect(flagFor("JP")).toBe("🇯🇵");
    });

    it("returns an empty string for invalid input", () => {
      expect(flagFor("USA")).toBe("");
      expect(flagFor("X")).toBe("");
      expect(flagFor("1A")).toBe("");
      expect(flagFor("")).toBe("");
    });
  });

  describe("findCountry", () => {
    it("returns the country for a known ISO", () => {
      expect(findCountry("IN")?.dial).toBe("91");
      expect(findCountry("US")?.dial).toBe("1");
    });

    it("returns undefined for unknown ISO", () => {
      expect(findCountry("ZZ")).toBeUndefined();
    });
  });
});
