import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getSpeechRecognitionCtor,
  preferOnDeviceRecognition,
  transcriptFromResult,
  type SpeechRecognitionLike,
} from "@/components/contact/speech-types";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getSpeechRecognitionCtor", () => {
  it("returns null when the API is missing", () => {
    vi.stubGlobal("window", {});
    expect(getSpeechRecognitionCtor()).toBeNull();
  });

  it("prefers SpeechRecognition over the webkit prefix", () => {
    const SpeechRecognition = class {};
    const webkitSpeechRecognition = class {};
    vi.stubGlobal("window", { SpeechRecognition, webkitSpeechRecognition });
    expect(getSpeechRecognitionCtor()).toBe(SpeechRecognition);
  });

  it("falls back to webkitSpeechRecognition", () => {
    const webkitSpeechRecognition = class {};
    vi.stubGlobal("window", { webkitSpeechRecognition });
    expect(getSpeechRecognitionCtor()).toBe(webkitSpeechRecognition);
  });
});

describe("transcriptFromResult", () => {
  it("reads transcript from index 0 or item(0)", () => {
    expect(
      transcriptFromResult({
        isFinal: true,
        length: 1,
        0: { transcript: "hello" },
        item: () => ({ transcript: "hello" }),
      }),
    ).toBe("hello");
    expect(
      transcriptFromResult({
        isFinal: false,
        length: 1,
        item: () => ({ transcript: "world" }),
      }),
    ).toBe("world");
  });
});

describe("preferOnDeviceRecognition", () => {
  it("enables processLocally when the pack is available", async () => {
    const recognition = { processLocally: false } as SpeechRecognitionLike;
    const Ctor = Object.assign(class {}, {
      available: vi.fn(async () => "available" as const),
    });
    const result = await preferOnDeviceRecognition(Ctor as never, recognition, "en-US");
    expect(result).toBe("on-device");
    expect(recognition.processLocally).toBe(true);
  });

  it("falls back when on-device packs are unavailable", async () => {
    const recognition = { processLocally: true } as SpeechRecognitionLike;
    const Ctor = Object.assign(class {}, {
      available: vi.fn(async () => "unavailable" as const),
    });
    const result = await preferOnDeviceRecognition(Ctor as never, recognition, "en-US");
    expect(result).toBe("cloud");
    expect(recognition.processLocally).toBe(false);
  });

  it("returns cancelled when the UI aborts during install", async () => {
    const recognition = { processLocally: false } as SpeechRecognitionLike;
    let cancelled = false;
    const Ctor = Object.assign(class {}, {
      available: vi.fn(async () => "downloadable" as const),
      install: vi.fn(async () => {
        cancelled = true;
        return true;
      }),
    });
    const result = await preferOnDeviceRecognition(Ctor as never, recognition, "en-US", {
      isCancelled: () => cancelled,
    });
    expect(result).toBe("cancelled");
  });
});
