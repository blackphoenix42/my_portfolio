import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SETTINGS_KEY, type DeviceProfile } from "@/lib/chatbot/settings";
import { useLocalLlm } from "../use-local-llm";

const mocks = vi.hoisted(() => {
  const engine = () => ({
    load: vi.fn(),
    unload: vi.fn(),
    interrupt: vi.fn(),
    scheduleUnload: vi.fn(),
    stream: vi.fn(),
  });
  return {
    gpu: engine(),
    cpu: engine(),
    detect: vi.fn(),
    gpuFactory: vi.fn(),
    cpuFactory: vi.fn(),
    deleteGpu: vi.fn(),
    deleteCpu: vi.fn(),
  };
});
vi.mock("../device", () => ({ detectDevice: mocks.detect }));
vi.mock("../gpu-engine", () => ({ gpuEngine: mocks.gpuFactory, deleteGpuModels: mocks.deleteGpu }));
vi.mock("../cpu-engine", () => ({ cpuEngine: mocks.cpuFactory, deleteCpuModels: mocks.deleteCpu }));

const profile: DeviceProfile = {
  gpu: { f16: true, fallback: false },
  cores: 8,
  memoryGB: 8,
  isolated: false,
  saveData: false,
};
const speed = { decodeTps: 25, prefillTps: 200 };
beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  mocks.detect.mockResolvedValue(profile);
  mocks.gpuFactory.mockReturnValue(mocks.gpu);
  mocks.cpuFactory.mockReturnValue(mocks.cpu);
  mocks.gpu.load.mockResolvedValue(speed);
  mocks.cpu.load.mockResolvedValue(speed);
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("local AI lifecycle", () => {
  it("removes both caches, releases the runtime and persists AI off", async () => {
    const { result } = renderHook(useLocalLlm);
    await waitFor(() => expect(result.current.device).toEqual(profile));
    act(() => result.current.update({ engine: "gpu" }));
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    await act(async () => {
      await result.current.removeModels();
    });
    expect(mocks.gpu.unload).toHaveBeenCalled();
    expect(mocks.deleteGpu).toHaveBeenCalledOnce();
    expect(mocks.deleteCpu).toHaveBeenCalledOnce();
    expect(result.current.removal).toBe("removed");
    expect(result.current.settings).toMatchObject({ engine: "quick", speeds: {} });
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({ engine: "quick" });
  });
  it("attempts both deletions and reports partial failure without reloading AI", async () => {
    mocks.deleteGpu.mockRejectedValue(new Error("cache locked"));
    const { result } = renderHook(useLocalLlm);
    await act(async () => {
      await result.current.removeModels();
    });
    expect(result.current.removal).toBe("error");
    expect(mocks.deleteCpu).toHaveBeenCalledOnce();
    expect(result.current.settings.engine).toBe("quick");
  });
  it("keeps quick answers as the default without loading a runtime", async () => {
    const { result } = renderHook(useLocalLlm);
    await waitFor(() => expect(result.current.device).toEqual(profile));
    expect(result.current.settings.engine).toBe("quick");
    expect(mocks.gpuFactory).not.toHaveBeenCalled();
    expect(mocks.cpuFactory).not.toHaveBeenCalled();
  });

  it("switches between GPU, CPU and off, releasing the previous runtime", async () => {
    const { result, unmount } = renderHook(useLocalLlm);
    await waitFor(() => expect(result.current.device).toEqual(profile));
    act(() => result.current.update({ engine: "gpu" }));
    await waitFor(() => expect(result.current.state).toEqual({ status: "ready", engine: "gpu" }));
    expect(result.current.settings.speeds.gpu).toEqual(speed);
    act(() => result.current.update({ engine: "cpu" }));
    await waitFor(() => expect(result.current.state).toEqual({ status: "ready", engine: "cpu" }));
    expect(mocks.gpu.unload).toHaveBeenCalled();
    expect(mocks.cpuFactory).toHaveBeenCalledWith(1);
    act(() => result.current.update({ engine: "quick" }));
    await waitFor(() => expect(result.current.state.status).toBe("off"));
    expect(mocks.cpu.unload).toHaveBeenCalled();
    expect(result.current.runtime.current).toBeNull();
    unmount();
  });

  it("returns to quick answers if AI loading fails", async () => {
    mocks.cpu.load.mockRejectedValue(new Error("network unavailable"));
    const { result } = renderHook(useLocalLlm);
    await waitFor(() => expect(result.current.device).toEqual(profile));
    act(() => result.current.update({ engine: "cpu" }));
    await waitFor(() => expect(result.current.state.status).toBe("fallback"));
    expect(result.current.settings.engine).toBe("quick");
    expect(result.current.runtime.current).toBeNull();
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({ engine: "quick" });
  });

  it("does not revive a cancelled download when it finishes late", async () => {
    let finish!: (value: typeof speed) => void;
    mocks.gpu.load.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const { result } = renderHook(useLocalLlm);
    await waitFor(() => expect(result.current.device).toEqual(profile));
    act(() => result.current.update({ engine: "gpu" }));
    await waitFor(() => expect(mocks.gpu.load).toHaveBeenCalled());
    act(() => result.current.update({ engine: "quick" }));
    await act(async () => {
      finish(speed);
    });
    expect(result.current.state.status).toBe("off");
    expect(result.current.runtime.current).toBeNull();
  });

  it("releases on close by default and honors the optional warm period", async () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ engine: "gpu", keepLoaded: true }));
    const { result, unmount } = renderHook(useLocalLlm);
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    unmount();
    expect(mocks.gpu.interrupt).toHaveBeenCalled();
    expect(mocks.gpu.scheduleUnload).toHaveBeenCalledWith(120_000);
    expect(mocks.gpu.unload).not.toHaveBeenCalled();
  });

  it("does not load a saved GPU preference on an unsupported device", async () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ engine: "gpu" }));
    mocks.detect.mockResolvedValue({ ...profile, gpu: null });
    const { result } = renderHook(useLocalLlm);
    await waitFor(() => expect(result.current.state.status).toBe("fallback"));
    expect(mocks.gpuFactory).not.toHaveBeenCalled();
    expect(result.current.settings.engine).toBe("quick");
  });
});
