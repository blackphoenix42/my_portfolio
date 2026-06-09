import { describe, expect, it } from "vitest";
import {
  EGG_IDS,
  TOTAL_EGGS,
  decodeShareHash,
  emptyProgress,
  encodeShareHash,
  isCompletionist,
  matchKonami,
  sanitizeProgress,
  withUnlocked,
  KONAMI_SEQUENCE,
  type EggId,
} from "../eggs";

describe("eggs registry", () => {
  it("exposes 22 ordered ids and the matching TOTAL_EGGS constant", () => {
    expect(EGG_IDS.length).toBe(22);
    expect(TOTAL_EGGS).toBe(22);
    expect(new Set(EGG_IDS).size).toBe(EGG_IDS.length);
  });
});

describe("sanitizeProgress", () => {
  it("returns an empty shape for non-object input", () => {
    expect(sanitizeProgress(null)).toEqual(emptyProgress());
    expect(sanitizeProgress(undefined)).toEqual(emptyProgress());
    expect(sanitizeProgress(7)).toEqual(emptyProgress());
    expect(sanitizeProgress("nope")).toEqual(emptyProgress());
  });

  it("drops unknown egg ids and invalid locale codes", () => {
    const out = sanitizeProgress({
      unlocked: ["konami", "not-real", 42],
      visitedLocales: ["en", "EN", "english", "ja"],
      foundHaikus: ["home", 5, "x".repeat(80)],
      dinoHighScore: -3,
      featherHighScore: 4.7,
      firstUnlockAt: "",
    });
    expect(out.unlocked).toEqual(["konami"]);
    expect(out.visitedLocales).toEqual(["en", "ja"]);
    expect(out.foundHaikus).toEqual(["home"]);
    expect(out.dinoHighScore).toBe(0);
    expect(out.featherHighScore).toBe(4);
    expect(out.firstUnlockAt).toBeNull();
  });

  it("deduplicates entries", () => {
    const out = sanitizeProgress({
      unlocked: ["konami", "konami"],
      visitedLocales: ["en", "en"],
      foundHaikus: ["home", "home"],
    });
    expect(out.unlocked).toEqual(["konami"]);
    expect(out.visitedLocales).toEqual(["en"]);
    expect(out.foundHaikus).toEqual(["home"]);
  });
});

describe("withUnlocked", () => {
  it("adds the egg and stamps firstUnlockAt only on the first add", () => {
    const a = withUnlocked(emptyProgress(), "konami");
    expect(a.unlocked).toEqual(["konami"]);
    expect(a.firstUnlockAt).not.toBeNull();
    const b = withUnlocked(a, "phoenix-type");
    expect(b.unlocked).toEqual(["konami", "phoenix-type"]);
    expect(b.firstUnlockAt).toBe(a.firstUnlockAt);
  });

  it("is idempotent for the same egg", () => {
    const a = withUnlocked(emptyProgress(), "konami");
    const b = withUnlocked(a, "konami");
    expect(b).toBe(a);
  });
});

describe("encode/decodeShareHash", () => {
  it("round-trips an empty progress", () => {
    const enc = encodeShareHash(emptyProgress());
    const dec = decodeShareHash(enc);
    expect(dec).not.toBeNull();
    expect(dec!.unlocked).toEqual([]);
    expect(dec!.dinoHighScore).toBe(0);
    expect(dec!.featherHighScore).toBe(0);
  });

  it("round-trips a partial unlock set", () => {
    const subset: EggId[] = ["konami", "phoenix-type", "sanskrit-locale", "haiku-trail"];
    const p = { ...emptyProgress(), unlocked: subset, dinoHighScore: 42, featherHighScore: 7 };
    const dec = decodeShareHash(encodeShareHash(p));
    expect(dec).not.toBeNull();
    expect(dec!.unlocked.sort()).toEqual([...subset].sort());
    expect(dec!.dinoHighScore).toBe(42);
    expect(dec!.featherHighScore).toBe(7);
  });

  it("round-trips a full unlock set", () => {
    const p = {
      ...emptyProgress(),
      unlocked: [...EGG_IDS],
      dinoHighScore: 999,
      featherHighScore: 99,
    };
    const dec = decodeShareHash(encodeShareHash(p));
    expect(dec!.unlocked.length).toBe(EGG_IDS.length);
    expect(new Set(dec!.unlocked)).toEqual(new Set(EGG_IDS));
  });

  it("returns null on malformed input", () => {
    expect(decodeShareHash("")).toBeNull();
    expect(decodeShareHash("nope")).toBeNull();
    expect(decodeShareHash("a.b")).toBeNull();
    expect(decodeShareHash("ZZ.1.1")).toBeNull(); // uppercase not allowed
    expect(decodeShareHash("!!.1.1")).toBeNull();
  });
});

describe("isCompletionist", () => {
  it("is false for a partial set", () => {
    const p = { ...emptyProgress(), unlocked: ["konami" as EggId] };
    expect(isCompletionist(p)).toBe(false);
  });

  it("ignores the completionist egg itself when checking", () => {
    const allButMeta = EGG_IDS.filter((id) => id !== "completionist");
    const p = { ...emptyProgress(), unlocked: [...allButMeta] };
    expect(isCompletionist(p)).toBe(true);
  });
});

describe("matchKonami", () => {
  it("returns matched=true only after the full sequence is typed", () => {
    let buffer: readonly string[] = [];
    for (let i = 0; i < KONAMI_SEQUENCE.length - 1; i++) {
      const key = KONAMI_SEQUENCE[i]!;
      const next = matchKonami(buffer, key);
      expect(next.matched).toBe(false);
      buffer = next.buffer;
    }
    const last = matchKonami(buffer, KONAMI_SEQUENCE[KONAMI_SEQUENCE.length - 1]!);
    expect(last.matched).toBe(true);
  });

  it("trims the buffer to the sequence length", () => {
    let buffer: readonly string[] = [];
    for (let i = 0; i < 40; i++) {
      buffer = matchKonami(buffer, "x").buffer;
    }
    expect(buffer.length).toBe(KONAMI_SEQUENCE.length);
  });

  it("lowercases letter keys", () => {
    const res = matchKonami([], "B");
    expect(res.buffer).toEqual(["b"]);
  });

  it("does not match a near-miss sequence", () => {
    let buffer: readonly string[] = [];
    const wrong = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "a",
      "b",
    ];
    for (const k of wrong) buffer = matchKonami(buffer, k).buffer;
    expect(matchKonami(buffer, "x").matched).toBe(false);
  });
});
