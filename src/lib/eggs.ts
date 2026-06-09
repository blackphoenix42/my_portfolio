/**
 * Easter-egg registry, progress codec and tiny pure helpers.
 *
 * Everything in this module is server-safe (no DOM, no React). The provider
 * and the UI live under `src/components/eggs/`. Coverage thresholds in
 * `vitest.config.ts` apply to this file via the `src/lib/**` include glob, so
 * keep it well-tested.
 *
 * Storage shape (localStorage key `phoenix:eggs:v1`):
 *
 *   {
 *     unlocked: ["konami", "phoenix-type", …],
 *     visitedLocales: ["en", "hi"],
 *     dinoHighScore: 1234,
 *     featherHighScore: 17,
 *     foundHaikus: ["home", "about"],
 *     firstUnlockAt: "2026-05-31T12:00:00.000Z" | null,
 *   }
 */

export const EGG_STORAGE_KEY = "phoenix:eggs:v1";

/** All easter-egg identifiers, ordered roughly by intended discovery tier. */
export const EGG_IDS = [
  // Tier 1 — surface-level
  "console-banner",
  "html-comment",
  "humans-txt",
  "robots-txt",
  "dino-score-5",
  "feather-score-5",
  // Tier 2 — keyboard / interaction
  "konami",
  "terminal-mode",
  "phoenix-type",
  "logo-shift-click",
  // Tier 3 — content / locale
  "sanskrit-locale",
  "polyglot",
  "theme-cycler",
  "devtools-open",
  // Tier 4 — for treasure hunters
  "phoenix-route",
  "credits-route",
  "haiku-trail",
  "css-selection",
  "matrix-rain",
  "og-qr-scan",
  // Tier 5 — meta
  "trophy-room-visit",
  "completionist",
] as const;

export type EggId = (typeof EGG_IDS)[number];

export const TOTAL_EGGS = EGG_IDS.length;

export type EggTier = 1 | 2 | 3 | 4 | 5;

/**
 * Static metadata per egg. Translation keys live under `eggs.catalogue.<id>.*`
 * (title + hint + clue) so users see localized text in the trophy room.
 */
export const EGG_META: Record<EggId, { tier: EggTier }> = {
  "console-banner": { tier: 1 },
  "html-comment": { tier: 1 },
  "humans-txt": { tier: 1 },
  "robots-txt": { tier: 1 },
  "dino-score-5": { tier: 1 },
  "feather-score-5": { tier: 1 },
  konami: { tier: 2 },
  "terminal-mode": { tier: 2 },
  "phoenix-type": { tier: 2 },
  "logo-shift-click": { tier: 2 },
  "sanskrit-locale": { tier: 3 },
  polyglot: { tier: 3 },
  "theme-cycler": { tier: 3 },
  "devtools-open": { tier: 3 },
  "phoenix-route": { tier: 4 },
  "credits-route": { tier: 4 },
  "haiku-trail": { tier: 4 },
  "css-selection": { tier: 4 },
  "matrix-rain": { tier: 4 },
  "og-qr-scan": { tier: 4 },
  "trophy-room-visit": { tier: 5 },
  completionist: { tier: 5 },
};

export type EggProgress = {
  unlocked: EggId[];
  visitedLocales: string[];
  dinoHighScore: number;
  featherHighScore: number;
  foundHaikus: string[];
  firstUnlockAt: string | null;
};

export function emptyProgress(): EggProgress {
  return {
    unlocked: [],
    visitedLocales: [],
    dinoHighScore: 0,
    featherHighScore: 0,
    foundHaikus: [],
    firstUnlockAt: null,
  };
}

