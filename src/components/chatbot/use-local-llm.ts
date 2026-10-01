"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SETTINGS_KEY,
  cpuThreads,
  engineAvailability,
  parseSettings,
  type AiEngine,
  type ChatSettings,
  type DeviceProfile,
  type Preferences,
} from "@/lib/chatbot/settings";
import { detectDevice } from "./device";
import type { LocalEngine, LoadStatus } from "./engine-types";

export type LocalLlmState =
  | { status: "off" }
  | { status: "fallback" }
  | { status: "loading"; engine: AiEngine; progress: LoadStatus }
  | { status: "ready"; engine: AiEngine };

export function useLocalLlm() {
  const [settings, setSettings] = useState<ChatSettings>(() => {
    try {
      return parseSettings(localStorage.getItem(SETTINGS_KEY));
    } catch {
      return parseSettings(null);
    }
  });
  const [device, setDevice] = useState<DeviceProfile | null>(null);
  const [state, setState] = useState<LocalLlmState>({ status: "off" });
  const runtime = useRef<LocalEngine | null>(null);
  const keepLoaded = useRef(settings.keepLoaded);
  const [removal, setRemoval] = useState<"idle" | "removing" | "removed" | "error">("idle");
  const deleting = useRef(false);

  useEffect(() => {
    let active = true;
    void detectDevice().then((profile) => {
      if (active) setDevice(profile);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    keepLoaded.current = settings.keepLoaded;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Private browsing and full storage still allow session-only settings.
    }
  }, [settings]);

  const update = useCallback((patch: Partial<Preferences>) => {
    if (deleting.current) return;
    setRemoval("idle");
    setSettings((previous) => ({ ...previous, ...patch }));
  }, []);
  const removeModels = useCallback(async () => {
    if (deleting.current) return;
    deleting.current = true;
    setRemoval("removing");
    keepLoaded.current = false;
    runtime.current?.unload();
    runtime.current = null;
    setSettings((previous) => ({ ...previous, engine: "quick", speeds: {} }));
    setState({ status: "off" });
    const results = await Promise.allSettled([
      import("./gpu-engine").then((m) => m.deleteGpuModels()),
      import("./cpu-engine").then((m) => m.deleteCpuModels()),
    ]);
    setRemoval(results.every((r) => r.status === "fulfilled") ? "removed" : "error");
    deleting.current = false;
  }, []);
  const fail = useCallback(() => {
    runtime.current?.unload();
    runtime.current = null;
    setState({ status: "fallback" });
    setSettings((previous) => ({ ...previous, engine: "quick" }));
  }, []);

  useEffect(() => {
    // Switching engines always releases the previous runtime immediately.
    runtime.current?.unload();
    runtime.current = null;
    let active = true;
    let engine: LocalEngine | null = null;
    const selected = settings.engine;

    async function start() {
      if (selected === "quick" || !device || deleting.current) {
        setState((previous) => (previous.status === "fallback" ? previous : { status: "off" }));
        return;
      }
      if (!engineAvailability(selected, device).ok) {
        fail();
        return;
      }
      setState({
        status: "loading",
        engine: selected,
        progress: { phase: "download", fraction: 0 },
      });
      try {
        if (selected === "gpu") {
          const { gpuEngine } = await import("./gpu-engine");
          if (!active || deleting.current) return;
          engine = gpuEngine(device.gpu?.f16 === true);
        } else {
          const { cpuEngine } = await import("./cpu-engine");
          if (!active || deleting.current) return;
          engine = cpuEngine(cpuThreads(settings.cpuUsage, device));
        }
        runtime.current = engine;
        const speed = await engine.load((progress) => {
          if (active && runtime.current === engine && !deleting.current)
            setState({ status: "loading", engine: selected, progress });
        });
        if (!active || runtime.current !== engine || deleting.current) return;
        setSettings((previous) => ({
          ...previous,
          speeds: { ...previous.speeds, [selected]: speed },
        }));
        setState({ status: "ready", engine: selected });
      } catch {
        if (active && !deleting.current) fail();
      }
    }
    void start();
    return () => {
      active = false;
      engine?.interrupt();
      if (keepLoaded.current) engine?.scheduleUnload(120_000);
      else engine?.unload();
    };
  }, [device, settings.engine, settings.cpuUsage, fail]);

  return { settings, device, state, runtime, update, fail, removal, removeModels };
}
