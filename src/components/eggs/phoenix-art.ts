/**
 * The phoenix ASCII mark used wherever we want a signature flourish: the
 * devtools console banner, the 404 / error surface, and the terminal
 * `neofetch`. Pure data (no DOM), so both server and client components can
 * import it.
 *
 * NOTE ON ATTRIBUTION: this is a piece of third-party ASCII art that carries
 * the original artist's "M J P" signature (kept intact below — reproduced at
 * the site owner's explicit request). It is *not* an original work of this
 * repository; do not strip the signature to pass it off as one's own.
 */
export const PHOENIX_BANNER: readonly string[] = [
  "                              .-=============-.",
  "                           .-'   O     ====== `-.",
  "                         .'             =====     `.",
  "                        /___             ===        \\",
  "                           \\_             |         |",
  "_____________________________)           (_____________________________",
  "\\______________             .'           `.             ______________/",
  "  \\_____________`.    |||<  `.           .'  >|||    .'_____________/",
  "     \\____________`._ ||| <   `-._____.-'   > ||| _.'____________/",
  "        \\____________`..|_  _ <   ///   > _  _|..'____________/",
  "           \\____________   |_|   ///\\\\\\   |_|   ____________/",
  "                        .-.\\    ///  \\\\\\    /.-.",
  "      ,    .        _.-'.-. `._  /    \\  _.' .-.`-._        .    ,",
  "    <<<<<<>>>>    .'  .'   /  `''------''`  \\   `.  `.    <<<<<<>>>>",
  "      `\\  /`       /  .' .' .'/|..||..|\\`. `. `.  \\       `\\  /`",
  "       (())       `  /  / .' | |||||||| | `. \\  \\  '       (())",
  "        /\\           ::_.' .' /| |||| |\\ `. `._::           /\\",
  "       //\\\\            `--.' | | |||| | | `.--'            //\\\\",
  "      ///\\\\\\              .` .` | || | '. '.              ///\\\\\\",
  "     ////\\\\\\\\                `  | || |  '                ////\\\\\\\\",
  "    /////\\\\\\\\\\                  | || |                  /////\\\\\\\\\\",
  "   //////\\\\\\\\\\\\                 | `' |                 //////\\\\\\\\\\\\",
  "  ///////\\\\\\\\\\\\\\                                       ///////\\\\\\\\\\\\\\",
  "       \\\\////                  R I S E                 \\\\\\\\//",
  "        \\/                     M J P                    \\/",
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