/** Whitelist a raw parsed object into a sanitized `EggProgress`. */
export function sanitizeProgress(input: unknown): EggProgress {
  const empty = emptyProgress();
  if (!input || typeof input !== "object") return empty;
  const raw = input as Record<string, unknown>;

  const validEggs = new Set<string>(EGG_IDS);
  const unlocked = Array.isArray(raw.unlocked)
    ? Array.from(new Set(raw.unlocked.filter((x): x is EggId => validEggs.has(String(x)))))
    : [];

  const visited = Array.isArray(raw.visitedLocales)
    ? Array.from(
        new Set(
          raw.visitedLocales.filter(
            (x): x is string => typeof x === "string" && /^[a-z]{2}$/.test(x),
          ),
        ),
      )
    : [];

  const haikus = Array.isArray(raw.foundHaikus)
    ? Array.from(
        new Set(raw.foundHaikus.filter((x): x is string => typeof x === "string" && x.length < 40)),
      )
    : [];

  const dino =
    typeof raw.dinoHighScore === "number" && raw.dinoHighScore >= 0 ? raw.dinoHighScore : 0;
  const feather =
    typeof raw.featherHighScore === "number" && raw.featherHighScore >= 0
      ? raw.featherHighScore
      : 0;

  const firstAt =
    typeof raw.firstUnlockAt === "string" && raw.firstUnlockAt.length > 0
      ? raw.firstUnlockAt
      : empty.firstUnlockAt;

  return {
    unlocked: unlocked as EggId[],
    visitedLocales: visited,
    dinoHighScore: Math.floor(dino),
    featherHighScore: Math.floor(feather),
    foundHaikus: haikus,
    firstUnlockAt: firstAt,
  };
}

/** Add an egg to the unlocked set (idempotent). */
export function withUnlocked(prev: EggProgress, id: EggId): EggProgress {
  if (prev.unlocked.includes(id)) return prev;
  return {
    ...prev,
    unlocked: [...prev.unlocked, id],
    firstUnlockAt: prev.firstUnlockAt ?? new Date().toISOString(),
  };
}

/**
 * Encode progress into a short URL-safe string that can be shared as
 * `?eggs=…` for bragging rights. Decoder reconstructs only the unlocked set
 * + counts (no PII, no timestamps).
 */
export function encodeShareHash(p: EggProgress): string {
  const bits = EGG_IDS.map((id) => (p.unlocked.includes(id) ? "1" : "0")).join("");
  // Pack to base36. Bit-string -> BigInt -> base-36 string.
  const n = BigInt("0b" + bits);
  return `${n.toString(36)}.${p.dinoHighScore}.${p.featherHighScore}`;
}

/** Decode a share hash back to the subset of fields it carries. */
export function decodeShareHash(
  hash: string,
): { unlocked: EggId[]; dinoHighScore: number; featherHighScore: number } | null {
  const parts = hash.split(".");
  if (parts.length !== 3) return null;
  const [packed, dinoStr, featherStr] = parts;
  if (!packed || !/^[0-9a-z]+$/.test(packed)) return null;
  let n: bigint;
  try {
    n = parseBase36(packed);
  } catch {
    return null;
  }
  const bits = n.toString(2).padStart(EGG_IDS.length, "0").slice(-EGG_IDS.length);
  const unlocked: EggId[] = [];
  for (let i = 0; i < EGG_IDS.length; i++) {
    if (bits[i] === "1") {
      // Safe: i is in range of EGG_IDS, which is a readonly tuple.
      unlocked.push(EGG_IDS[i] as EggId);
    }
  }
  const dino = Number(dinoStr);
  const feather = Number(featherStr);
  return {
    unlocked,
    dinoHighScore: Number.isFinite(dino) && dino >= 0 ? Math.floor(dino) : 0,
    featherHighScore: Number.isFinite(feather) && feather >= 0 ? Math.floor(feather) : 0,
  };
}

function parseBase36(s: string): bigint {
  let n = 0n;
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    let v: number;
    if (code >= 48 && code <= 57) v = code - 48;
    else if (code >= 97 && code <= 122) v = code - 97 + 10;
    else throw new Error("bad base36");
    n = n * 36n + BigInt(v);
  }
  return n;
}

/** Whether progress contains every egg in the registry. */
export function isCompletionist(p: EggProgress): boolean {
  // Treat the "completionist" egg itself as derived — every *other* egg unlocked.
  const required = EGG_IDS.filter((id) => id !== "completionist");
  return required.every((id) => p.unlocked.includes(id));
}

/** The Konami sequence as a fixed key-name list (Up Up Down Down Left Right Left Right B A). */
export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

/**
 * Stateless Konami matcher. Pass in the running buffer of last N key names
 * and the just-pressed key. Returns the new buffer (sliced to sequence
 * length) and whether the sequence just completed.
 */
export function matchKonami(
  buffer: readonly string[],
  key: string,
): { buffer: string[]; matched: boolean } {
  const normalized = key.length === 1 ? key.toLowerCase() : key;
  const next = [...buffer, normalized].slice(-KONAMI_SEQUENCE.length);
  const matched =
    next.length === KONAMI_SEQUENCE.length && next.every((k, i) => k === KONAMI_SEQUENCE[i]);
  return { buffer: next, matched };
}
