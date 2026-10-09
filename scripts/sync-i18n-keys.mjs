import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const messages = join(root, "messages");
const locales = ["hi", "ja", "sa", "zh", "ru"];

function fillMissing(template, translation) {
  if (!template || typeof template !== "object" || Array.isArray(template)) return translation;
  const target =
    translation && typeof translation === "object" && !Array.isArray(translation)
      ? translation
      : {};
  for (const [key, value] of Object.entries(template)) {
    if (!(key in target)) target[key] = value;
    else target[key] = fillMissing(value, target[key]);
  }
  return target;
}

const english = JSON.parse(readFileSync(join(messages, "en.json"), "utf8"));
for (const locale of locales) {
  const path = join(messages, `${locale}.json`);
  const translated = JSON.parse(readFileSync(path, "utf8"));
  writeFileSync(path, `${JSON.stringify(fillMissing(english, translated), null, 2)}\n`);
}
