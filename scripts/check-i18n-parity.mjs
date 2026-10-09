import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const messages = join(root, "messages");
const locales = ["hi", "ja", "sa", "zh", "ru"];
const soft = process.argv.includes("--soft");

function flatten(value, prefix = "") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) =>
      flatten(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

const english = JSON.parse(readFileSync(join(messages, "en.json"), "utf8"));
const expected = new Set(flatten(english));
let failed = false;
for (const locale of locales) {
  const translated = JSON.parse(readFileSync(join(messages, `${locale}.json`), "utf8"));
  const actual = new Set(flatten(translated));
  const missing = [...expected].filter((key) => !actual.has(key));
  if (!missing.length) continue;
  failed = true;
  console.error(`${locale}: missing ${missing.length} key(s)`);
  for (const key of missing) console.error(`  ${key}`);
}
if (failed && !soft) process.exitCode = 1;
