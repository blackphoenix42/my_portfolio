"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useEggs } from "./egg-provider";
import { setOverlayOpen } from "./overlay-state";

/**
 * Fullscreen "Matrix"-style rain overlay. Pure canvas, motion-gated.
 *
 * Triggered by typing "matrix" anywhere or via the command menu. Closes on
 * ESC, a click anywhere, or by typing "matrix" again. There is no close
 * button — the overlay is meant to be ambient and dismissed with a gesture.
 *
 * While open it marks itself in `overlay-state` so the global word/Konami
 * listeners AND the keyboard-shortcuts layer back off (otherwise typing
 * "matrix" inside the matrix would thrash theme/recruiter/locale handlers).
 */
export function MatrixRain() {
  const t = useTranslations("eggs.matrix");
  const { unlock } = useEggs();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-matrix-rain", onOpen);
    return () => window.removeEventListener("open-matrix-rain", onOpen);
  }, []);

  // Tell global listeners + shortcuts to back off while we're open.
  useEffect(() => {
    setOverlayOpen("matrix", open);
    return () => setOverlayOpen("matrix", false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    unlock("matrix-rain");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 16;
    const chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ零一二三四五六七八九012345789Z:.=*+-<>";
    const viewW = () => canvas.width / dpr;
    const viewH = () => canvas.height / dpr;
    let columns = Math.ceil(viewW() / fontSize);
    let drops = Array.from({ length: columns }, () => Math.random() * (viewH() / fontSize));
    let speeds = Array.from({ length: columns }, () => 0.4 + Math.random() * 1.1);

    const rebuildColumns = () => {
      const next = Math.ceil(viewW() / fontSize);
      if (next === columns) return;
      columns = next;
      drops = Array.from({ length: columns }, () => Math.random() * (viewH() / fontSize));
      speeds = Array.from({ length: columns }, () => 0.4 + Math.random() * 1.1);
    };

    const randChar = () => chars.charAt((Math.random() * chars.length) | 0);

    // ESC / click anywhere / typing "matrix" again all close the overlay.
    let wordBuf = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        wordBuf = (wordBuf + e.key.toLowerCase()).slice(-6);
        if (wordBuf === "matrix") setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);

    let raf = 0;
    const draw = () => {
      rebuildColumns();
      // Trail fade — translucent dark wash leaves glowing tails behind heads.
      ctx.fillStyle = reduceMotion ? "rgba(2,6,10,0.55)" : "rgba(2,6,10,0.08)";
      ctx.fillRect(0, 0, viewW(), viewH());
      ctx.font = `${fontSize}px ui-monospace, "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < columns; i++) {
        const drop = drops[i] ?? 0;
        const speed = speeds[i] ?? 1;
        const x = i * fontSize;
        const y = drop * fontSize;

        // A few characters of body trailing the head, dimming with distance.
        for (let k = 1; k <= 6; k++) {
          const ty = y - k * fontSize;
          if (ty < -fontSize) break;
          const alpha = Math.max(0, 0.5 - k * 0.07);
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(34,197,94,${alpha})`;
          ctx.fillText(randChar(), x, ty);
        }

        // Glowing leading head — bright cyan-white with a cyan halo.
        ctx.shadowColor = "rgba(34,211,238,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(207,250,254,0.98)";
        ctx.fillText(randChar(), x, y);
        ctx.shadowBlur = 0;

        if (y > viewH() && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] = drop + speed;
        }
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    if (reduceMotion) draw();
    else raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [open, unlock]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      className="fixed inset-0 z-[70] bg-black"
      onClick={() => setOpen(false)}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Vignette + scanlines for a CRT feel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* Glitchy title overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="font-mono text-[clamp(3rem,12vw,9rem)] font-bold tracking-[0.18em] text-emerald-300/10 select-none"
          style={{ textShadow: "0 0 28px rgba(34,197,94,0.4)" }}
        >
          MATRIX
        </span>
      </div>
      <p className="text-accent-cyan pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs">
        {t("hint")}
      </p>
    </div>
  );
}
