/**
 * Generate docs/ENDPOINTS.md from src/lib/route-aliases.mjs
 * Usage: node scripts/generate-endpoints-doc.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGE_ALIASES, SLUG_ALIASES, buildAliasRedirects } from "../src/lib/route-aliases.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const redirects = buildAliasRedirects();
const code = (s) => `\`${s}\``;

let md = `# Endpoints and alternate paths

Canonical routes used by nav, sitemap, and internal links — plus the
**permanent redirects** that accept typos, synonyms, and short forms.

Source of truth for redirects: ${code("src/lib/route-aliases.mjs")} (wired in
${code("next.config.mjs")}). Locale prefixes are never used
(${code('localePrefix: "never"')}).

Generated: ${new Date().toISOString().slice(0, 10)} · **${redirects.length}** redirect rules.

---

## Canonical pages

| Canonical | Alternates (redirect here) |
| --------- | -------------------------- |
`;

for (const [dest, alts] of Object.entries(PAGE_ALIASES)) {
  md += `| ${code(dest)} | ${alts.map(code).join(", ")} |\n`;
}

md += `
### Also canonical (few or no public aliases)

| Path | Notes |
| ---- | ----- |
| ${code("/")} | Home |
| ${code("/lab")} | Redirects to ${code("/competitive-programming")} (legacy) |
| ${code("/humans.txt")} | Content-negotiated humans.txt |
| ${code("/robots.txt")} | Always plain text |
| ${code("/sitemap.xml")} | Sitemap |
| ${code("/feeds/medium.xml")} | Same-origin Medium RSS proxy |
| ${code("/feeds/youtube.xml")} | Same-origin YouTube Atom proxy |
| ${code("/feeds/github.atom")} | Same-origin GitHub Atom proxy |
| ${code("/api/contact")} | Contact form POST |
| ${code("/api/chat")} | Ask Ayush server stream (off unless enabled) |
| ${code("/api/commits")} | Commit-rain messages by time window |

---

## Dynamic slug aliases

### Work (${code("/work/:slug")})

| Canonical | Alternates |
| --------- | ---------- |
`;

for (const [slug, alts] of Object.entries(SLUG_ALIASES["/work"] ?? {})) {
  md += `| ${code(`/work/${slug}`)} | ${alts.map((a) => code(`/work/${a}`)).join(", ")} |\n`;
}

md += `
### System design (${code("/system-design/:slug")})

Alternates also work under page aliases (e.g. ${code("/sysdesign/shortener")} →
${code("/system-design/url-shortener")}).

| Canonical | Slug alternates |
| --------- | --------------- |
`;

for (const [slug, alts] of Object.entries(SLUG_ALIASES["/system-design"] ?? {})) {
  md += `| ${code(`/system-design/${slug}`)} | ${alts.map(code).join(", ")} |\n`;
}

md += `
---

## Full redirect list

| From | To |
| ---- | -- |
`;

for (const r of redirects) {
  md += `| ${code(r.source)} | ${code(r.destination)} |\n`;
}

md += `
---

## Maintenance

1. Edit ${code("src/lib/route-aliases.mjs")} (${code("PAGE_ALIASES")} / ${code("SLUG_ALIASES")}).
2. Rebuild so ${code("next.config.mjs")} picks up redirects.
3. Regenerate this doc:

\`\`\`sh
node scripts/generate-endpoints-doc.mjs
\`\`\`

Do **not** list aliases in the sitemap — only canonical URLs.
`;

writeFileSync(join(root, "docs/ENDPOINTS.md"), md);
console.log(`[generate-endpoints-doc] wrote docs/ENDPOINTS.md (${redirects.length} redirects)`);
