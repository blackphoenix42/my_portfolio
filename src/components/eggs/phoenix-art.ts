/**
 * The canonical phoenix ASCII mark for this site — an original, hand-drawn
 * rising bird used wherever we want a signature flourish: the devtools console
 * banner and the 404 / error surface. Pure data (no DOM), so both server and
 * client components can import it.
 *
 * Drawn with box-drawing diagonals (╲ ╱) rather than slashes so it needs no
 * escaping and stays crisp in any monospace font. Painted top→bottom with the
 * amber→red gradient below, it reads as a phoenix rising out of its embers.
 */
export const PHOENIX_BANNER: readonly string[] = [
  "          ╲╲            ╱╱          ",
  "           ╲╲    ╱╲    ╱╱           ",
  "            ╲╲  ╱  ╲  ╱╱            ",
  "      ╲╲     ╲╲╱ ⟁⟁ ╲╱╱     ╱╱      ",
  "       ╲╲╲   ╱  ╱  ╲  ╲   ╱╱╱       ",
  "        ╲╲ ╲╲  ( o o )  ╱╱ ╱╱        ",
  "         ╲╲ ╲╲   ╲╱╱   ╱╱ ╱╱         ",
  "          ╲╲_╲╲   V   ╱╱_╱╱          ",
  "             ╲╲╲  |  ╱╱╱             ",
  "           ~   ╲╲ | ╱╱   ~           ",
  "          ~  ✦   ╲|╱   ✦  ~          ",
  "           ~   ✦  ▼  ✦   ~           ",
  "              ~ ~ ~ ~ ~              ",
];

/** Amber → red vertical gradient, sampled per banner row. */
export const PHOENIX_GRADIENT: readonly string[] = [
  "#fef3c7",
  "#fde047",
  "#facc15",
  "#f59e0b",
  "#fb923c",
  "#f97316",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#7f1d1d",
];

/** Tagline printed under the banner in the console. */
export const PHOENIX_TAGLINE = "🜂  phoenix · rising from its own ashes";
