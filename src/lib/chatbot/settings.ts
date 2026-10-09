// Assistant settings and device-based recommendations (ADR-0012). Pure so it
// can be unit-tested; the panel persists settings in localStorage.

export type Engine = "quick" | "server" | "gpu" | "cpu";
/** Engines that download and execute a model in the visitor's browser. */
export type AiEngine = Exclude<Engine, "quick" | "server">;
export type AnswerLength = "short" | "detailed";
export type ContextDepth = "focused" | "thorough";
export type CpuUsage = "balanced" | "max";
export type Speed = { decodeTps: number; prefillTps: number };

export type ChatSettings = {
  engine: Engine;
  length: AnswerLength;
  context: ContextDepth;
  cpuUsage: CpuUsage;
  keepLoaded: boolean;
  /** Last speed measured for each AI engine on this device. */
  speeds: Partial<Record<AiEngine, Speed>>;
};

export const SETTINGS_KEY = "phoenix:chat:settings";

export const ENGINES = ["quick", "server", "gpu", "cpu"] as const satisfies readonly Engine[];
const LENGTHS = ["short", "detailed"] as const satisfies readonly AnswerLength[];
const CONTEXTS = ["focused", "thorough"] as const satisfies readonly ContextDepth[];
const CPU_USAGES = ["balanced", "max"] as const satisfies readonly CpuUsage[];

export type Preferences = Omit<ChatSettings, "speeds">;

const DEFAULT_PREFERENCES: Preferences = {
  engine: "quick",
  length: "short",
  context: "focused",
  cpuUsage: "balanced",
  keepLoaded: false,
};

export const DEFAULT_SETTINGS: ChatSettings = { ...DEFAULT_PREFERENCES, speeds: {} };

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly unknown[]).includes(value) ? (value as T) : fallback;
}

function parseSpeed(value: unknown): Speed | undefined {
  if (!value || typeof value !== "object") return undefined;
  const { decodeTps, prefillTps } = value as Record<string, unknown>;
  const valid = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0;
  return valid(decodeTps) && valid(prefillTps) ? { decodeTps, prefillTps } : undefined;
}

/** localStorage is user-controlled, so every field is validated. */
export function parseSettings(raw: string | null | undefined): ChatSettings {
  let data: unknown = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }
  if (!data || typeof data !== "object") return { ...DEFAULT_SETTINGS, speeds: {} };
  const d = data as Record<string, unknown>;
  const speedsIn =
    d.speeds && typeof d.speeds === "object" ? (d.speeds as Record<string, unknown>) : {};
  const speeds: ChatSettings["speeds"] = {};
  for (const engine of ["gpu", "cpu"] as const) {
    const speed = parseSpeed(speedsIn[engine]);
    if (speed) speeds[engine] = speed;
  }
  return {
    engine: pick(d.engine, ENGINES, DEFAULT_SETTINGS.engine),
    length: pick(d.length, LENGTHS, DEFAULT_SETTINGS.length),
    context: pick(d.context, CONTEXTS, DEFAULT_SETTINGS.context),
    cpuUsage: pick(d.cpuUsage, CPU_USAGES, DEFAULT_SETTINGS.cpuUsage),
    keepLoaded: typeof d.keepLoaded === "boolean" ? d.keepLoaded : DEFAULT_SETTINGS.keepLoaded,
    speeds,
  };
}

export type DeviceProfile = {
  /** `null` when the browser has no WebGPU adapter. */
  gpu: { f16: boolean; fallback: boolean; name?: string } | null;
  cores: number;
  memoryGB?: number;
  saveData: boolean;
  /** Cross-origin isolated pages can run multi-threaded WebAssembly. */
  isolated: boolean;
};

export type UnavailableReason = "noWebGpu" | "softwareGpu" | "lowMemory" | "saveData";

/** Below this `navigator.deviceMemory` a model would starve the page. */
export const MIN_MEMORY_GB = 4;

export function engineAvailability(
  engine: AiEngine,
  device: DeviceProfile,
): { ok: true } | { ok: false; reason: UnavailableReason } {
  if (device.saveData) return { ok: false, reason: "saveData" };
  if (device.memoryGB !== undefined && device.memoryGB < MIN_MEMORY_GB) {
    return { ok: false, reason: "lowMemory" };
  }
  if (engine === "gpu") {
    if (!device.gpu) return { ok: false, reason: "noWebGpu" };
    if (device.gpu.fallback) return { ok: false, reason: "softwareGpu" };
  }
  return { ok: true };
}

/** About reading speed; slower decoding feels broken in a chat. */
export const SMOOTH_DECODE_TPS = 8;
/** Keeps time-to-first-token for a grounded prompt under roughly 10 s. */
export const SMOOTH_PREFILL_TPS = 100;
/** Fast enough to afford detailed answers and more context. */
export const FAST_DECODE_TPS = 20;

export function isSmooth(speed: Speed): boolean {
  return speed.decodeTps >= SMOOTH_DECODE_TPS && speed.prefillTps >= SMOOTH_PREFILL_TPS;
}

export type RecommendationReason = "gpuFast" | "gpu" | "cpu" | "slow" | "noAi" | "saveData";

export function recommendSettings(
  device: DeviceProfile,
  speeds: ChatSettings["speeds"],
): { settings: Preferences; reason: RecommendationReason } {
  const base = DEFAULT_PREFERENCES;
  if (device.saveData) return { settings: base, reason: "saveData" };

  const gpuSpeed = speeds.gpu;
  if (engineAvailability("gpu", device).ok && (!gpuSpeed || isSmooth(gpuSpeed))) {
    const fast = gpuSpeed !== undefined && gpuSpeed.decodeTps >= FAST_DECODE_TPS;
    return {
      settings: {
        ...base,
        engine: "gpu",
        length: "short",
        context: "focused",
        keepLoaded: true,
      },
      reason: fast ? "gpuFast" : "gpu",
    };
  }

  const cpuSpeed = speeds.cpu;
  const strongCpu =
    device.isolated && device.cores >= 8 && (device.memoryGB ?? MIN_MEMORY_GB * 2) >= 8;
  if (engineAvailability("cpu", device).ok && (cpuSpeed ? isSmooth(cpuSpeed) : strongCpu)) {
    return { settings: { ...base, engine: "cpu" }, reason: "cpu" };
  }

  const measuredSlow = gpuSpeed !== undefined || cpuSpeed !== undefined;
  return { settings: base, reason: measuredSlow ? "slow" : "noAi" };
}

export function generationBudget(settings: Pick<ChatSettings, "length" | "context">): {
  maxTokens: number;
  contextChunks: number;
  maxContextChars: number;
} {
  const thorough = settings.context === "thorough";
  return {
    maxTokens: settings.length === "short" ? 96 : 256,
    contextChunks: thorough ? 4 : 2,
    maxContextChars: thorough ? 3200 : 1400,
  };
}

/** Threads for CPU inference; without cross-origin isolation only one is possible. */
export function cpuThreads(
  usage: CpuUsage,
  device: Pick<DeviceProfile, "cores" | "isolated">,
): number {
  if (!device.isolated) return 1;
  const cores = Math.max(1, device.cores);
  return usage === "max" ? Math.max(1, cores - 1) : Math.max(1, Math.floor(cores / 2));
}
