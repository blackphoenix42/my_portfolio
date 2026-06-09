/**
 * Derive a likely company name from an email address, for the contact form's
 * "company" autofill. Returns `null` when the sender uses a free/public email
 * provider or the address is unusable — in which case the field is left blank
 * (we never guess a company for a personal gmail/outlook address).
 *
 * Pure and DOM-free so it lives under `src/lib/**` and is covered by the
 * coverage gate in `vitest.config.ts`.
 */

// Free / public mailbox providers. An address at one of these tells us nothing
// about the sender's employer, so we leave the company field blank.
const FREE_PROVIDERS = new Set<string>([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "hotmail.co.uk",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.co.in",
  "yahoo.co.uk",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.net",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
  "fastmail.com",
  "tutanota.com",
  "tuta.io",
  "mail.com",
  "duck.com",
  "hey.com",
  "rediffmail.com",
  "qq.com",
  "163.com",
  "126.com",
  "naver.com",
]);

// Well-known domains whose canonical display name differs from a naive
// title-case of the second-level label (acronyms, multi-word brands, parents).
const KNOWN: Record<string, string> = {
  "google.com": "Google",
  "googlemail.com": "Google",
  "microsoft.com": "Microsoft",
  "apple.com": "Apple",
  "amazon.com": "Amazon",
  "aws.amazon.com": "Amazon Web Services",
  "meta.com": "Meta",
  "facebook.com": "Meta",
  "fb.com": "Meta",
  "netflix.com": "Netflix",
  "openai.com": "OpenAI",
  "anthropic.com": "Anthropic",
  "deepmind.com": "DeepMind",
  "nvidia.com": "NVIDIA",
  "amd.com": "AMD",
  "ibm.com": "IBM",
  "sap.com": "SAP",
  "hp.com": "HP",
  "hpe.com": "Hewlett Packard Enterprise",
  "linkedin.com": "LinkedIn",
  "github.com": "GitHub",
  "gitlab.com": "GitLab",
  "tsmc.com": "TSMC",
  "asml.com": "ASML",
  // EDA / semiconductor — full legal/brand names (a naive title-case would
  // render "Cadence", "Synopsys", "Ti", etc.).
  "cadence.com": "Cadence Design Systems",
  "synopsys.com": "Synopsys",
  "siemens.com": "Siemens",
  "mentor.com": "Siemens EDA",
  "intel.com": "Intel",
  "qualcomm.com": "Qualcomm",
  "arm.com": "Arm",
  "nxp.com": "NXP Semiconductors",
  "micron.com": "Micron Technology",
  "ti.com": "Texas Instruments",
  "broadcom.com": "Broadcom",
  "marvell.com": "Marvell Technology",
  "analog.com": "Analog Devices",
  "globalfoundries.com": "GlobalFoundries",
  "samsung.com": "Samsung Electronics",
  "jpmorgan.com": "JPMorgan Chase",
  "jpmchase.com": "JPMorgan Chase",
  "goldmansachs.com": "Goldman Sachs",
  "morganstanley.com": "Morgan Stanley",
  "ey.com": "EY",
  "pwc.com": "PwC",
  "kpmg.com": "KPMG",
  "bcg.com": "BCG",
  "tcs.com": "Tata Consultancy Services",
  "hcltech.com": "HCLTech",
};

// Two-label public suffixes where the registrable label sits one position
// further left (e.g. `acme.co.uk` → `acme`, `iitb.ac.in` → `iitb`).
const MULTI_LABEL_TLDS = new Set<string>([
  "co.uk",
  "ac.uk",
  "gov.uk",
  "org.uk",
  "me.uk",
  "co.in",
  "ac.in",
  "gov.in",
  "net.in",
  "org.in",
  "edu.in",
  "com.au",
  "net.au",
  "org.au",
  "edu.au",
  "gov.au",
  "co.jp",
  "or.jp",
  "ne.jp",
  "ac.jp",
  "co.nz",
  "com.br",
  "com.cn",
  "com.sg",
  "com.hk",
  "co.kr",
]);

function titleCase(label: string): string {
  return label
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * @returns the inferred company name, or `null` if it can't be determined.
 */
export function companyFromEmail(email: string): string | null {
  const trimmed = (email ?? "").trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  // Need at least one char before the "@" and a domain after it.
  if (at < 1) return null;

  const domain = trimmed.slice(at + 1).replace(/\.$/, "");
  if (!domain || /\s/.test(domain) || !domain.includes(".")) return null;

  if (FREE_PROVIDERS.has(domain)) return null;

  const known = KNOWN[domain];
  if (known) return known;

  const parts = domain.split(".").filter(Boolean);
  if (parts.length < 2) return null;

  const lastTwo = parts.slice(-2).join(".");
  const label =
    parts.length >= 3 && MULTI_LABEL_TLDS.has(lastTwo)
      ? parts[parts.length - 3]
      : parts[parts.length - 2];

  // Ignore one-letter labels — too ambiguous to surface as a company name.
  if (!label || label.length < 2) return null;

  return titleCase(label);
}

// Exposed for unit tests.
export const __test = { FREE_PROVIDERS, KNOWN, MULTI_LABEL_TLDS, titleCase };
