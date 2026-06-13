// Synthesized UI sound effects via the Web Audio API. Kept OUT of src/lib on
// purpose: it touches AudioContext, which is browser-only and not meaningfully
// unit-testable, so it should not drag down the src/lib coverage gate.
//
// Global mute lives in localStorage ("sfx-muted"); sounds are OFF by default and
// only ever play after a user gesture (we never autoplay).

const STORAGE_KEY = "sfx-muted";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  } catch {
    return null;
  }
}

/** Muted unless the user has explicitly opted in (value "0"). Default: off. */
export function isSfxMuted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(STORAGE_KEY) !== "0";
  } catch {
    return true;
  }
}

export function setSfxMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("sfx-muted-change", { detail: muted }));
}

export function toggleSfxMuted(): boolean {
  const next = !isSfxMuted();
  setSfxMuted(next);
  return next;
}

export type SfxName = "blip" | "confirm" | "error" | "open" | "whoosh";

type Preset = { freq: number; type: OscillatorType; dur: number; vol: number; slideTo?: number };

const PRESETS: Record<SfxName, Preset> = {
  blip: { freq: 660, type: "square", dur: 0.07, vol: 0.035 },
  confirm: { freq: 720, type: "sine", dur: 0.14, vol: 0.05, slideTo: 1080 },
  error: { freq: 180, type: "sawtooth", dur: 0.18, vol: 0.05, slideTo: 80 },
  open: { freq: 520, type: "triangle", dur: 0.1, vol: 0.04, slideTo: 660 },
  whoosh: { freq: 300, type: "sine", dur: 0.2, vol: 0.04, slideTo: 520 },
};

export function playSfx(name: SfxName = "blip"): void {
  if (isSfxMuted()) return;
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume().catch(() => {});
  const now = ac.currentTime;
  const p = PRESETS[name];
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = p.type;
  osc.frequency.setValueAtTime(p.freq, now);
  if (p.slideTo) osc.frequency.exponentialRampToValueAtTime(p.slideTo, now + p.dur);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(p.vol, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + p.dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + p.dur + 0.02);
}
