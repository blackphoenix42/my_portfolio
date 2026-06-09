"use client";

/**
 * Phoenix Run — a Chrome-dino-style endless runner reskinned as a flaming
 * phoenix soaring over a volcanic world. Lives on the 404 page and doubles as
 * an easter egg: crossing **500** unlocks `dino-score-5`, and collecting five
 * golden feathers unlocks `feather-score-5`.
 *
 * Self-contained: all mutable game state lives in refs (so gameplay never
 * triggers React re-renders), the HUD is painted onto the canvas, and React
 * state is used only for the coarse status / toggles. Pure Canvas 2D — no game
 * engine, no assets. SSR-safe (everything browser-only runs inside effects),
 * with full listener + rAF cleanup on unmount.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Flame,
  HelpCircle,
  Home,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useEggs } from "./egg-provider";
import { setOverlayOpen } from "./overlay-state";

type Status = "idle" | "running" | "paused" | "over";

type ObstacleKind = "spike" | "raven" | "meteor" | "pillar" | "ring" | "rock";
type PowerKind = "shield" | "feather" | "burst" | "slow" | "double";

type Obstacle = {
  kind: ObstacleKind;
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  phase: number;
  dead?: boolean;
};

type PowerUp = { kind: PowerKind; x: number; y: number; r: number; phase: number; dead?: boolean };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: number;
};

type Game = {
  w: number;
  h: number;
  groundY: number;
  px: number;
  py: number;
  vy: number;
  wing: number;
  score: number;
  speed: number;
  baseSpeed: number;
  spawnIn: number;
  powerIn: number;
  obstacles: Obstacle[];
  powers: PowerUp[];
  trail: Particle[];
  embers: Particle[];
  bursts: Particle[];
  parallax: [number, number, number];
  shake: number;
  invuln: number;
  shieldUntil: number;
  slowUntil: number;
  doubleUntil: number;
  shield: boolean;
  rebirthCharge: boolean;
  inferno: boolean;
  feathers: number;
  multiplier: number;
  milestoneText: string;
  milestoneUntil: number;
  reachedMilestones: Set<number>;
  unlockedScoreEgg: boolean;
  unlockedFeatherEgg: boolean;
  elapsed: number;
};

const ASPECT = 0.52; // height / width
const MAX_H = 420;
const GRAVITY = 2300;
const JUMP_V = -700;
const DIVE_V = 980;
const PHX_W = 30;
const PHX_H = 22;

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function phxBox(g: Game) {
  return { x: g.px - PHX_W / 2 + 3, y: g.py - PHX_H / 2 + 3, w: PHX_W - 6, h: PHX_H - 6 };
}

function hitObstacle(g: Game, o: Obstacle): boolean {
  if (o.kind === "ring") {
    // The rim is solid; the hole in the middle is safe to fly through.
    const outer = o.w / 2;
    const inner = outer - 12;
    const dx = g.px - o.x;
    const dy = g.py - o.y;
    const d = Math.hypot(dx, dy);
    return d > inner - 4 && d < outer + 4 && Math.abs(dx) < outer && Math.abs(dy) < outer;
  }
  const b = phxBox(g);
  return b.x < o.x + o.w && b.x + b.w > o.x && b.y < o.y + o.h && b.y + b.h > o.y;
}

function explode(g: Game, x: number, y: number, count: number, hue: number): void {
  for (let i = 0; i < count; i++) {
    const a = rand(0, Math.PI * 2);
    const sp = rand(40, 320);
    g.bursts.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 0,
      max: rand(0.4, 0.9),
      size: rand(1.5, 4),
      hue: hue + rand(-12, 12),
    });
  }
  g.shake = Math.max(g.shake, 10);
}

export function PhoenixRun() {
  const t = useTranslations("notFound.game");
  const reduce = useReducedMotion();
  const { progress, unlock, setDinoHighScore, setFeatherHighScore } = useEggs();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);
  const rafRef = useRef<number>(0);
  const audioRef = useRef<AudioContext | null>(null);
  const swipeRef = useRef<{ y: number; t: number } | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [feathersRun, setFeathersRun] = useState(0);
  const highScore = progress.dinoHighScore;
  const mutedRef = useRef(false);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // ---- audio (Web Audio, created lazily after a user gesture) --------------
  const beep = useCallback((freq: number, dur: number, type: OscillatorType, gain: number) => {
    if (mutedRef.current) return;
    const ctx = audioRef.current;
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {
      /* audio unavailable */
    }
  }, []);

  const sfx = useCallback(
    (name: "flap" | "power" | "hit" | "rebirth" | "milestone") => {
      switch (name) {
        case "flap":
          beep(520, 0.12, "triangle", 0.04);
          break;
        case "power":
          beep(740, 0.18, "sine", 0.06);
          window.setTimeout(() => beep(990, 0.16, "sine", 0.05), 70);
          break;
        case "hit":
          beep(150, 0.3, "sawtooth", 0.09);
          break;
        case "rebirth":
          beep(220, 0.5, "sawtooth", 0.12);
          window.setTimeout(() => beep(660, 0.4, "sine", 0.08), 120);
          break;
        case "milestone":
          beep(660, 0.18, "sine", 0.05);
          window.setTimeout(() => beep(880, 0.22, "sine", 0.05), 90);
          break;
      }
    },
    [beep],
  );

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return;
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) audioRef.current = new Ctor();
    } catch {
      /* blocked */
    }
  }, []);

  // ---- canvas sizing -------------------------------------------------------
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const fs = Boolean(document.fullscreenElement);
    const cssW = container.clientWidth;
    const cssH = fs ? container.clientHeight : Math.min(Math.round(cssW * ASPECT), MAX_H);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.height = `${cssH}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = gameRef.current;
    if (g) {
      g.w = cssW;
      g.h = cssH;
      g.groundY = cssH - Math.max(40, cssH * 0.14);
    }
  }, []);

  const newGame = useCallback((): Game => {
    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas ? canvas.width / dpr : 800;
    const h = canvas ? canvas.height / dpr : 400;
    const groundY = h - Math.max(40, h * 0.14);
    const embers: Particle[] = [];
    for (let i = 0; i < 26; i++) {
      embers.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-8, -2),
        vy: rand(-22, -8),
        life: rand(0, 4),
        max: 4,
        size: rand(1, 2.6),
        hue: rand(18, 40),
      });
    }
    return {
      w,
      h,
      groundY,
      px: w * 0.2,
      py: groundY - 60,
      vy: 0,
      wing: 0,
      score: 0,
      speed: 260,
      baseSpeed: 260,
      spawnIn: 1.1,
      powerIn: rand(4, 7),
      obstacles: [],
      powers: [],
      trail: [],
      embers,
      bursts: [],
      parallax: [0, 0, 0],
      shake: 0,
      invuln: 1,
      shieldUntil: 0,
      slowUntil: 0,
      doubleUntil: 0,
      shield: false,
      rebirthCharge: false,
      inferno: false,
      feathers: 0,
      multiplier: 1,
      milestoneText: "",
      milestoneUntil: 0,
      reachedMilestones: new Set<number>(),
      unlockedScoreEgg: false,
      unlockedFeatherEgg: false,
      elapsed: 0,
    };
  }, []);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    g.vy = JUMP_V;
    g.wing = 0;
    sfx("flap");
  }, [sfx]);

  const dive = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    g.vy = Math.max(g.vy + DIVE_V, DIVE_V * 0.7);
  }, []);

  // Kept in a ref so the rAF loop always sees the latest closures.
  const endGameRef = useRef<() => void>(() => {});
  const endGame = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    const sc = Math.floor(g.score);
    setFinalScore(sc);
    setFeathersRun(g.feathers);
    setDinoHighScore(sc);
    setFeatherHighScore(g.feathers);
    sfx("hit");
    setStatus("over");
  }, [setDinoHighScore, setFeatherHighScore, sfx]);
  useEffect(() => {
    endGameRef.current = endGame;
  }, [endGame]);

  const collectPower = useCallback(
    (g: Game, p: PowerUp, now: number) => {
      sfx("power");
      explode(g, p.x, p.y, 14, 190);
      switch (p.kind) {
        case "shield":
          g.shield = true;
          break;
        case "feather":
          g.feathers += 1;
          g.score += 60;
          if (g.feathers >= 5 && !g.unlockedFeatherEgg) {
            g.unlockedFeatherEgg = true;
            unlock("feather-score-5");
          }
          break;
        case "burst":
          for (const o of g.obstacles) {
            if (o.x < g.w * 0.85) {
              o.dead = true;
              explode(g, o.x + o.w / 2, o.y + o.h / 2, 10, 30);
            }
          }
          break;
        case "slow":
          g.slowUntil = now + 4.5;
          break;
        case "double":
          g.doubleUntil = now + 7;
          break;
      }
    },
    [sfx, unlock],
  );

  // ---- the loop ------------------------------------------------------------
  useEffect(() => {
    if (status !== "running") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let g = gameRef.current;
    if (!g) {
      g = newGame();
      gameRef.current = g;
    }

    let last = performance.now();
    let stopped = false;
    const milestones: { score: number; key: "ms500" | "ms1000" | "ms2000" | "ms5000" }[] = [
      { score: 500, key: "ms500" },
      { score: 1000, key: "ms1000" },
      { score: 2000, key: "ms2000" },
      { score: 5000, key: "ms5000" },
    ];

    const spawnObstacle = (game: Game) => {
      const s = game.score;
      const pool: ObstacleKind[] = ["spike", "pillar", "rock"];
      if (s > 500) pool.push("raven", "ring");
      if (s > 1000) pool.push("meteor");
      const kind = pool[Math.floor(Math.random() * pool.length)] ?? "spike";
      const gy = game.groundY;
      // Default = spike; non-spike kinds override below (keeps `o` definitely
      // assigned for strict TS).
      let o: Obstacle = {
        kind: "spike",
        x: game.w + 20,
        y: gy - 26,
        w: 24,
        h: 26,
        vy: 0,
        phase: 0,
      };
      if (kind === "pillar") {
        const py = gy - rand(46, 80);
        o = { kind, x: game.w + 20, y: py, w: 22, h: gy - py, vy: 0, phase: 0 };
      } else if (kind === "rock") {
        o = { kind, x: game.w + 20, y: gy - 16, w: 28, h: 16, vy: 0, phase: 0 };
      } else if (kind === "raven") {
        o = {
          kind,
          x: game.w + 20,
          y: rand(gy - 150, gy - 70),
          w: 30,
          h: 20,
          vy: 0,
          phase: rand(0, 6),
        };
      } else if (kind === "ring") {
        o = { kind, x: game.w + 40, y: rand(gy - 150, gy - 80), w: 78, h: 78, vy: 0, phase: 0 };
      } else if (kind === "meteor") {
        o = { kind, x: game.w + rand(0, 120), y: -30, w: 26, h: 26, vy: rand(160, 240), phase: 0 };
      }
      game.obstacles.push(o);
    };

    const spawnPower = (game: Game) => {
      // Feathers are weighted highest — they're the collectible egg.
      const pool: PowerKind[] =
        game.score > 800
          ? ["feather", "feather", "shield", "slow", "double", "burst"]
          : ["shield", "feather", "burst", "slow", "double"];
      const kind = pool[Math.floor(Math.random() * pool.length)] ?? "feather";
      game.powers.push({
        kind,
        x: game.w + 30,
        y: rand(game.groundY - 150, game.groundY - 50),
        r: 14,
        phase: rand(0, 6),
        dead: false,
      });
    };

    const step = (game: Game, dt: number, now: number) => {
      game.elapsed += dt;
      // Difficulty ramp.
      game.inferno = game.score >= 2000;
      const slowFactor = now < game.slowUntil ? 0.5 : 1;
      const infernoBoost = game.inferno ? 1.25 : 1;
      game.speed = (game.baseSpeed + Math.min(game.score * 0.06, 380)) * infernoBoost * slowFactor;
      game.multiplier = (now < game.doubleUntil ? 2 : 1) * (game.inferno ? 1.5 : 1);
      game.score += dt * 100 * game.multiplier;

      // Milestones + egg.
      for (const m of milestones) {
        if (game.score >= m.score && !game.reachedMilestones.has(m.score)) {
          game.reachedMilestones.add(m.score);
          game.milestoneText = t(m.key);
          game.milestoneUntil = now + 2.2;
          sfx("milestone");
          if (m.score === 1000) game.rebirthCharge = true;
        }
      }
      if (game.score >= 500 && !game.unlockedScoreEgg) {
        game.unlockedScoreEgg = true;
        unlock("dino-score-5");
      }

      // Phoenix physics.
      game.vy += GRAVITY * dt;
      game.py += game.vy * dt;
      const ceil = 16;
      if (game.py < ceil) {
        game.py = ceil;
        game.vy = 0;
      }
      if (game.py > game.groundY - PHX_H / 2) {
        game.py = game.groundY - PHX_H / 2;
        game.vy = 0;
      }
      game.wing += dt * (reduce ? 6 : 16);
      if (game.invuln > 0) game.invuln -= dt;

      // Fire trail.
      if (!reduce || Math.random() < 0.4) {
        game.trail.push({
          x: game.px - 14,
          y: game.py + rand(-3, 5),
          vx: rand(-60, -20) - game.speed * 0.1,
          vy: rand(-20, 20),
          life: 0,
          max: rand(0.3, 0.7),
          size: rand(2, 5),
          hue: rand(20, 45),
        });
      }

      // Spawning.
      game.spawnIn -= dt;
      if (game.spawnIn <= 0) {
        spawnObstacle(game);
        const base = game.inferno ? 0.7 : 1.0;
        game.spawnIn = rand(base, base + 0.9) / (1 + game.score / 4000);
      }
      game.powerIn -= dt;
      if (game.powerIn <= 0) {
        spawnPower(game);
        game.powerIn = rand(5, 9);
      }

      // Move + cull obstacles.
      for (const o of game.obstacles) {
        o.x -= game.speed * dt;
        if (o.kind === "meteor") {
          o.y += o.vy * dt;
          o.x -= 60 * dt;
        }
        if (o.kind === "raven") {
          o.x -= 40 * dt;
          o.y += Math.sin((game.elapsed + o.phase) * 3) * 18 * dt;
        }
        if (!o.dead && game.invuln <= 0 && hitObstacle(game, o)) {
          if (game.shield) {
            game.shield = false;
            o.dead = true;
            game.invuln = 0.6;
            explode(game, o.x + o.w / 2, o.y + o.h / 2, 16, 190);
          } else if (game.rebirthCharge) {
            game.rebirthCharge = false;
            game.invuln = 1.6;
            sfx("rebirth");
            explode(game, game.px, game.py, 40, 30);
            for (const ob of game.obstacles) {
              if (Math.abs(ob.x - game.px) < 260) ob.dead = true;
            }
            game.milestoneText = t("rebirth");
            game.milestoneUntil = now + 1.6;
          } else {
            explode(game, game.px, game.py, 30, 30);
            endGameRef.current();
            return;
          }
        }
      }
      game.obstacles = game.obstacles.filter(
        (o) => !o.dead && o.x + o.w > -40 && o.y < game.h + 60,
      );

      // Power-ups.
      for (const p of game.powers) {
        p.x -= game.speed * dt;
        p.phase += dt;
        const dx = game.px - p.x;
        const dy = game.py - p.y;
        if (!p.dead && Math.hypot(dx, dy) < p.r + 16) {
          p.dead = true;
          collectPower(game, p, now);
        }
      }
      game.powers = game.powers.filter((p) => !p.dead && p.x + p.r > -20);

      // Particles.
      const decay = (arr: Particle[]) => {
        for (const pt of arr) {
          pt.life += dt;
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.vy += 60 * dt;
        }
        return arr.filter((pt) => pt.life < pt.max);
      };
      game.trail = decay(game.trail);
      game.bursts = decay(game.bursts);
      for (const e of game.embers) {
        e.x += e.vx * dt - game.speed * 0.06 * dt;
        e.y += e.vy * dt;
        e.life += dt;
        if (e.y < -10 || e.x < -10 || e.life > e.max) {
          e.x = rand(game.w, game.w + 60);
          e.y = rand(game.groundY * 0.3, game.groundY);
          e.life = 0;
        }
      }

      // Parallax offsets.
      game.parallax[0] = (game.parallax[0] - game.speed * 0.12 * dt) % game.w;
      game.parallax[1] = (game.parallax[1] - game.speed * 0.28 * dt) % game.w;
      game.parallax[2] = (game.parallax[2] - game.speed * 0.55 * dt) % game.w;

      if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 30);
    };

    const loop = (now: number) => {
      if (stopped) return;
      const game = gameRef.current;
      if (!game) return;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      step(game, dt, game.elapsed);
      draw(ctx, game, reduce);
      if (!stopped) rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      stopped = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [status, reduce, newGame, sfx, t, unlock, collectPower]);

  // Draw a single idle / paused frame so the canvas isn't blank.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!gameRef.current) gameRef.current = newGame();
    if (status !== "running") draw(ctx, gameRef.current, reduce);
  }, [status, reduce, newGame]);

  // ---- lifecycle: sizing ---------------------------------------------------
  useEffect(() => {
    sizeCanvas();
    const ro = new ResizeObserver(() => sizeCanvas());
    if (containerRef.current) ro.observe(containerRef.current);
    const onFs = () => {
      setIsFs(Boolean(document.fullscreenElement));
      sizeCanvas();
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      ro.disconnect();
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [sizeCanvas]);

  // While playing, claim the overlay so page shortcuts (t/r/j/k, typed words)
  // don't fire and arrow keys don't scroll the page.
  useEffect(() => {
    // Claim the overlay for every non-idle state so page shortcuts (t/r/j/k,
    // typed-word eggs) stay dormant and arrow keys never scroll mid-run — and
    // so `R` on the game-over screen restarts without also toggling recruiter.
    setOverlayOpen("phoenix-run", status !== "idle");
    return () => setOverlayOpen("phoenix-run", false);
  }, [status]);

  const start = useCallback(() => {
    ensureAudio();
    gameRef.current = newGame();
    setFinalScore(0);
    setFeathersRun(0);
    setStatus("running");
  }, [ensureAudio, newGame]);

  const togglePause = useCallback(() => {
    setStatus((s) => (s === "running" ? "paused" : s === "paused" ? "running" : s));
  }, []);

  const openHelp = useCallback(() => {
    // Pause an in-progress run so the player doesn't crash while reading.
    setStatus((s) => (s === "running" ? "paused" : s));
    setHelpOpen(true);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void el.requestFullscreen().catch(() => {});
    }
  }, []);

  // ---- keyboard ------------------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const gameKeys = [" ", "arrowup", "arrowdown", "w", "s", "p", "r", "f"];
      if ((status === "running" || status === "paused") && gameKeys.includes(k)) {
        e.preventDefault();
      }
      if (status === "running") {
        if (k === " " || k === "arrowup" || k === "w") jump();
        else if (k === "arrowdown" || k === "s") dive();
        else if (k === "p") togglePause();
        else if (k === "r") start();
        else if (k === "f") toggleFullscreen();
      } else if (status === "paused") {
        if (k === "p" || k === " ") togglePause();
        else if (k === "r") start();
        else if (k === "f") toggleFullscreen();
      } else if (status === "over") {
        if (k === "r" || k === "enter" || k === " ") {
          e.preventDefault();
          start();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, jump, dive, togglePause, start, toggleFullscreen]);

  // ---- pointer / touch -----------------------------------------------------
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (status === "idle" || status === "over") {
        start();
        return;
      }
      if (status === "running") {
        jump();
      }
      swipeRef.current = { y: e.clientY, t: performance.now() };
    },
    [status, start, jump],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const s = swipeRef.current;
      swipeRef.current = null;
      if (!s || status !== "running") return;
      if (e.clientY - s.y > 40 && performance.now() - s.t < 500) dive();
    },
    [status, dive],
  );

  const reduceNote = reduce && status === "idle";

  return (
    <div className="mx-auto mt-12 w-full max-w-3xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-fg-subtle inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase">
          <Flame className="text-accent-amber h-3.5 w-3.5" /> {t("title")}
        </p>
        <div className="flex items-center gap-1.5">
          {status === "running" && (
            <button
              type="button"
              onClick={togglePause}
              aria-label={t("pause")}
              className="border-border bg-bg-elev/60 text-fg-muted hover:text-fg grid h-7 w-7 place-items-center rounded-md border"
            >
              <Pause className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={openHelp}
            aria-label={t("help.open")}
            className="border-border bg-bg-elev/60 text-fg-muted hover:text-fg grid h-7 w-7 place-items-center rounded-md border"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? t("unmute") : t("mute")}
            className="border-border bg-bg-elev/60 text-fg-muted hover:text-fg grid h-7 w-7 place-items-center rounded-md border"
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFs ? t("exitFullscreen") : t("fullscreen")}
            className="border-border bg-bg-elev/60 text-fg-muted hover:text-fg grid h-7 w-7 place-items-center rounded-md border"
          >
            {isFs ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="border-accent-amber/25 from-bg-sunken to-bg relative w-full touch-none overflow-hidden rounded-xl border bg-gradient-to-b shadow-2xl"
      >
        <canvas
          ref={canvasRef}
          aria-label={t("canvasLabel")}
          className="block w-full select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />

        {/* Overlays */}
        {status !== "running" && (
          <div className="absolute inset-0 grid place-items-center bg-black/45 p-6 text-center backdrop-blur-[2px]">
            {status === "idle" && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-fg text-lg font-semibold">{t("idleTitle")}</p>
                <p className="text-fg-muted max-w-sm text-sm">{t("idleHint")}</p>
                {reduceNote && <p className="text-accent-amber text-xs">{t("reducedMotion")}</p>}
                <button
                  type="button"
                  onClick={start}
                  className="btn-primary mt-1 inline-flex items-center gap-1.5"
                >
                  <Play className="h-4 w-4" /> {t("play")}
                </button>
                {highScore > 0 && (
                  <p className="text-fg-subtle font-mono text-[11px]">
                    {t("best", { score: highScore })}
                  </p>
                )}
              </div>
            )}
            {status === "paused" && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-fg text-lg font-semibold">{t("paused")}</p>
                <button
                  type="button"
                  onClick={togglePause}
                  className="btn-primary inline-flex items-center gap-1.5"
                >
                  <Play className="h-4 w-4" /> {t("resume")}
                </button>
              </div>
            )}
            {status === "over" && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-accent-amber text-sm font-semibold tracking-widest uppercase">
                  {t("gameOver")}
                </p>
                <p className="text-fg text-3xl font-bold tabular-nums">{finalScore}</p>
                <p className="text-fg-subtle font-mono text-[11px]">
                  {finalScore >= highScore && finalScore > 0
                    ? t("newHigh")
                    : t("best", { score: highScore })}
                  {feathersRun > 0 ? ` · ${t("feathers", { count: feathersRun })}` : ""}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={start}
                    className="btn-primary inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-4 w-4" /> {t("restart")}
                  </button>
                  <Link href="/" className="btn-secondary inline-flex items-center gap-1.5 text-sm">
                    <Home className="h-4 w-4" /> {t("goHome")}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile controls */}
        {status === "running" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-between px-3 sm:hidden">
            <button
              type="button"
              onClick={dive}
              aria-label={t("dive")}
              className="border-border/60 bg-bg-elev/70 text-fg pointer-events-auto rounded-full border px-4 py-2 text-xs font-medium backdrop-blur"
            >
              {t("dive")}
            </button>
          </div>
        )}

        {/* How to play & settings */}
        {helpOpen && (
          <div
            className="absolute inset-0 z-20 overflow-y-auto bg-black/80 p-5 backdrop-blur-sm"
            role="dialog"
            aria-label={t("help.title")}
            onClick={(e) => {
              if (e.target === e.currentTarget) setHelpOpen(false);
            }}
          >
            <div className="mx-auto max-w-md space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-fg inline-flex items-center gap-2 text-base font-semibold">
                  <HelpCircle className="text-accent-amber h-4 w-4" /> {t("help.title")}
                </h3>
                <button
                  type="button"
                  onClick={() => setHelpOpen(false)}
                  className="btn-secondary px-2.5 py-1 text-xs"
                >
                  {t("help.close")}
                </button>
              </div>

              <p className="text-fg-muted text-sm">{t("help.goal")}</p>

              <div>
                <p className="text-fg text-xs font-semibold tracking-wider uppercase">
                  {t("help.controlsTitle")}
                </p>
                <pre className="text-fg-muted mt-1 font-mono text-[11px] whitespace-pre-wrap">
                  {t("help.controlsBody")}
                </pre>
              </div>

              <div>
                <p className="text-fg text-xs font-semibold tracking-wider uppercase">
                  {t("help.powerupsTitle")}
                </p>
                <pre className="text-fg-muted mt-1 font-mono text-[11px] whitespace-pre-wrap">
                  {t("help.powerupsBody")}
                </pre>
              </div>

              <div>
                <p className="text-fg text-xs font-semibold tracking-wider uppercase">
                  {t("help.mechanicsTitle")}
                </p>
                <pre className="text-fg-muted mt-1 font-mono text-[11px] whitespace-pre-wrap">
                  {t("help.mechanicsBody")}
                </pre>
              </div>

              <div className="border-border/60 border-t pt-3">
                <p className="text-fg text-xs font-semibold tracking-wider uppercase">
                  {t("help.settingsTitle")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    className="btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  >
                    {muted ? (
                      <VolumeX className="h-3.5 w-3.5" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5" />
                    )}
                    {t("help.sound", { state: muted ? t("help.off") : t("help.on") })}
                  </button>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                  >
                    {isFs ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}
                    {isFs ? t("exitFullscreen") : t("fullscreen")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-fg-subtle mt-2 text-center font-mono text-[10px]">{t("controls")}</p>
    </div>
  );
}

// ===========================================================================
// Rendering (pure, takes ctx + game state). Kept outside the component so it
// allocates nothing per render beyond gradients.
// ===========================================================================
function draw(ctx: CanvasRenderingContext2D, g: Game, reduce: boolean | null) {
  const { w, h } = g;
  ctx.save();
  if (g.shake > 0 && !reduce) {
    ctx.translate(rand(-g.shake, g.shake), rand(-g.shake, g.shake));
  }

  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  if (g.inferno) {
    sky.addColorStop(0, "#1a0505");
    sky.addColorStop(0.5, "#3b0a0a");
    sky.addColorStop(1, "#7c1d1d");
  } else {
    sky.addColorStop(0, "#0a0610");
    sky.addColorStop(0.55, "#2a1020");
    sky.addColorStop(1, "#5b1e1a");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(-20, -20, w + 40, h + 40);

  // Distant ruins (parallax layer 0).
  drawRuins(ctx, g, g.parallax[0], g.groundY - 70, "rgba(20,12,24,0.7)", 90);
  // Mountains (layer 1).
  drawMountains(ctx, g, g.parallax[1], g.groundY, "#180a12", 140);
  drawMountains(ctx, g, g.parallax[1] + w / 2, g.groundY, "#241019", 110);

  // Embers (background).
  for (const e of g.embers) {
    const a = 1 - e.life / e.max;
    ctx.fillStyle = `hsla(${e.hue}, 100%, 60%, ${0.5 * a})`;
    ctx.fillRect(e.x, e.y, e.size, e.size);
  }

  // Ground + lava cracks.
  const groundGrad = ctx.createLinearGradient(0, g.groundY, 0, h);
  groundGrad.addColorStop(0, "#2a0f0a");
  groundGrad.addColorStop(1, "#120505");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, g.groundY, w, h - g.groundY);
  ctx.strokeStyle = g.inferno ? "rgba(255,90,40,0.9)" : "rgba(255,120,40,0.6)";
  ctx.lineWidth = 2;
  const off = g.parallax[2];
  for (let i = -1; i < w / 90 + 1; i++) {
    const x = ((i * 90 + off) % (w + 90)) + 0;
    ctx.beginPath();
    ctx.moveTo(x, g.groundY + 6);
    ctx.lineTo(x + 18, g.groundY + 16);
    ctx.lineTo(x + 8, g.groundY + 28);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,150,60,0.9)";
  ctx.fillRect(0, g.groundY - 1, w, 2);

  // Obstacles.
  for (const o of g.obstacles) drawObstacle(ctx, o);

  // Power-ups.
  for (const p of g.powers) drawPower(ctx, p);

  // Fire trail.
  for (const pt of g.trail) {
    const a = 1 - pt.life / pt.max;
    ctx.fillStyle = `hsla(${pt.hue}, 100%, ${55 + a * 20}%, ${a * 0.8})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size * a + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Phoenix.
  drawPhoenix(ctx, g, reduce);

  // Bursts (explosions / sparkles).
  for (const pt of g.bursts) {
    const a = 1 - pt.life / pt.max;
    ctx.fillStyle = `hsla(${pt.hue}, 100%, 60%, ${a})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size * a + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // HUD (not shaken).
  drawHud(ctx, g);
}

function drawMountains(
  ctx: CanvasRenderingContext2D,
  g: Game,
  offset: number,
  baseY: number,
  color: string,
  peak: number,
) {
  ctx.fillStyle = color;
  const span = g.w;
  for (let k = -1; k <= 1; k++) {
    const ox = (offset % span) + k * span;
    ctx.beginPath();
    ctx.moveTo(ox, baseY);
    ctx.lineTo(ox + span * 0.18, baseY - peak);
    ctx.lineTo(ox + span * 0.32, baseY - peak * 0.55);
    ctx.lineTo(ox + span * 0.5, baseY - peak * 0.9);
    ctx.lineTo(ox + span * 0.68, baseY - peak * 0.4);
    ctx.lineTo(ox + span * 0.85, baseY - peak * 0.75);
    ctx.lineTo(ox + span, baseY);
    ctx.closePath();
    ctx.fill();
  }
}

function drawRuins(
  ctx: CanvasRenderingContext2D,
  g: Game,
  offset: number,
  baseY: number,
  color: string,
  step: number,
) {
  ctx.fillStyle = color;
  for (let x = (offset % step) - step; x < g.w + step; x += step) {
    const hgt = 40 + ((Math.abs(Math.floor(x / step)) * 37) % 50);
    ctx.fillRect(x, baseY - hgt, 16, hgt);
    ctx.fillRect(x + 22, baseY - hgt * 0.6, 12, hgt * 0.6);
  }
}

function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle) {
  switch (o.kind) {
    case "spike": {
      const grad = ctx.createLinearGradient(o.x, o.y, o.x, o.y + o.h);
      grad.addColorStop(0, "#fde047");
      grad.addColorStop(0.5, "#f97316");
      grad.addColorStop(1, "#7f1d1d");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(o.x, o.y + o.h);
      ctx.lineTo(o.x + o.w / 2, o.y);
      ctx.lineTo(o.x + o.w, o.y + o.h);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "pillar": {
      ctx.fillStyle = "#3a2a2f";
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.fillStyle = "#52383f";
      ctx.fillRect(o.x, o.y, o.w, 6);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(o.x + o.w * 0.5, o.y + 8, 3, o.h - 12);
      break;
    }
    case "rock": {
      ctx.fillStyle = "#2b1c1c";
      ctx.beginPath();
      ctx.ellipse(o.x + o.w / 2, o.y + o.h, o.w / 2, o.h, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "rgba(255,120,50,0.5)";
      ctx.fillRect(o.x + 4, o.y + o.h - 3, o.w - 8, 2);
      break;
    }
    case "raven": {
      ctx.fillStyle = "#0c0a12";
      const flap = Math.sin(o.phase + performanceNow() * 0.006) * 6;
      ctx.beginPath();
      ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2, o.w / 2.4, o.h / 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(o.x + o.w / 2, o.y + o.h / 2);
      ctx.lineTo(o.x, o.y + o.h / 2 - flap);
      ctx.lineTo(o.x + o.w / 2, o.y + o.h / 2 + 4);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(o.x + o.w / 2, o.y + o.h / 2);
      ctx.lineTo(o.x + o.w, o.y + o.h / 2 - flap);
      ctx.lineTo(o.x + o.w / 2, o.y + o.h / 2 + 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(o.x + o.w * 0.66, o.y + o.h * 0.42, 1.6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "meteor": {
      const grad = ctx.createRadialGradient(
        o.x + o.w / 2,
        o.y + o.h / 2,
        1,
        o.x + o.w / 2,
        o.y + o.h / 2,
        o.w,
      );
      grad.addColorStop(0, "#fff7ed");
      grad.addColorStop(0.5, "#fb923c");
      grad.addColorStop(1, "#991b1b");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(o.x + o.w / 2, o.y + o.h / 2, o.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,140,60,0.5)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(o.x + o.w / 2, o.y + o.h / 2);
      ctx.lineTo(o.x + o.w * 1.6, o.y - o.h);
      ctx.stroke();
      break;
    }
    case "ring": {
      const cx = o.x;
      const cy = o.y;
      const outer = o.w / 2;
      ctx.lineWidth = 10;
      const grad = ctx.createLinearGradient(cx - outer, cy, cx + outer, cy);
      grad.addColorStop(0, "#f97316");
      grad.addColorStop(0.5, "#fde047");
      grad.addColorStop(1, "#ef4444");
      ctx.strokeStyle = grad;
      ctx.shadowColor = "rgba(249,115,22,0.8)";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(cx, cy, outer - 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      break;
    }
  }
}

function drawPower(ctx: CanvasRenderingContext2D, p: PowerUp) {
  const pulse = 1 + Math.sin(p.phase * 4) * 0.12;
  const colors: Record<PowerKind, string> = {
    shield: "#22d3ee",
    feather: "#fbbf24",
    burst: "#f97316",
    slow: "#a78bfa",
    double: "#34d399",
  };
  const c = colors[p.kind];
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.shadowColor = c;
  ctx.shadowBlur = 16;
  ctx.fillStyle = "rgba(8,10,16,0.85)";
  ctx.beginPath();
  ctx.arc(0, 0, p.r * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = c;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = c;
  ctx.font = "bold 13px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const glyph: Record<PowerKind, string> = {
    shield: "⛨",
    feather: "✦",
    burst: "✸",
    slow: "◷",
    double: "×2",
  };
  ctx.fillText(glyph[p.kind], 0, 1);
  ctx.restore();
}

function drawPhoenix(ctx: CanvasRenderingContext2D, g: Game, reduce: boolean | null) {
  const x = g.px;
  const y = g.py;
  const blink = g.invuln > 0 && Math.floor(g.invuln * 12) % 2 === 0;
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = blink ? 0.4 : 1;
  const tilt = Math.max(-0.5, Math.min(0.5, g.vy / 1400));
  ctx.rotate(tilt);

  const wingLift = reduce ? 6 : Math.sin(g.wing) * 14 + 6;

  // Shield halo.
  if (g.shield) {
    ctx.strokeStyle = "rgba(34,211,238,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Back wing.
  ctx.fillStyle = "rgba(220,38,38,0.92)";
  ctx.beginPath();
  ctx.moveTo(-2, 0);
  ctx.quadraticCurveTo(-26, -wingLift - 10, -36, 6);
  ctx.quadraticCurveTo(-18, 6, -2, 6);
  ctx.closePath();
  ctx.fill();

  // Body.
  const body = ctx.createRadialGradient(2, -2, 1, 0, 0, 20);
  body.addColorStop(0, "#fff7ed");
  body.addColorStop(0.35, "#fde047");
  body.addColorStop(0.7, "#f97316");
  body.addColorStop(1, "#dc2626");
  ctx.fillStyle = body;
  ctx.shadowColor = "rgba(249,115,22,0.9)";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head.
  ctx.beginPath();
  ctx.ellipse(12, -6, 7, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Beak.
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.moveTo(18, -7);
  ctx.lineTo(27, -5);
  ctx.lineTo(18, -3);
  ctx.closePath();
  ctx.fill();

  // Eye.
  ctx.fillStyle = "#1f2937";
  ctx.beginPath();
  ctx.arc(14, -8, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Tail feathers (fiery).
  const tail = ctx.createLinearGradient(-16, 0, -4, 0);
  tail.addColorStop(0, "rgba(239,68,68,0)");
  tail.addColorStop(1, "#f97316");
  ctx.fillStyle = tail;
  ctx.beginPath();
  ctx.moveTo(-12, -6);
  ctx.lineTo(-26, -10 + Math.sin(g.wing * 1.3) * 3);
  ctx.lineTo(-14, 0);
  ctx.lineTo(-26, 8 + Math.sin(g.wing * 1.3) * 3);
  ctx.lineTo(-12, 6);
  ctx.closePath();
  ctx.fill();

  // Front wing (flaps).
  const wing = ctx.createLinearGradient(-2, -wingLift - 16, -2, 8);
  wing.addColorStop(0, "#fde047");
  wing.addColorStop(0.6, "#fb923c");
  wing.addColorStop(1, "#ef4444");
  ctx.fillStyle = wing;
  ctx.shadowColor = "rgba(251,191,36,0.7)";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(-2, -2);
  ctx.quadraticCurveTo(-22, -wingLift - 20, -34, -wingLift - 2);
  ctx.quadraticCurveTo(-16, -2, -2, 4);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawHud(ctx: CanvasRenderingContext2D, g: Game) {
  ctx.save();
  ctx.font = "bold 20px ui-monospace, monospace";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillText(String(Math.floor(g.score)).padStart(5, "0"), 14, 12);

  // Status chips (right side).
  ctx.font = "11px ui-monospace, monospace";
  ctx.textAlign = "right";
  let ry = 14;
  if (g.rebirthCharge) {
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("🜂 rebirth ready", g.w - 14, ry);
    ry += 16;
  }
  if (g.shield) {
    ctx.fillStyle = "#22d3ee";
    ctx.fillText("⛨ shield", g.w - 14, ry);
    ry += 16;
  }
  if (g.feathers > 0) {
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(`✦ ${g.feathers}`, g.w - 14, ry);
    ry += 16;
  }
  if (g.inferno) {
    ctx.fillStyle = "#ef4444";
    ctx.fillText("🔥 inferno", g.w - 14, ry);
  }
  ctx.textAlign = "left";

  // Milestone banner.
  if (g.elapsed < g.milestoneUntil && g.milestoneText) {
    ctx.font = "bold 26px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(251,191,36,0.95)";
    ctx.shadowColor = "rgba(249,115,22,0.8)";
    ctx.shadowBlur = 18;
    ctx.fillText(g.milestoneText, g.w / 2, g.h * 0.28);
    ctx.shadowBlur = 0;
    ctx.textAlign = "left";
  }
  ctx.restore();
}

function performanceNow(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}
