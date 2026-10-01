import type { DeviceProfile } from "@/lib/chatbot/settings";

type GpuAdapterLike = {
  features: { has(feature: string): boolean };
  isFallbackAdapter?: boolean;
  info?: {
    isFallbackAdapter?: boolean;
    vendor?: string;
    architecture?: string;
    description?: string;
  };
};
type NavigatorWithHints = Navigator & {
  gpu?: { requestAdapter(): Promise<GpuAdapterLike | null> };
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

let cached: Promise<DeviceProfile> | null = null;

/** Probes WebGPU, cores, memory and Data Saver once per page view. */
export function detectDevice(): Promise<DeviceProfile> {
  cached ??= (async () => {
    const nav = navigator as NavigatorWithHints;
    let adapter: GpuAdapterLike | null = null;
    try {
      adapter = (await nav.gpu?.requestAdapter()) ?? null;
    } catch {
      adapter = null;
    }
    const info = adapter?.info;
    const name = [info?.vendor, info?.architecture || info?.description].filter(Boolean).join(" ");
    return {
      gpu: adapter
        ? {
            f16: adapter.features.has("shader-f16"),
            fallback: info?.isFallbackAdapter === true || adapter.isFallbackAdapter === true,
            name: name || undefined,
          }
        : null,
      cores: nav.hardwareConcurrency || 4,
      memoryGB: nav.deviceMemory,
      saveData: nav.connection?.saveData === true,
      isolated: globalThis.crossOriginIsolated === true,
    };
  })();
  return cached;
}
