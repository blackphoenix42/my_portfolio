/**
 * SVG country flags. We deliberately re-export a static map of *only* the
 * ISO codes we actually use (see `src/lib/countries.ts`) so the bundler can
 * tree-shake the rest of `country-flag-icons`'s ~250 flag SVGs.
 *
 * On Windows + Chrome, unicode regional-indicator emoji never render as
 * actual flags (the OS ships no flag glyphs), so we cannot rely on the
 * `flagFor()` helper for UI — that helper is kept for non-visual contexts
 * (e.g. plain-text emails). Always prefer `<CountryFlag iso="IN" />` in JSX.
 */
import {
  AE,
  AR,
  AT,
  AU,
  BD,
  BE,
  BG,
  BH,
  BR,
  CA,
  CH,
  CL,
  CN,
  CO,
  CZ,
  DE,
  DK,
  EG,
  ES,
  FI,
  FR,
  GB,
  GR,
  HK,
  HU,
  ID,
  IE,
  IL,
  IN,
  IT,
  JP,
  KR,
  KW,
  LK,
  MX,
  MY,
  NG,
  NL,
  NO,
  NP,
  NZ,
  PH,
  PK,
  PL,
  PT,
  QA,
  RO,
  RU,
  SA,
  SE,
  SG,
  TH,
  TR,
  TW,
  UA,
  US,
  VN,
  ZA,
} from "country-flag-icons/react/3x2";

type FlagComponent = React.ComponentType<{ title?: string; className?: string }>;

const FLAGS: Record<string, FlagComponent> = {
  AE,
  AR,
  AT,
  AU,
  BD,
  BE,
  BG,
  BH,
  BR,
  CA,
  CH,
  CL,
  CN,
  CO,
  CZ,
  DE,
  DK,
  EG,
  ES,
  FI,
  FR,
  GB,
  GR,
  HK,
  HU,
  ID,
  IE,
  IL,
  IN,
  IT,
  JP,
  KR,
  KW,
  LK,
  MX,
  MY,
  NG,
  NL,
  NO,
  NP,
  NZ,
  PH,
  PK,
  PL,
  PT,
  QA,
  RO,
  RU,
  SA,
  SE,
  SG,
  TH,
  TR,
  TW,
  UA,
  US,
  VN,
  ZA,
};

export function CountryFlag({
  iso,
  className,
  title,
}: {
  iso: string;
  className?: string;
  title?: string;
}) {
  const code = iso.toUpperCase();
  const F = FLAGS[code];
  if (!F) {
    return (
      <span
        aria-hidden
        className={`bg-bg-sunken text-fg-subtle inline-flex items-center justify-center font-mono text-[8px] ${className ?? ""}`}
      >
        {code}
      </span>
    );
  }
  return <F className={className} title={title} />;
}

export const __FLAGS_TEST = FLAGS;
