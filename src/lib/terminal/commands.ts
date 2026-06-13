// Pure, side-effect-free terminal command logic. Lives in src/lib so it counts
// toward the coverage gate. Side-effectful commands (navigate, theme, open
// overlays, visual effects, vim sub-mode) stay in the terminal component; this
// module only owns text-only / easter-egg outputs and a couple of helpers.

export type TerminalLineKind = "in" | "out" | "err" | "ok";
export type TerminalLine = { kind: TerminalLineKind; text: string };

export type TextCommandContext = {
  /** Localized message lookup, e.g. ctx.t("cmd.coffee"). */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Phoenix ASCII banner lines for the `ascii` command. */
  art: string[];
  /** Localized fortune pool for the `fortune` command. */
  fortunes: string[];
  /** Deterministic fortune index (tests); random when undefined. */
  pick?: number;
  links: { leetcode: string };
};

/** Encode a string as space-separated 8-bit binary. */
export function toBinary(text: string): string {
  return Array.from(text)
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

/** Pick a fortune deterministically (by index) or at random. */
export function pickFortune(fortunes: string[], index?: number): string {
  if (fortunes.length === 0) return "";
  const i =
    index === undefined
      ? Math.floor(Math.random() * fortunes.length)
      : ((index % fortunes.length) + fortunes.length) % fortunes.length;
  return fortunes[i] ?? "";
}

/** Hidden (not listed in help, not tab-completed) text/easter-egg commands. */
export const HIDDEN_TEXT_COMMANDS = [
  "coffee",
  "bug",
  "nvidia",
  "cadence",
  "leetcode",
  "binary",
  "konami",
  "secret",
  "42",
  "easteregg",
  "achievement",
  "crash",
  "panic",
  "undefined",
  "fortune",
  "ascii",
  "rm",
  "hello",
] as const;

/**
 * Run a text-only command. Returns the output lines, or `null` if `head` is not
 * a text command (so the caller can fall through to behavioral commands / the
 * "command not found" message).
 */
export function runTextCommand(
  head: string,
  args: string[],
  ctx: TextCommandContext,
): TerminalLine[] | null {
  const out = (text: string, kind: TerminalLineKind = "out"): TerminalLine[] => [{ kind, text }];
  switch (head.toLowerCase()) {
    case "coffee":
      return out(ctx.t("cmd.coffee"), "ok");
    case "bug":
      return out(ctx.t("cmd.bug"));
    case "nvidia":
      return out(ctx.t("cmd.nvidia"));
    case "cadence":
      return out(ctx.t("cmd.cadence"));
    case "leetcode":
      return [
        { kind: "ok", text: ctx.t("cmd.leetcode") },
        { kind: "out", text: ctx.links.leetcode },
      ];
    case "binary": {
      const text = args.join(" ");
      if (!text) return out(ctx.t("cmd.binaryUsage"), "err");
      return out(toBinary(text));
    }
    case "konami":
      return out(ctx.t("cmd.konami"), "ok");
    case "secret":
      return out(ctx.t("cmd.secret"), "ok");
    case "42":
      return out(ctx.t("cmd.fortyTwo"), "ok");
    case "easteregg":
      return out(ctx.t("cmd.easteregg"), "ok");
    case "achievement":
      return out(ctx.t("cmd.achievement"), "ok");
    case "crash":
      return out(ctx.t("cmd.crash"), "err");
    case "panic":
      return out(ctx.t("cmd.panic"), "err");
    case "undefined":
      return out(ctx.t("cmd.undefined"));
    case "fortune":
      return out(pickFortune(ctx.fortunes, ctx.pick));
    case "ascii":
      return ctx.art.map((line) => ({ kind: "out", text: line }));
    case "rm":
      return out(ctx.t("cmd.rmrf"), "err");
    case "hello":
      if ((args[0] ?? "").toLowerCase() === "world") {
        return [
          { kind: "ok", text: "Hello, World!" },
          { kind: "out", text: toBinary("Hello, World!") },
        ];
      }
      return out(ctx.t("cmd.hello"), "ok");
    default:
      return null;
  }
}
