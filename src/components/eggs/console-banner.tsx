"use client";

import { useEffect, useRef } from "react";
import { useEggs } from "./egg-provider";
import { SITE } from "@/content/profile";
import { PHOENIX_BANNER, PHOENIX_GRADIENT, PHOENIX_TAGLINE } from "./phoenix-art";

declare global {
  interface Window {
    help?: () => string;
    phoenix?: () => string;
    hire?: () => string;
    cv?: () => string;
    secrets?: () => string;
    humans?: () => string;
    robots?: () => string;
  }
}

/**
 * Logs a stylized phoenix banner to the browser console and installs a few
 * harmless globals (`help()`, `phoenix()`, `hire()`, `cv()`, `secrets()`,
 * `humans()`, `robots()`). All commands return a string so the devtools
 * REPL never prints `undefined`. The first `help()` call unlocks two eggs.
 */
export function ConsoleBanner() {
  const { unlock, progress } = useEggs();
  const printed = useRef(false);
  // Keep a ref to the latest unlocked count so the closure in `window.secrets`
  // reports the current value instead of the count captured on first mount.
  const unlockedCountRef = useRef(progress.unlocked.length);
  useEffect(() => {
    unlockedCountRef.current = progress.unlocked.length;
  }, [progress.unlocked.length]);

  useEffect(() => {
    if (printed.current) return;
    printed.current = true;
    if (typeof window === "undefined") return;

    // Paint the banner row-by-row with the amber→red gradient.
    for (let i = 0; i < PHOENIX_BANNER.length; i++) {
      const color =
        PHOENIX_GRADIENT[Math.floor((i / PHOENIX_BANNER.length) * PHOENIX_GRADIENT.length)] ??
        "#f5a524";
      console.log(
        `%c${PHOENIX_BANNER[i]}`,
        `color:${color};font-family:ui-monospace,monospace;font-size:12px;line-height:1.05;`,
      );
    }

    console.log(
      `\n%c${PHOENIX_TAGLINE}`,
      "color:#f59e0b;font-family:ui-monospace,monospace;font-size:12px;font-weight:700;",
    );
    console.log(
      "%c⟁ phoenix · console toolkit",
      "color:#22d3ee;font-family:ui-monospace,monospace;font-size:13px;font-weight:700;",
    );
    console.log(
      "%cType %chelp()%c to see what this console can do.",
      "color:#9fb0c9;font-family:ui-monospace,monospace;",
      "color:#fde047;font-family:ui-monospace,monospace;font-weight:700;",
      "color:#9fb0c9;font-family:ui-monospace,monospace;",
    );

    const helpText = [
      "⟁  phoenix · console toolkit",
      "",
      "    help()      this message",
      "    phoenix()   about the codename",
      "    hire()      open the contact form",
      "    cv()        open the résumé in a new tab",
      "    secrets()   visit the trophy room",
      "    humans()    open /humans.txt",
      "    robots()    open /robots.txt",
      "",
      "    + Konami code, theme cycler, terminal, matrix, dino game…",
      "      hint: try typing 'matrix' or 'sudo' on the page.",
    ].join("\n");

    window.help = () => {
      unlock("console-banner");
      // The HTML comment explicitly invites the reader to call help(),
      // so the first invocation also claims the html-comment egg.
      unlock("html-comment");
      return helpText;
    };

    window.phoenix = () => {
      unlock("console-banner");
      return [
        "⟁  phoenix",
        '    "A bird that rises again from its own ashes."',
        "  Codename for this site's brand and palette.",
        "  Press `t` on any page to cycle themes — phoenix is one of them.",
      ].join("\n");
    };

    window.hire = () => {
      unlock("console-banner");
      try {
        window.location.assign("/contact");
      } catch {
        /* navigation blocked by sandbox; no-op */
      }
      return "→ opening /contact …";
    };

    window.cv = () => {
      unlock("console-banner");
      try {
        window.open(SITE.resumePath, "_blank", "noopener");
      } catch {
        /* popup blocked; no-op */
      }
      return `→ résumé: ${SITE.resumePath}`;
    };

    window.secrets = () => {
      unlock("console-banner");
      try {
        window.location.assign("/secret");
      } catch {
        /* navigation blocked */
      }
      return `${unlockedCountRef.current} eggs found so far. opening trophy room…`;
    };

    window.humans = () => {
      unlock("humans-txt");
      try {
        window.open("/humans.txt", "_blank", "noopener");
      } catch {
        /* popup blocked */
      }
      return "→ /humans.txt — a file just for humans.";
    };

    window.robots = () => {
      unlock("robots-txt");
      try {
        window.open("/robots.txt", "_blank", "noopener");
      } catch {
        /* popup blocked */
      }
      return "→ /robots.txt — a file just for crawlers.";
    };
  }, [unlock]);

  return null;
}
