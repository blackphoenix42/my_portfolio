import { describe, it, expect } from "vitest";
import {
  DEFAULT_SETTINGS,
  FAST_DECODE_TPS,
  SMOOTH_DECODE_TPS,
  SMOOTH_PREFILL_TPS,
  cpuThreads,
  engineAvailability,
  generationBudget,
  isSmooth,
  parseSettings,
  recommendSettings,
  type DeviceProfile,
} from "@/lib/chatbot/settings";

const device = (over: Partial<DeviceProfile> = {}): DeviceProfile => ({
  gpu: { f16: true, fallback: false, name: "test" },
  cores: 8,
  memoryGB: 8,
  saveData: false,
  isolated: true,
  ...over,
});

const smooth = { decodeTps: SMOOTH_DECODE_TPS, prefillTps: SMOOTH_PREFILL_TPS };
const slow = { decodeTps: 2, prefillTps: 40 };

describe("parseSettings", () => {
  it("falls back to defaults for missing or malformed input", () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("not json")).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("42")).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps valid fields and replaces invalid ones", () => {
    const raw = JSON.stringify({
      engine: "cpu",
      length: "detailed",
      context: "nope",
      cpuUsage: "max",
      keepLoaded: "yes",
      speeds: { gpu: { decodeTps: 30, prefillTps: 400 }, cpu: { decodeTps: -1, prefillTps: 5 } },
    });
    expect(parseSettings(raw)).toEqual({
      engine: "cpu",
      length: "detailed",
      context: "focused",
      cpuUsage: "max",
      keepLoaded: false,
      speeds: { gpu: { decodeTps: 30, prefillTps: 400 } },
    });
  });

  it("ignores a non-object speeds field", () => {
    expect(parseSettings(JSON.stringify({ keepLoaded: true, speeds: 3 }))).toMatchObject({
      keepLoaded: true,
      speeds: {},
    });
  });
});

describe("engineAvailability", () => {
  it("allows both engines on a capable device", () => {
    expect(engineAvailability("gpu", device())).toEqual({ ok: true });
    expect(engineAvailability("cpu", device())).toEqual({ ok: true });
  });

  it("explains why the GPU engine is unavailable", () => {
    expect(engineAvailability("gpu", device({ gpu: null }))).toEqual({
      ok: false,
      reason: "noWebGpu",
    });
    expect(engineAvailability("gpu", device({ gpu: { f16: false, fallback: true } }))).toEqual({
      ok: false,
      reason: "softwareGpu",
    });
  });

  it("pauses AI for Data Saver and low-memory devices", () => {
    expect(engineAvailability("cpu", device({ saveData: true }))).toEqual({
      ok: false,
      reason: "saveData",
    });
    expect(engineAvailability("cpu", device({ memoryGB: 2 }))).toEqual({
      ok: false,
      reason: "lowMemory",
    });
    expect(engineAvailability("cpu", device({ memoryGB: undefined }))).toEqual({ ok: true });
  });
});

describe("isSmooth", () => {
  it("needs both decode and prefill speed", () => {
    expect(isSmooth(smooth)).toBe(true);
    expect(isSmooth({ ...smooth, decodeTps: SMOOTH_DECODE_TPS - 1 })).toBe(false);
    expect(isSmooth({ ...smooth, prefillTps: SMOOTH_PREFILL_TPS - 1 })).toBe(false);
  });
});

describe("recommendSettings", () => {
  it("recommends quick answers while Data Saver is on", () => {
    expect(recommendSettings(device({ saveData: true }), {})).toMatchObject({
      settings: { engine: "quick" },
      reason: "saveData",
    });
  });

  it("recommends the GPU with short, focused answers until speed is known", () => {
    expect(recommendSettings(device(), {})).toEqual({
      settings: {
        engine: "gpu",
        length: "short",
        context: "focused",
        cpuUsage: "balanced",
        keepLoaded: true,
      },
      reason: "gpu",
    });
  });

  it("keeps concise answers even on a fast GPU", () => {
    const fast = { decodeTps: FAST_DECODE_TPS, prefillTps: 500 };
    expect(recommendSettings(device(), { gpu: fast })).toMatchObject({
      settings: { engine: "gpu", length: "short", context: "focused" },
      reason: "gpuFast",
    });
  });

  it("uses the CPU on a strong isolated machine without a usable GPU", () => {
    expect(recommendSettings(device({ gpu: null }), {})).toMatchObject({
      settings: { engine: "cpu", length: "short", context: "focused" },
      reason: "cpu",
    });
    expect(recommendSettings(device({ gpu: null, cores: 4 }), { cpu: smooth })).toMatchObject({
      settings: { engine: "cpu" },
    });
  });

  it("falls back to quick answers when AI would be slow or unavailable", () => {
    expect(recommendSettings(device({ gpu: null, cores: 4 }), {})).toMatchObject({
      settings: { engine: "quick" },
      reason: "noAi",
    });
    expect(recommendSettings(device({ isolated: false, gpu: null }), {})).toMatchObject({
      reason: "noAi",
    });
    expect(recommendSettings(device(), { gpu: slow, cpu: slow })).toMatchObject({
      settings: { engine: "quick" },
      reason: "slow",
    });
  });
});

describe("generationBudget", () => {
  it("trades answer length and context for speed", () => {
    expect(generationBudget({ length: "short", context: "focused" })).toEqual({
      maxTokens: 96,
      contextChunks: 2,
      maxContextChars: 1400,
    });
    expect(generationBudget({ length: "detailed", context: "thorough" })).toEqual({
      maxTokens: 256,
      contextChunks: 4,
      maxContextChars: 3200,
    });
  });
});

describe("cpuThreads", () => {
  it("uses one thread without cross-origin isolation", () => {
    expect(cpuThreads("max", { cores: 8, isolated: false })).toBe(1);
  });

  it("leaves cores free in balanced mode and one free in max mode", () => {
    expect(cpuThreads("balanced", { cores: 8, isolated: true })).toBe(4);
    expect(cpuThreads("max", { cores: 8, isolated: true })).toBe(7);
    expect(cpuThreads("balanced", { cores: 1, isolated: true })).toBe(1);
    expect(cpuThreads("max", { cores: 0, isolated: true })).toBe(1);
  });
});
