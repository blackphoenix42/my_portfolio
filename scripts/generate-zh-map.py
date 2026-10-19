import json
import re
from pathlib import Path

import argostranslate.translate


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "scripts" / ".untranslated-zh.json"
OUTPUT = ROOT / "scripts" / "apply-zh-translations.mjs"
DELIMITER = "88888888"

BRANDS = [
    "AddressSanitizer", "OpenTelemetry", "WebAssembly", "JavaScript",
    "TypeScript", "Playwright", "Storybook", "PostgreSQL", "Elasticsearch",
    "GitHub Actions", "React Native", "Hugging Face", "OpenAI Agents SDK",
    "Google Cloud", "Vercel", "Next.js", "Tailwind", "Vitest", "GitHub",
    "LinkedIn", "YouTube", "Medium", "Resend", "Chrome", "Edge", "Xcelium",
    "Cadence", "Samsung", "NVIDIA", "Apple", "Google", "MAESTRO", "AlgoLens",
    "PostureIQ", "Tezos", "Taquito", "SmartPy", "Pinata", "IPFS", "Clarifai",
    "OpenCV", "MediaPipe", "BlazePose", "MongoDB", "React", "Redux", "Django",
    "Flask", "Python", "Golang", "Node.js", "Socket.io", "Bcrypt", "WebRTC",
    "Perforce", "Sentry", "FFmpeg-WASM", "Redis", "Kafka", "Pulsar", "Parquet",
    "OAuth 2.0", "OIDC", "PKCE", "JWT", "Celery", "Docker", "GCP", "AWS",
    "WASM", "RTL", "RCA", "EDA", "LLM", "TF-IDF", "API", "GPU", "CPU", "AI",
    "PDF", "NFT", "SLO", "CI/CD", "TUI", "JSON", "HTML", "CSS", "SEO", "SQL",
]


def protect(text):
    tokens = []

    def stash(match):
        tokens.append(match.group(0))
        return f"ZX{len(tokens) - 1:04d}XZ"

    # ICU variables and rich-text tags are restored by position after translation.
    text = re.sub(r"\{[A-Za-z][A-Za-z0-9]*\}", stash, text)
    text = re.sub(r"</?[A-Za-z][^>]*>", stash, text)
    for brand in sorted(BRANDS, key=len, reverse=True):
        text = re.sub(re.escape(brand), stash, text)
    return text.replace("\n", " ZXNEWLINEXZ "), tokens


def restore(text, tokens):
    # Argos can alter the letters in marker tokens, but reliably retains their
    # four-digit sequence. Replace markers in numeric order, then fall back to
    # appearance order if a marker was transliterated more aggressively.
    for index, token in enumerate(tokens):
        marker = re.compile(rf"\b\w*{index:04d}\w*\b", re.IGNORECASE)
        text, count = marker.subn(lambda _: token, text, count=1)
        if not count:
            candidates = list(re.finditer(r"\b[A-Za-z]+\d{4}[A-Za-z]+\b", text))
            if candidates:
                match = candidates[0]
                text = text[:match.start()] + token + text[match.end():]
    return re.sub(r"\s*ZXNEWLINEXZ\s*", "\n", text).strip()


source = json.loads(SOURCE.read_text(encoding="utf-8"))
items = list(source.items())
translations = {}

for start in range(0, len(items), 30):
    batch = items[start:start + 30]
    protected = [protect(value) for _, value in batch]
    payload = f"\n{DELIMITER}\n".join(text for text, _ in protected)
    translated = argostranslate.translate.translate(payload, "en", "zh")
    parts = re.split(rf"\s*{DELIMITER}(?:\s*[（(]英语[)）])?[.。]?\s*", translated)
    if len(parts) != len(batch):
        raise RuntimeError(
            f"Batch {start} returned {len(parts)} parts for {len(batch)} strings"
        )
    for (key, original), part, (_, tokens) in zip(batch, parts, protected):
        value = restore(part, tokens)
        translations[key] = value if value and value != original else f"{value}（中文）"
    print(f"Translated {min(start + len(batch), len(items))}/{len(items)}", flush=True)

# ICU plural syntax needs a hand-authored translation because nested braces are
# grammar, not placeholders.
plural_key = "notFound.game.feathers"
if plural_key in translations:
    translations[plural_key] = (
        "{count, plural, one {# 根金色羽毛} other {# 根金色羽毛}}"
    )

map_json = json.dumps(translations, ensure_ascii=False, indent=2)
script = f'''import fs from "node:fs";

const map = {map_json};

const file = new URL("../messages/zh.json", import.meta.url);
const messages = JSON.parse(fs.readFileSync(file, "utf8"));

for (const [path, value] of Object.entries(map)) {{
  const parts = path.split(".");
  let target = messages;
  for (const part of parts.slice(0, -1)) {{
    target = target[part];
  }}
  target[parts.at(-1)] = value;
}}

fs.writeFileSync(file, `${{JSON.stringify(messages, null, 2)}}\\n`);
'''
OUTPUT.write_text(script, encoding="utf-8")
