/**
 * /humans.txt — served two ways depending on who's asking:
 *
 *  - Crawlers, curl, humans-txt aggregators (no `Sec-Fetch-Mode: navigate`,
 *    `Accept: * / *`): the classic plain-text manifest.
 *  - A real browser top-level navigation: a small styled HTML page that shows
 *    the same content AND runs a tiny inline script to unlock the `humans-txt`
 *    easter egg in `localStorage` (key `phoenix:eggs:v1`).
 *
 * Why: a plain static .txt file can't run JS, and the referrer trick is
 * unreliable (the Back button / typing the URL don't set the referrer). Content
 * negotiation is the only robust way to make "visit humans.txt → unlock the
 * egg" actually work. `robots.txt` deliberately stays plain text for every
 * client (its crawler contract is sacred); that egg unlocks via the console
 * `robots()` helper instead.
 *
 * The inline script is permitted by our CSP (`script-src 'self' 'unsafe-inline'`).
 */

const PLAIN = `/* TEAM */
Maintainer: Ayush Yadav
Site: https://binaryphoenix.vercel.app
GitHub: @blackphoenix42
LinkedIn: linkedin.com/in/ayushyadav

/* THANKS */
- Vercel & the Next.js team
- The Tailwind CSS team
- The Radix UI team
- The framer-motion team
- The next-intl team
- Open-source contributors of every dependency in package.json

/* SITE */
Last update: 2026
Standards: HTML5, CSS3, ES2022
Components: Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, next-intl 4
Software: VS Code, GitHub

/* SECRETS */
🜂 You found the humans.txt file.
That counts as an easter egg — if you opened this in a browser it's already
unlocked in your trophy room at /secret. Twenty-one more are hidden across the
site: keyboard shortcuts, typed words ("matrix", "sudo"…), themes, locales,
hidden routes (/credits, /secret, /phoenix), a 404 mini-game, the browser
devtools console (try \`help()\` there), and even /robots.txt.
The full catalogue lives in docs/EGGS.md (in the source repository).
`;

// Inline, dependency-free unlock for the humans-txt egg. Merges into the
// existing progress blob without clobbering other unlocks.
const UNLOCK_SCRIPT = `(function(){try{
var K="phoenix:eggs:v1";var raw=localStorage.getItem(K);var p={};
try{p=raw?JSON.parse(raw):{};}catch(e){p={};}
if(!p||typeof p!=="object"){p={};}
if(!Array.isArray(p.unlocked)){p.unlocked=[];}
if(p.unlocked.indexOf("humans-txt")===-1){p.unlocked.push("humans-txt");
if(!p.firstUnlockAt){p.firstUnlockAt=new Date().toISOString();}}
localStorage.setItem(K,JSON.stringify(p));
}catch(e){}})();`;

function htmlPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>humans.txt · phoenix</title>
<style>
  :root { color-scheme: dark; }
  body {
    margin: 0; min-height: 100dvh; display: grid; place-items: center;
    background: #06080f; color: #cfe9ef; padding: 2rem;
    font-family: ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, monospace;
  }
  main { width: 100%; max-width: 760px; }
  .tag { color: #f5a524; font-size: .72rem; letter-spacing: .25em; text-transform: uppercase; }
  pre {
    margin: 1rem 0 1.5rem; padding: 1.25rem 1.5rem; overflow:auto;
    border: 1px solid rgba(159,176,201,.18); border-radius: 12px;
    background: rgba(13,18,30,.7); line-height: 1.55; font-size: .82rem;
    white-space: pre-wrap; word-break: break-word;
  }
  .ember { color: #f97316; }
  a { color: #22d3ee; text-decoration: none; margin-right: 1.25rem; font-size: .82rem; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
<main>
  <p class="tag">🜂 humans.txt</p>
  <pre>${PLAIN.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
  <p><span class="ember">●</span> Egg unlocked. Your trophy room remembers it.</p>
  <p style="margin-top:1.25rem">
    <a href="/">← back to the site</a>
    <a href="/secret">open the trophy room →</a>
  </p>
</main>
<script>${UNLOCK_SCRIPT}</script>
</body>
</html>`;
}

function wantsHtml(request: Request): boolean {
  const mode = request.headers.get("sec-fetch-mode");
  const dest = request.headers.get("sec-fetch-dest");
  const accept = request.headers.get("accept") ?? "";
  // Modern browsers: a real top-level navigation.
  if (mode === "navigate" && (dest === "document" || dest === null)) return true;
  // Older browsers that omit Sec-Fetch-* but still ask for HTML.
  if (mode === null && dest === null && accept.includes("text/html")) return true;
  return false;
}

export function GET(request: Request) {
  if (wantsHtml(request)) {
    return new Response(htmlPage(), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        Vary: "Sec-Fetch-Mode, Sec-Fetch-Dest, Accept",
      },
    });
  }
  return new Response(PLAIN, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      Vary: "Sec-Fetch-Mode, Sec-Fetch-Dest, Accept",
    },
  });
}

export const dynamic = "force-dynamic";
