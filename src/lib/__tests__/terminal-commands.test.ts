import { describe, it, expect } from "vitest";
import {
  toBinary,
  pickFortune,
  runTextCommand,
  HIDDEN_TEXT_COMMANDS,
  type TextCommandContext,
} from "@/lib/terminal/commands";

const ctx: TextCommandContext = {
  t: (key, vars) => (vars ? `${key}:${JSON.stringify(vars)}` : key),
  art: ["line1", "line2"],
  fortunes: ["f0", "f1", "f2"],
  pick: 1,
  links: { leetcode: "https://leetcode.com/u/test" },
};

describe("toBinary", () => {
  it("encodes ASCII as space-separated 8-bit groups", () => {
    expect(toBinary("A")).toBe("01000001");
    expect(toBinary("AB")).toBe("01000001 01000010");
  });

  it("returns empty string for empty input", () => {
    expect(toBinary("")).toBe("");
  });
});

describe("pickFortune", () => {
  it("returns empty string for an empty pool", () => {
    expect(pickFortune([])).toBe("");
  });

  it("picks deterministically by index", () => {
    expect(pickFortune(["a", "b", "c"], 1)).toBe("b");
  });

  it("wraps and handles negative indices", () => {
    expect(pickFortune(["a", "b", "c"], 4)).toBe("b");
    expect(pickFortune(["a", "b", "c"], -1)).toBe("c");
  });

  it("returns a member of the pool when index is omitted", () => {
    const pool = ["a", "b", "c"];
    expect(pool).toContain(pickFortune(pool));
  });
});

describe("runTextCommand", () => {
  it("returns null for unknown commands (caller falls through)", () => {
    expect(runTextCommand("definitely-not-a-command", [], ctx)).toBeNull();
  });

  it("is case-insensitive", () => {
    expect(runTextCommand("COFFEE", [], ctx)?.[0]?.kind).toBe("ok");
  });

  it("handles simple keyed commands", () => {
    expect(runTextCommand("coffee", [], ctx)).toEqual([{ kind: "ok", text: "cmd.coffee" }]);
    expect(runTextCommand("bug", [], ctx)).toEqual([{ kind: "out", text: "cmd.bug" }]);
    expect(runTextCommand("crash", [], ctx)?.[0]?.kind).toBe("err");
    expect(runTextCommand("panic", [], ctx)?.[0]?.kind).toBe("err");
    expect(runTextCommand("rm", ["-rf", "/"], ctx)?.[0]?.kind).toBe("err");
  });

  it("renders the leetcode link", () => {
    const lines = runTextCommand("leetcode", [], ctx);
    expect(lines).toEqual([
      { kind: "ok", text: "cmd.leetcode" },
      { kind: "out", text: "https://leetcode.com/u/test" },
    ]);
  });

  it("encodes binary with args and shows usage without", () => {
    expect(runTextCommand("binary", ["Hi"], ctx)).toEqual([{ kind: "out", text: toBinary("Hi") }]);
    expect(runTextCommand("binary", [], ctx)).toEqual([{ kind: "err", text: "cmd.binaryUsage" }]);
  });

  it("uses the deterministic fortune index from context", () => {
    expect(runTextCommand("fortune", [], ctx)).toEqual([{ kind: "out", text: "f1" }]);
  });

  it("prints the ascii art line by line", () => {
    expect(runTextCommand("ascii", [], ctx)).toEqual([
      { kind: "out", text: "line1" },
      { kind: "out", text: "line2" },
    ]);
  });

  it("special-cases `hello world`", () => {
    const lines = runTextCommand("hello", ["world"], ctx);
    expect(lines?.[0]).toEqual({ kind: "ok", text: "Hello, World!" });
    expect(lines?.[1]?.text).toBe(toBinary("Hello, World!"));
  });

  it("greets generically without `world`", () => {
    expect(runTextCommand("hello", [], ctx)).toEqual([{ kind: "ok", text: "cmd.hello" }]);
  });

  it("covers every hidden command without returning null", () => {
    for (const cmd of HIDDEN_TEXT_COMMANDS) {
      const args = cmd === "binary" ? ["x"] : [];
      expect(runTextCommand(cmd, args, ctx)).not.toBeNull();
    }
  });
});
