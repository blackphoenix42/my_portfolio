/** Minimal Web Speech API typings (not in all TS DOM libs). */

export type SpeechRecognitionAlternativeLike = {
  readonly transcript: string;
  readonly confidence?: number;
};

export type SpeechRecognitionResultLike = {
  readonly isFinal: boolean;
  readonly length: number;
  item: (index: number) => SpeechRecognitionAlternativeLike;
  readonly 0?: SpeechRecognitionAlternativeLike;
};

export type SpeechRecognitionEventLike = {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechRecognitionResultLike> & { readonly length: number };
};

export type SpeechRecognitionErrorEventLike = {
  readonly error: string;
};

export type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  /** Chrome 139+: force on-device recognition (no Google cloud round-trip). */
  processLocally?: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

export type SpeechRecognitionAvailability =
  | "available"
  | "downloadable"
  | "downloading"
  | "unavailable";

export type SpeechRecognitionConstructor = (new () => SpeechRecognitionLike) & {
  available?: (options: {
    langs: string[];
    processLocally?: boolean;
  }) => Promise<SpeechRecognitionAvailability>;
  install?: (options: { langs: string[]; processLocally?: boolean }) => Promise<boolean>;
};

export function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function transcriptFromResult(result: SpeechRecognitionResultLike): string {
  const alt = result[0] ?? (result.length > 0 ? result.item(0) : undefined);
  return alt?.transcript ?? "";
}

export function supportsProcessLocally(recognition: SpeechRecognitionLike): boolean {
  return typeof recognition.processLocally === "boolean" || "processLocally" in recognition;
}

export type OnDevicePrepResult = "on-device" | "cloud" | "cancelled";

/**
 * Prefer on-device packs (Chrome 139+) so dictation does not need Google’s
 * cloud speech endpoint — that path often fails behind strict networks/CSP.
 * `isCancelled` lets the UI abort waiting (the browser may still finish a
 * pack download in the background; that isn’t abortable from the page).
 */
export async function preferOnDeviceRecognition(
  Ctor: SpeechRecognitionConstructor,
  recognition: SpeechRecognitionLike,
  lang: string,
  options?: {
    onStatus?: (phase: "checking" | "installing") => void;
    isCancelled?: () => boolean;
  },
): Promise<OnDevicePrepResult> {
  const cancelled = () => options?.isCancelled?.() === true;

  if (!supportsProcessLocally(recognition)) return "cloud";

  recognition.processLocally = true;

  if (typeof Ctor.available !== "function") {
    return cancelled() ? "cancelled" : "on-device";
  }

  options?.onStatus?.("checking");
  if (cancelled()) {
    recognition.processLocally = false;
    return "cancelled";
  }

  let status = await Ctor.available({ langs: [lang], processLocally: true });
  if (cancelled()) {
    recognition.processLocally = false;
    return "cancelled";
  }

  if (status === "downloadable" || status === "downloading") {
    if (typeof Ctor.install !== "function") {
      recognition.processLocally = false;
      return "cloud";
    }
    options?.onStatus?.("installing");
    const ok = await Ctor.install({ langs: [lang], processLocally: true });
    if (cancelled()) {
      recognition.processLocally = false;
      return "cancelled";
    }
    if (!ok) {
      recognition.processLocally = false;
      return "cloud";
    }
    status = await Ctor.available({ langs: [lang], processLocally: true });
  }

  if (cancelled()) {
    recognition.processLocally = false;
    return "cancelled";
  }

  if (status === "available") return "on-device";

  recognition.processLocally = false;
  return "cloud";
}
