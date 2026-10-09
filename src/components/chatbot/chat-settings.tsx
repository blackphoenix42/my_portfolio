"use client";

import { useTranslations } from "next-intl";
import { CPU_MODEL, LLM_DOWNLOAD_MB, LLM_MODEL_NAME } from "@/lib/chatbot/llm";
import {
  ENGINES,
  engineAvailability,
  recommendSettings,
  type ChatSettings,
  type DeviceProfile,
  type Preferences,
} from "@/lib/chatbot/settings";
import type { LocalLlmState } from "./use-local-llm";

export function ChatSettingsPanel({
  settings,
  device,
  state,
  onChange,
  onBack,
  removal,
  onRemove,
  busy = false,
}: {
  settings: ChatSettings;
  device: DeviceProfile | null;
  state: LocalLlmState;
  onChange: (patch: Partial<Preferences>) => void;
  onBack: () => void;
  removal: "idle" | "removing" | "removed" | "error";
  onRemove: () => Promise<void>;
  busy?: boolean;
}) {
  const t = useTranslations("chatbot.settings");
  const recommendation = device ? recommendSettings(device, settings.speeds) : null;
  const control = "border-border bg-bg-sunken text-fg mt-1 w-full rounded-md border p-2 text-xs";
  return (
    <section
      aria-label={t("title")}
      className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-xs"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{t("title")}</h2>
        <button type="button" className="text-accent-cyan hover:underline" onClick={onBack}>
          {t("back")}
        </button>
      </div>
      <p className="text-fg-muted">{t("intro")}</p>
      <fieldset className="space-y-2" disabled={busy || removal === "removing"}>
        <legend className="mb-2 font-semibold">{t("engineLabel")}</legend>
        {ENGINES.map((engine) => {
          const availability =
            engine === "quick" || engine === "server"
              ? { ok: true as const }
              : device
                ? engineAvailability(engine, device)
                : null;
          const available = availability?.ok === true;
          const speed = engine === "gpu" || engine === "cpu" ? settings.speeds[engine] : undefined;
          return (
            <label
              key={engine}
              className="border-border has-checked:border-accent-cyan/60 block rounded-lg border p-3"
            >
              <span className="flex items-center gap-2 font-medium">
                <input
                  type="radio"
                  name="chat-engine"
                  aria-label={t(`engines.${engine}.label`)}
                  value={engine}
                  checked={settings.engine === engine}
                  disabled={!available}
                  onChange={() => onChange({ engine })}
                  aria-describedby={`chat-${engine}-help`}
                  className="accent-accent-cyan"
                />
                {t(`engines.${engine}.label`)}
              </span>
              <span id={`chat-${engine}-help`} className="text-fg-muted mt-1 block leading-relaxed">
                {t(`engines.${engine}.help`)}
              </span>
              {(engine === "gpu" || engine === "cpu") && (
                <span className="text-fg-subtle mt-1 block">
                  {t("download", {
                    model: engine === "gpu" ? LLM_MODEL_NAME : CPU_MODEL.name,
                    size: engine === "gpu" ? LLM_DOWNLOAD_MB : CPU_MODEL.downloadMB,
                  })}
                </span>
              )}
              {!availability && <span className="text-fg-subtle mt-1 block">{t("checking")}</span>}
              {availability && !availability.ok && (
                <span className="text-fg-subtle mt-1 block">
                  {t(`unavailable.${availability.reason}`)}
                </span>
              )}
              {speed && (
                <span className="text-fg-subtle mt-1 block">
                  {t("speed", { speed: Math.round(speed.decodeTps) })}
                </span>
              )}
            </label>
          );
        })}
      </fieldset>
      {recommendation && (
        <div className="bg-accent-cyan/5 border-accent-cyan/20 space-y-2 rounded-lg border p-3">
          <p className="font-medium">{t("recommended")}</p>
          <p className="text-fg-muted">{t(`recommendations.${recommendation.reason}`)}</p>
          <button
            type="button"
            className="text-accent-cyan hover:underline"
            onClick={() => onChange(recommendation.settings)}
          >
            {t("apply")}
          </button>
          <p className="text-fg-subtle">{t("applyHint")}</p>
        </div>
      )}
      <label className="block font-medium">
        {t("lengthLabel")}
        <select
          className={control}
          value={settings.length}
          onChange={(e) => onChange({ length: e.target.value as ChatSettings["length"] })}
        >
          <option value="short">{t("short")}</option>
          <option value="detailed">{t("detailed")}</option>
        </select>
        <span className="text-fg-muted mt-1 block font-normal">{t("lengthHelp")}</span>
      </label>
      <label className="block font-medium">
        {t("contextLabel")}
        <select
          className={control}
          value={settings.context}
          onChange={(e) => onChange({ context: e.target.value as ChatSettings["context"] })}
        >
          <option value="focused">{t("focused")}</option>
          <option value="thorough">{t("thorough")}</option>
        </select>
        <span className="text-fg-muted mt-1 block font-normal">{t("contextHelp")}</span>
      </label>
      {settings.engine === "cpu" && (
        <label className="block font-medium">
          {t("cpuLabel")}
          <select
            className={control}
            value={settings.cpuUsage}
            disabled={!device?.isolated}
            onChange={(e) => onChange({ cpuUsage: e.target.value as ChatSettings["cpuUsage"] })}
          >
            <option value="balanced">{t("balanced")}</option>
            <option value="max">{t("max")}</option>
          </select>
          <span className="text-fg-muted mt-1 block font-normal">
            {t(device?.isolated ? "cpuHelp" : "singleThread")}
          </span>
        </label>
      )}
      <label className="block">
        <span className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={settings.keepLoaded}
            onChange={(e) => onChange({ keepLoaded: e.target.checked })}
            className="accent-accent-cyan"
          />
          {t("keepLoaded")}
        </span>
        <span className="text-fg-muted mt-1 block">{t("keepLoadedHelp")}</span>
      </label>
      <div className="border-border space-y-2 border-t pt-3">
        <button
          type="button"
          className="btn-secondary text-xs"
          disabled={busy || removal === "removing"}
          onClick={() => void onRemove()}
        >
          {t(removal === "removing" ? "removingModels" : "removeModels")}
        </button>
        <p className="text-fg-subtle">{t("removeHelp")}</p>
        {removal === "removed" && <p role="status">{t("modelsRemoved")}</p>}
        {removal === "error" && <p role="alert">{t("removeError")}</p>}
      </div>
      {state.status === "loading" && (
        <button
          type="button"
          className="text-accent-cyan hover:underline"
          onClick={() => onChange({ engine: "quick" })}
        >
          {t("cancel")}
        </button>
      )}
    </section>
  );
}
