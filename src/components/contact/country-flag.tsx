/**
 * SVG country flags for the phone-number picker.
 *
 * We pull the whole flag set in via a namespace import from
 * `country-flag-icons/react/3x2`. Each flag is its own React component and
 * tree-shaking still drops the ones we don't reference at runtime — but more
 * importantly this guarantees that every ISO code listed in
 * `src/lib/countries.ts` (the full ISO 3166-1 alpha-2 set) has a flag SVG
 * available, no matter how the country list grows.
 *
 * On Windows + Chrome, unicode regional-indicator emoji never render as
 * actual flags (the OS ships no flag glyphs), so we cannot rely on
 * `flagFor()` for UI — that helper is kept for non-visual contexts
 * (e.g. plain-text emails). Always prefer `<CountryFlag iso="IN" />` in JSX.
 */
import * as Flags from "country-flag-icons/react/3x2";

type FlagComponent = React.ComponentType<{ title?: string; className?: string }>;

// Cast once so TS treats the namespace as a string-keyed record. The package
// exports every code as `export const XX: FlagComponent`, so the runtime
// shape matches.
const FLAGS = Flags as unknown as Record<string, FlagComponent | undefined>;

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
