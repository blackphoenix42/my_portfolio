"use client";

import { useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";

// Voice intro. The audio file is a placeholder to be replaced with a real
// recording at /public/assets/audio/intro.mp3. Never autoplays; if the file is
// missing/invalid we degrade gracefully and still expose the transcript.
const SRC = "/assets/audio/intro.mp3";

export function IntroPlayer({ className }: { className?: string }) {
  const t = useTranslations("audio");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play().catch(() => setUnavailable(true));
    }
  };

  return (
    <div className={className}>
      <div className="border-border bg-bg-elev/60 inline-flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2">
        <button
          type="button"
          onClick={toggle}
          disabled={unavailable}
          aria-label={playing ? t("pause") : t("play")}
          className="bg-accent-cyan/15 text-accent-cyan hover:bg-accent-cyan/25 inline-flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-40"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <div className="min-w-0">
          <p className="text-fg inline-flex items-center gap-1.5 text-sm font-medium">
            <Volume2 className="text-accent-cyan h-3.5 w-3.5" /> {t("introTitle")}
          </p>
          <p className="text-fg-subtle text-[11px]">
            {unavailable ? t("comingSoon") : t("introSubtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTranscript((v) => !v)}
          aria-expanded={showTranscript}
          className="border-border text-fg-muted hover:text-fg rounded-md border px-2 py-1 text-[11px]"
        >
          {t("transcriptToggle")}
        </button>
      </div>

      {showTranscript && (
        <p className="text-fg-muted mt-2 max-w-prose text-sm">{t("transcript")}</p>
      )}

      <audio
        ref={audioRef}
        src={SRC}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setUnavailable(true)}
        className="sr-only"
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}
