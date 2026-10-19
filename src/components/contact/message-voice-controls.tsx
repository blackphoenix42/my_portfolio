"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mic, MicOff, Square, AudioLines, Loader2, X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getSpeechRecognitionCtor,
  preferOnDeviceRecognition,
  transcriptFromResult,
  type SpeechRecognitionLike,
} from "./speech-types";
import { ContactToast } from "./contact-toast";

const MAX_RECORD_MS = 3 * 60 * 1000;
const MAX_DICTATE_MS = 3 * 60 * 1000;
const MESSAGE_MAX = 4000;

function pickRecorderMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

function extForMime(mime: string): string {
  if (mime.includes("mp4")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  if (mime.includes("wav")) return "wav";
  return "webm";
}

function formatMmSs(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function speechLang(locale: string): string {
  if (locale === "zh") return "zh-CN";
  if (locale === "sa" || locale === "hi") return "hi-IN";
  if (locale === "ja") return "ja-JP";
  if (locale === "ru") return "ru-RU";
  if (locale === "en") return "en-US";
  return locale;
}

type MicPermissionResult =
  | "granted"
  | "denied"
  | "unsupported"
  | "insecure"
  | "notFound"
  | "blockedByPolicy";

type DictateSlot = {
  dictateControl: ReactNode;
  dictating: boolean;
  /** Value to show in the message field (live transcript while dictating). */
  displayValue: string;
};

type MessageVoiceControlsProps = {
  message: string;
  onMessageChange: (next: string) => void;
  onAddRecording: (file: File) => void;
  disabled?: boolean;
  children: (slot: DictateSlot) => ReactNode;
};

/**
 * Dictate (mic): real-time Web Speech → text in the message box.
 * Record voice note: MediaRecorder audio attachment (not transcribed).
 */
export function MessageVoiceControls({
  message,
  onMessageChange,
  onAddRecording,
  disabled,
  children,
}: MessageVoiceControlsProps) {
  const t = useTranslations("contact.form.voice");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [dictating, setDictating] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [dictateSecs, setDictateSecs] = useState(0);
  const [liveText, setLiveText] = useState("");
  const liveTextRef = useRef("");
  const [notice, setNotice] = useState<string | null>(null);
  /** Shown while waiting on mic / speech-pack prep (before listening starts). */
  const [prepPhase, setPrepPhase] = useState<"mic" | "checking" | "installing" | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recordSupported, setRecordSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const wantDictateRef = useRef(false);
  /** Message snapshot before this dictate session (restored on Cancel). */
  const prefixRef = useRef("");
  /** Accumulated final phrases for this session (Chrome continuous API). */
  const finalsRef = useRef("");
  const onMessageChangeRef = useRef(onMessageChange);
  const messageRef = useRef(message);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordTimerRef = useRef<number | null>(null);
  const dictateTimerRef = useRef<number | null>(null);
  const recordStartedAt = useRef(0);
  const dictateStartedAt = useRef(0);
  const heardStartRef = useRef(false);
  const usingOnDeviceRef = useRef(false);

  useEffect(() => {
    onMessageChangeRef.current = onMessageChange;
  }, [onMessageChange]);

  useEffect(() => {
    messageRef.current = message;
  }, [message]);

  useEffect(() => {
    setSpeechSupported(!!getSpeechRecognitionCtor());
    setRecordSupported(
      typeof window !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== "undefined",
    );
  }, []);

  useEffect(() => {
    return () => {
      wantDictateRef.current = false;
      recognitionRef.current?.abort();
      stopTracks();
      if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
      if (dictateTimerRef.current) window.clearInterval(dictateTimerRef.current);
    };
  }, []);

  function stopTracks() {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
  }

  function clearDictateTimer() {
    if (dictateTimerRef.current) {
      window.clearInterval(dictateTimerRef.current);
      dictateTimerRef.current = null;
    }
  }

  function publish(next: string) {
    const clipped = next.slice(0, MESSAGE_MAX);
    liveTextRef.current = clipped;
    setLiveText(clipped);
    onMessageChangeRef.current(clipped);
  }

  function tearDownRecognition() {
    const rec = recognitionRef.current;
    recognitionRef.current = null;
    if (!rec) return;
    rec.onstart = null;
    rec.onresult = null;
    rec.onerror = null;
    rec.onend = null;
    try {
      rec.abort();
    } catch {
      /* ignore */
    }
  }

  /** Mic off — keep whatever was transcribed. */
  function stopDictation() {
    wantDictateRef.current = false;
    clearDictateTimer();
    const kept = (liveTextRef.current || `${prefixRef.current}${finalsRef.current}`).trimEnd();
    publish(kept);
    tearDownRecognition();
    setDictating(false);
    setDictateSecs(0);
    setPrepPhase(null);
    setNotice(null);
  }

  /** Cancel — discard this session and restore the pre-dictate message. */
  function cancelDictation() {
    wantDictateRef.current = false;
    clearDictateTimer();
    const restored = prefixRef.current.trimEnd();
    finalsRef.current = "";
    publish(restored);
    tearDownRecognition();
    setDictating(false);
    setDictateSecs(0);
    setPrepPhase(null);
    setNotice(null);
  }

  /** Cancel while mic/pack prep is running (before listening). */
  function cancelPrep() {
    wantDictateRef.current = false;
    setPrepPhase(null);
    setDictating(false);
    setDictateSecs(0);
    tearDownRecognition();
    setNotice(t("speechPackCancelled"));
  }

  function micNotice(result: MicPermissionResult): string {
    if (result === "insecure") return t("micInsecure");
    if (result === "notFound") return t("micNotFound");
    if (result === "blockedByPolicy") return t("micPolicy");
    if (result === "unsupported") return t("speechUnsupported");
    return t("micDenied");
  }

  function classifyMicError(err: unknown): MicPermissionResult {
    const name = err instanceof DOMException ? err.name : "";
    const msg = err instanceof Error ? err.message : String(err);
    if (!window.isSecureContext) return "insecure";
    if (/permissions policy|feature is disabled/i.test(msg)) return "blockedByPolicy";
    if (name === "NotFoundError" || name === "DevicesNotFoundError") return "notFound";
    if (name === "NotAllowedError" || name === "PermissionDeniedError") return "denied";
    if (name === "SecurityError") return "insecure";
    return "denied";
  }

  /**
   * Same permission prompt as “Record voice note” (getUserMedia). Release the
   * stream afterward so SpeechRecognition can open the mic itself.
   */
  async function requestMicPermissionLikeRecord(): Promise<MicPermissionResult> {
    if (!window.isSecureContext) return "insecure";
    if (!navigator.mediaDevices?.getUserMedia) return "unsupported";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ended = Promise.all(
        stream.getTracks().map(
          (tr) =>
            new Promise<void>((resolve) => {
              tr.addEventListener("ended", () => resolve(), { once: true });
              tr.stop();
              // Some browsers never fire `ended` after stop — don't hang.
              window.setTimeout(() => resolve(), 50);
            }),
        ),
      );
      await ended;
      // Brief gap so the OS releases the device before SpeechRecognition starts.
      await new Promise((r) => window.setTimeout(r, 120));
      return "granted";
    } catch (err) {
      return classifyMicError(err);
    }
  }

  async function startDictation() {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor || disabled) {
      setNotice(t("speechUnsupported"));
      return;
    }
    if (recording) stopRecording(false);
    if (!window.isSecureContext) {
      setNotice(t("micInsecure"));
      return;
    }

    wantDictateRef.current = true;
    setPrepPhase("mic");
    setNotice(null);
    const mic = await requestMicPermissionLikeRecord();
    if (!wantDictateRef.current) {
      setPrepPhase(null);
      return;
    }
    if (mic !== "granted") {
      wantDictateRef.current = false;
      setPrepPhase(null);
      setNotice(micNotice(mic));
      return;
    }

    const existing = messageRef.current.trim();
    prefixRef.current = existing ? `${existing} ` : "";
    finalsRef.current = "";
    heardStartRef.current = false;
    usingOnDeviceRef.current = false;
    setPrepPhase("checking");
    publish(existing);

    const lang = speechLang(locale);
    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let prepResult: "on-device" | "cloud" | "cancelled" = "cloud";
    try {
      prepResult = await preferOnDeviceRecognition(Ctor, recognition, lang, {
        isCancelled: () => !wantDictateRef.current,
        onStatus: (phase) => {
          if (!wantDictateRef.current) return;
          setPrepPhase(phase);
        },
      });
    } catch {
      recognition.processLocally = false;
      prepResult = "cloud";
    }

    if (prepResult === "cancelled" || !wantDictateRef.current) {
      setPrepPhase(null);
      tearDownRecognition();
      return;
    }

    usingOnDeviceRef.current = prepResult === "on-device";
    setPrepPhase(null);

    recognition.onstart = () => {
      heardStartRef.current = true;
      setNotice(null);
    };

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result) continue;
        const text = transcriptFromResult(result);
        if (result.isFinal) finalsRef.current += text;
        else interim += text;
      }
      publish(`${prefixRef.current}${finalsRef.current}${interim}`);
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") return;
      if (event.error === "no-speech") return;
      wantDictateRef.current = false;
      clearDictateTimer();
      setDictating(false);
      setDictateSecs(0);
      const kept = (liveTextRef.current || `${prefixRef.current}${finalsRef.current}`).trimEnd();
      publish(kept);
      tearDownRecognition();
      if (event.error === "not-allowed") setNotice(t("micDenied"));
      else if (event.error === "network") {
        setNotice(usingOnDeviceRef.current ? t("speechError") : t("speechNetwork"));
      } else if (event.error === "language-not-supported") setNotice(t("speechUnsupported"));
      else setNotice(t("speechError"));
    };

    recognition.onend = () => {
      if (!wantDictateRef.current) return;
      try {
        recognition.start();
      } catch {
        window.setTimeout(() => {
          if (!wantDictateRef.current) return;
          try {
            recognition.start();
          } catch {
            wantDictateRef.current = false;
            clearDictateTimer();
            setDictating(false);
            setDictateSecs(0);
            setNotice(t("speechError"));
          }
        }, 150);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setDictating(true);
      dictateStartedAt.current = Date.now();
      setDictateSecs(0);
      clearDictateTimer();
      dictateTimerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - dictateStartedAt.current;
        setDictateSecs(Math.floor(elapsed / 1000));
        if (elapsed >= MAX_DICTATE_MS) stopDictation();
      }, 250);
      window.setTimeout(() => {
        if (wantDictateRef.current && !heardStartRef.current) {
          wantDictateRef.current = false;
          clearDictateTimer();
          setDictating(false);
          setDictateSecs(0);
          tearDownRecognition();
          setNotice(t("speechNetwork"));
        }
      }, 5000);
    } catch {
      wantDictateRef.current = false;
      setNotice(t("speechError"));
      setDictating(false);
    }
  }

  function stopRecording(commit: boolean) {
    const recorder = recorderRef.current;
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (!recorder) {
      setRecording(false);
      stopTracks();
      return;
    }
    if (commit) {
      recorder.onstop = () => {
        const mime = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mime.split(";")[0] });
        chunksRef.current = [];
        stopTracks();
        setRecording(false);
        setRecordSecs(0);
        if (blob.size < 256) {
          setNotice(t("recordTooShort"));
          return;
        }
        const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
        const file = new File([blob], `voice-message-${stamp}.${extForMime(mime)}`, {
          type: blob.type || "audio/webm",
          lastModified: Date.now(),
        });
        onAddRecording(file);
        setNotice(t("recordAttached"));
      };
      if (recorder.state === "recording") recorder.stop();
      else {
        stopTracks();
        setRecording(false);
      }
    } else {
      recorder.onstop = () => {
        chunksRef.current = [];
        stopTracks();
        setRecording(false);
        setRecordSecs(0);
      };
      if (recorder.state === "recording") recorder.stop();
      else {
        stopTracks();
        setRecording(false);
      }
    }
    recorderRef.current = null;
  }

  async function startRecording() {
    if (!recordSupported || disabled) {
      setNotice(t("recordUnsupported"));
      return;
    }
    if (dictating) stopDictation();
    setNotice(t("requestingMic"));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickRecorderMime();
      const recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorderRef.current = recorder;
      recorder.start(250);
      recordStartedAt.current = Date.now();
      setRecording(true);
      setRecordSecs(0);
      setNotice(null);
      recordTimerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - recordStartedAt.current;
        setRecordSecs(Math.floor(elapsed / 1000));
        if (elapsed >= MAX_RECORD_MS) stopRecording(true);
      }, 250);
    } catch (err) {
      setNotice(micNotice(classifyMicError(err)));
      stopTracks();
      setRecording(false);
    }
  }

  const preparing = prepPhase !== null;

  const dictateControl = speechSupported ? (
    <button
      type="button"
      disabled={disabled || recording || preparing}
      aria-pressed={dictating}
      aria-label={dictating ? t("dictateOffAria") : t("dictateOnAria")}
      title={dictating ? t("dictateOff") : t("dictateOn")}
      onClick={() => (dictating ? stopDictation() : void startDictation())}
      className={cn(
        "absolute right-2 bottom-2 z-10 grid h-9 w-9 place-items-center rounded-md border transition-colors",
        dictating
          ? "border-accent-cyan/50 bg-accent-cyan/15 text-accent-cyan"
          : "border-border bg-bg-elev/90 text-fg-muted hover:border-accent-cyan/40 hover:text-fg",
        (disabled || recording || preparing) && "opacity-50",
      )}
    >
      {dictating ? (
        <MicOff className={cn("h-4 w-4", !reduce && "animate-pulse")} aria-hidden />
      ) : (
        <Mic className="h-4 w-4" aria-hidden />
      )}
    </button>
  ) : null;

  const displayValue = dictating ? liveText : message;

  if (!speechSupported && !recordSupported) {
    return (
      <>
        {children({ dictateControl: null, dictating: false, displayValue: message })}
        <p className="text-fg-subtle text-[11px]" role="note">
          {t("unavailable")}
        </p>
      </>
    );
  }

  return (
    <>
      {children({ dictateControl, dictating, displayValue })}
      <div className="grid gap-1.5">
        {prepPhase && (
          <div
            role="status"
            className="border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan grid gap-2 rounded-md border px-2.5 py-2 text-xs"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <span className="inline-flex items-start gap-2 font-medium">
                <Loader2
                  className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", !reduce && "animate-spin")}
                  aria-hidden
                />
                <span className="grid gap-1">
                  <span>
                    {prepPhase === "installing"
                      ? t("installingSpeechPackTitle")
                      : prepPhase === "mic"
                        ? t("requestingMic")
                        : t("preparingSpeech")}
                  </span>
                  {prepPhase === "installing" && (
                    <>
                      <span className="text-accent-cyan/90 font-normal">
                        {t("installingSpeechPack")}
                      </span>
                      <span className="text-fg-subtle font-normal">
                        {t("installingSpeechPackHint")}
                      </span>
                    </>
                  )}
                </span>
              </span>
              <button
                type="button"
                onClick={cancelPrep}
                className="border-accent-cyan/40 hover:bg-accent-cyan/15 inline-flex shrink-0 items-center gap-1 rounded border px-2 py-0.5 font-medium transition-colors"
              >
                <X className="h-3 w-3" aria-hidden />
                {t("cancelSpeechPack")}
              </button>
            </div>
          </div>
        )}
        {dictating && !prepPhase && (
          <div
            role="status"
            className="border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan flex flex-wrap items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-xs"
          >
            <span className="inline-flex items-center gap-2 font-medium">
              <Loader2 className={cn("h-3.5 w-3.5", !reduce && "animate-spin")} aria-hidden />
              {t("transcribing", { time: formatMmSs(dictateSecs) })}
            </span>
            <button
              type="button"
              onClick={cancelDictation}
              className="border-accent-cyan/40 hover:bg-accent-cyan/15 inline-flex items-center gap-1 rounded border px-2 py-0.5 font-medium transition-colors"
            >
              <X className="h-3 w-3" aria-hidden />
              {t("cancelDictate")}
            </button>
          </div>
        )}
        {recordSupported && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabled || dictating || preparing}
              aria-pressed={recording}
              onClick={() => (recording ? stopRecording(true) : void startRecording())}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                recording
                  ? "border-accent-amber/50 bg-accent-amber/15 text-accent-amber"
                  : "border-border bg-bg-elev/50 text-fg-muted hover:border-accent-amber/40 hover:text-fg",
                disabled && "opacity-50",
              )}
            >
              {recording ? (
                <Square className={cn("h-3.5 w-3.5", !reduce && "animate-pulse")} aria-hidden />
              ) : (
                <AudioLines className="h-3.5 w-3.5" aria-hidden />
              )}
              {recording ? t("stopRecording", { time: formatMmSs(recordSecs) }) : t("record")}
            </button>
          </div>
        )}
      </div>
      <ContactToast message={notice} onDismiss={() => setNotice(null)} />
    </>
  );
}
