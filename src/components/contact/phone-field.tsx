"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, ChevronDown, Phone, Search } from "lucide-react";
import { COUNTRIES, DEFAULT_COUNTRY_ISO, findCountry, type Country } from "@/lib/countries";
import { CountryFlag } from "@/components/contact/country-flag";

type Props = {
  label: string;
  /** Hidden input name — receives the combined E.164 value (or empty). */
  name?: string;
  error?: string;
};

/**
 * Phone-number input with a country-code picker.
 *
 * UX:
 *  - Flag + dial-code button on the left opens a searchable dropdown.
 *  - India pinned at the top; remaining countries sorted alphabetically by
 *    the user's locale collation of the (localized) country name.
 *  - The visible input only accepts digits; the hidden `name="phone"` field
 *    carries the combined `+{dial}{national}` E.164 value submitted to the
 *    server.
 *  - Validation enforces the country's expected digit count when the user
 *    has typed at least one digit.
 */
export function PhoneField({ label, name = "phone", error }: Props) {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const id = useId();
  const buttonId = `${id}-country`;
  const inputId = `${id}-number`;

  const [iso, setIso] = useState<string>(DEFAULT_COUNTRY_ISO);
  const [national, setNational] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [touched, setTouched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const country = findCountry(iso) ?? COUNTRIES[0]!;

  // Localize country names with Intl.DisplayNames when available; fall back
  // to the English label baked into the data file.
  const displayName = useMemo(() => {
    let dn: Intl.DisplayNames | null = null;
    try {
      dn = new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      dn = null;
    }
    const resolver: (c: Country) => string = (c) => (dn ? (dn.of(c.iso) ?? c.name) : c.name);
    return resolver;
  }, [locale]);

  const sorted = useMemo(() => {
    const collator = new Intl.Collator(locale, { sensitivity: "base" });
    const rest = COUNTRIES.filter((c) => c.iso !== DEFAULT_COUNTRY_ISO);
    rest.sort((a, b) => collator.compare(displayName(a), displayName(b)));
    const pinned = COUNTRIES.filter((c) => c.iso === DEFAULT_COUNTRY_ISO);
    return [...pinned, ...rest];
  }, [displayName, locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (c) =>
        displayName(c).toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q) ||
        c.dial.includes(q.replace(/^\+/, "")),
    );
  }, [displayName, query, sorted]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  // Combined value submitted to the server. Empty when no digits were typed
  // (the phone field is optional).
  const combined = national ? `+${country.dial}${national}` : "";

  // Client-side length hint (server still runs the canonical zod regex).
  const digits = national.length;
  const localError =
    touched && digits > 0 && (digits < country.min || digits > country.max)
      ? t("errors.phoneInvalid")
      : null;

  const message = error ?? localError ?? null;

  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={inputId}
        className="text-fg-subtle font-mono text-[11px] tracking-widest uppercase"
      >
        {label}
      </label>

      <div ref={containerRef} className="relative">
        <div
          className={
            "contact-input border-border bg-bg-elev/60 focus-within:border-accent-cyan/60 focus-within:bg-bg-elev focus-within:ring-accent-cyan/20 flex w-full items-stretch overflow-hidden rounded-md border text-sm transition-colors focus-within:ring-2"
          }
        >
          <button
            type="button"
            id={buttonId}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={t("phoneCountry")}
            onClick={() => setOpen((v) => !v)}
            className="text-fg hover:bg-bg-sunken/50 flex shrink-0 items-center gap-1.5 border-r border-inherit px-2.5 py-2.5 transition-colors"
          >
            <span
              aria-hidden
              className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] shadow-sm"
            >
              <CountryFlag iso={country.iso} className="h-full w-full object-cover" />
            </span>
            <span className="font-mono text-xs tabular-nums">+{country.dial}</span>
            <ChevronDown className="text-fg-subtle h-3 w-3" aria-hidden />
          </button>

          <div className="relative flex-1">
            <Phone
              className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              id={inputId}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={national}
              onChange={(e) => setNational(e.target.value.replace(/\D+/g, ""))}
              onBlur={() => setTouched(true)}
              placeholder={t("phonePlaceholder")}
              aria-invalid={message ? true : undefined}
              maxLength={country.max + 4}
              className="placeholder:text-fg-subtle/60 w-full bg-transparent py-2.5 pr-3 pl-10 outline-none"
            />
          </div>
        </div>

        {/* Hidden value the form submits — the canonical E.164 string. */}
        <input type="hidden" name={name} value={combined} />

        {open && (
          <div
            role="listbox"
            aria-label={t("phoneCountry")}
            className="border-border bg-bg-elev absolute z-30 mt-1 max-h-72 w-full min-w-[16rem] overflow-hidden rounded-md border shadow-2xl"
          >
            <div className="border-border bg-bg-elev/95 relative border-b">
              <Search
                className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2"
                aria-hidden
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("phoneSearch")}
                className="placeholder:text-fg-subtle/60 w-full bg-transparent py-2 pr-3 pl-8 text-sm outline-none"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto" role="presentation">
              {filtered.length === 0 ? (
                <li className="text-fg-subtle px-3 py-3 text-center text-xs">
                  {t("phoneNoResults")}
                </li>
              ) : (
                filtered.map((c) => {
                  const active = c.iso === iso;
                  return (
                    <li key={c.iso} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onClick={() => {
                          setIso(c.iso);
                          setOpen(false);
                          setQuery("");
                        }}
                        className={
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors " +
                          (active
                            ? "bg-accent-cyan/10 text-fg"
                            : "text-fg-muted hover:bg-bg-sunken hover:text-fg")
                        }
                      >
                        <span
                          aria-hidden
                          className="inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] shadow-sm"
                        >
                          <CountryFlag iso={c.iso} className="h-full w-full object-cover" />
                        </span>
                        <span className="flex-1 truncate">{displayName(c)}</span>
                        <span className="text-fg-subtle font-mono text-xs tabular-nums">
                          +{c.dial}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {message && (
        <p role="alert" className="text-accent-amber flex items-center gap-1 font-mono text-[11px]">
          <AlertCircle className="h-3 w-3" />
          {message}
        </p>
      )}
    </div>
  );
}
