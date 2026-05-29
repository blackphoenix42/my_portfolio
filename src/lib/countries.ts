/**
 * Curated list of countries for the phone-number picker.
 *
 *   iso  – ISO 3166-1 alpha-2 code (used for the emoji flag mapping)
 *   name – English display name (translated client-side when available)
 *   dial – international dial prefix WITHOUT the leading +
 *   min/max – inclusive bounds for the national-number digit count
 *
 * India is pinned at the top by product decision; consumers should sort the
 * rest alphabetically (by translated name) at render time.
 */
export type Country = {
  iso: string;
  name: string;
  dial: string;
  min: number;
  max: number;
};

export const COUNTRIES: readonly Country[] = [
  { iso: "IN", name: "India", dial: "91", min: 10, max: 10 },
  { iso: "AE", name: "United Arab Emirates", dial: "971", min: 8, max: 9 },
  { iso: "AR", name: "Argentina", dial: "54", min: 10, max: 11 },
  { iso: "AT", name: "Austria", dial: "43", min: 4, max: 13 },
  { iso: "AU", name: "Australia", dial: "61", min: 9, max: 9 },
  { iso: "BD", name: "Bangladesh", dial: "880", min: 10, max: 10 },
  { iso: "BE", name: "Belgium", dial: "32", min: 8, max: 9 },
  { iso: "BG", name: "Bulgaria", dial: "359", min: 8, max: 9 },
  { iso: "BH", name: "Bahrain", dial: "973", min: 8, max: 8 },
  { iso: "BR", name: "Brazil", dial: "55", min: 10, max: 11 },
  { iso: "CA", name: "Canada", dial: "1", min: 10, max: 10 },
  { iso: "CH", name: "Switzerland", dial: "41", min: 9, max: 9 },
  { iso: "CL", name: "Chile", dial: "56", min: 9, max: 9 },
  { iso: "CN", name: "China", dial: "86", min: 11, max: 11 },
  { iso: "CO", name: "Colombia", dial: "57", min: 10, max: 10 },
  { iso: "CZ", name: "Czechia", dial: "420", min: 9, max: 9 },
  { iso: "DE", name: "Germany", dial: "49", min: 6, max: 13 },
  { iso: "DK", name: "Denmark", dial: "45", min: 8, max: 8 },
  { iso: "EG", name: "Egypt", dial: "20", min: 9, max: 10 },
  { iso: "ES", name: "Spain", dial: "34", min: 9, max: 9 },
  { iso: "FI", name: "Finland", dial: "358", min: 5, max: 12 },
  { iso: "FR", name: "France", dial: "33", min: 9, max: 9 },
  { iso: "GB", name: "United Kingdom", dial: "44", min: 7, max: 10 },
  { iso: "GR", name: "Greece", dial: "30", min: 10, max: 10 },
  { iso: "HK", name: "Hong Kong", dial: "852", min: 8, max: 8 },
  { iso: "HU", name: "Hungary", dial: "36", min: 8, max: 9 },
  { iso: "ID", name: "Indonesia", dial: "62", min: 9, max: 12 },
  { iso: "IE", name: "Ireland", dial: "353", min: 7, max: 11 },
  { iso: "IL", name: "Israel", dial: "972", min: 8, max: 9 },
  { iso: "IT", name: "Italy", dial: "39", min: 6, max: 11 },
  { iso: "JP", name: "Japan", dial: "81", min: 10, max: 10 },
  { iso: "KR", name: "South Korea", dial: "82", min: 9, max: 10 },
  { iso: "KW", name: "Kuwait", dial: "965", min: 8, max: 8 },
  { iso: "LK", name: "Sri Lanka", dial: "94", min: 9, max: 9 },
  { iso: "MX", name: "Mexico", dial: "52", min: 10, max: 10 },
  { iso: "MY", name: "Malaysia", dial: "60", min: 9, max: 10 },
  { iso: "NG", name: "Nigeria", dial: "234", min: 10, max: 10 },
  { iso: "NL", name: "Netherlands", dial: "31", min: 9, max: 9 },
  { iso: "NO", name: "Norway", dial: "47", min: 8, max: 8 },
  { iso: "NP", name: "Nepal", dial: "977", min: 9, max: 10 },
  { iso: "NZ", name: "New Zealand", dial: "64", min: 8, max: 10 },
  { iso: "PH", name: "Philippines", dial: "63", min: 10, max: 10 },
  { iso: "PK", name: "Pakistan", dial: "92", min: 10, max: 10 },
  { iso: "PL", name: "Poland", dial: "48", min: 9, max: 9 },
  { iso: "PT", name: "Portugal", dial: "351", min: 9, max: 9 },
  { iso: "QA", name: "Qatar", dial: "974", min: 8, max: 8 },
  { iso: "RO", name: "Romania", dial: "40", min: 9, max: 9 },
  { iso: "RU", name: "Russia", dial: "7", min: 10, max: 10 },
  { iso: "SA", name: "Saudi Arabia", dial: "966", min: 9, max: 9 },
  { iso: "SE", name: "Sweden", dial: "46", min: 7, max: 13 },
  { iso: "SG", name: "Singapore", dial: "65", min: 8, max: 8 },
  { iso: "TH", name: "Thailand", dial: "66", min: 8, max: 9 },
  { iso: "TR", name: "Turkey", dial: "90", min: 10, max: 10 },
  { iso: "TW", name: "Taiwan", dial: "886", min: 9, max: 9 },
  { iso: "UA", name: "Ukraine", dial: "380", min: 9, max: 9 },
  { iso: "US", name: "United States", dial: "1", min: 10, max: 10 },
  { iso: "VN", name: "Vietnam", dial: "84", min: 9, max: 10 },
  { iso: "ZA", name: "South Africa", dial: "27", min: 9, max: 9 },
];

export function flagFor(iso: string): string {
  const code = iso.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)));
}

export function findCountry(iso: string): Country | undefined {
  return COUNTRIES.find((c) => c.iso === iso);
}

export const DEFAULT_COUNTRY_ISO = "IN";
