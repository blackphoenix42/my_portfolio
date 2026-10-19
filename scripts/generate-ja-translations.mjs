import fs from "node:fs";

const sourcePath = new URL("./.untranslated-ja.json", import.meta.url);
const outputPath = new URL("./apply-ja-translations.mjs", import.meta.url);
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const protectedTerms = [
  "AddressSanitizer|Cadence Design Systems|Air Force Bal Bharati School|OpenAI Agents SDK|MediaPipe/BlazePose|Redux Toolkit|Google Cloud|GitHub Actions|GitHub Copilot|Hugging Face|Tezos India|React Native|Llama 3.2 1B|Qwen2.5 0.5B|FFmpeg-WASM|OpenTelemetry|WebAssembly|TypeScript|JavaScript|PostgreSQL|Elasticsearch|Playwright|Storybook|Tailwind|Next.js|Node.js|Socket.io|SmartPy|Taquito|Valgrind|Clarifai|Coursera|HackerRank|LinkedIn|YouTube|Medium|Resend|Vercel|Vitest|Chrome|GitHub|OpenCV|MAESTRO|MongoDB|NVIDIA|Samsung|Cadence|Xcelium|Python|React|Redux|Django|Flask|Docker|Celery|Redis|Kafka|Pulsar|Sentry|Percy|Pinata|Tezos|Apple|Google|Microsoft|Amazon|Bcrypt|Canvas|Express|GCP|GenAI|IPFS|JEDAI|NIIT|NSUT|WASM|WebRTC|EDA|API|AI|PDF|RTL",
]
  .join("|")
  .split("|")
  .sort((a, b) => b.length - a.length);

function braceRanges(text) {
  const ranges = [];
  let start = -1;
  let depth = 0;
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (text[index] === "}" && depth > 0) {
      depth -= 1;
      if (depth === 0) ranges.push([start, index + 1]);
    }
  }
  return ranges;
}

function protect(text) {
  const tokens = [];
  const replacements = [];

  for (const [start, end] of braceRanges(text)) {
    replacements.push({ start, end, value: text.slice(start, end) });
  }

  for (const term of protectedTerms) {
    let from = 0;
    while (true) {
      const index = text.indexOf(term, from);
      if (index === -1) break;
      replacements.push({ start: index, end: index + term.length, value: term });
      from = index + term.length;
    }
  }

  replacements.sort((a, b) => a.start - b.start || b.end - a.end);
  const accepted = [];
  let cursor = -1;
  for (const item of replacements) {
    if (item.start >= cursor) {
      accepted.push(item);
      cursor = item.end;
    }
  }

  let result = "";
  cursor = 0;
  for (const item of accepted) {
    result += text.slice(cursor, item.start);
    const marker = `__PH${tokens.length}__`;
    tokens.push([marker, item.value]);
    result += marker;
    cursor = item.end;
  }
  result += text.slice(cursor);
  return { text: result, tokens };
}

function restore(text, tokens) {
  let result = text;
  for (const [marker, value] of tokens) {
    result = result.replaceAll(marker, value);
  }
  return result
    .replaceAll("％", "%")
    .replaceAll("～", "〜")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .trim();
}

async function translate(value, attempt = 0) {
  const protectedValue = protect(value);
  const params = new URLSearchParams({
    client: "gtx",
    dt: "t",
    sl: "en",
    tl: "ja",
    q: protectedValue.text,
  });
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const translated = data[0].map((part) => part[0]).join("");
    const restored = restore(translated, protectedValue.tokens);
    for (const [, token] of protectedValue.tokens) {
      if (!restored.includes(token)) {
        throw new Error(
          `Lost protected token: ${token}\nInput: ${protectedValue.text}\nOutput: ${translated}`,
        );
      }
    }
    return restored;
  } catch (error) {
    if (attempt >= 5) throw error;
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
    return translate(value, attempt + 1);
  }
}

const entries = Object.entries(source);
const translated = {};
let nextIndex = 0;

async function worker() {
  while (nextIndex < entries.length) {
    const index = nextIndex;
    nextIndex += 1;
    const [key, value] = entries[index];
    translated[key] = await translate(value);
    if ((index + 1) % 25 === 0 || index + 1 === entries.length) {
      console.log(`Translated ${index + 1}/${entries.length}`);
    }
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()));

const orderedMap = Object.fromEntries(entries.map(([key]) => [key, translated[key]]));
const script = `import fs from "node:fs";

const map = ${JSON.stringify(orderedMap, null, 2)};

const messagesPath = new URL("../messages/ja.json", import.meta.url);
const messages = JSON.parse(fs.readFileSync(messagesPath, "utf8"));

for (const [path, value] of Object.entries(map)) {
  const parts = path.split(".");
  let current = messages;
  for (const part of parts.slice(0, -1)) {
    current = current[part];
  }
  current[parts.at(-1)] = value;
}

fs.writeFileSync(messagesPath, \`\${JSON.stringify(messages, null, 2)}\\n\`);
console.log(\`Applied \${Object.keys(map).length} Japanese translations.\`);
`;

fs.writeFileSync(outputPath, script);
console.log(`Wrote ${outputPath.pathname}`);
