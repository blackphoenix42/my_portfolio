#!/usr/bin/env node
// Create a new ADR from docs/ADR/0000-template.md.
// Usage: npm run adr -- "Short title"
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const ADR_DIR = join(ROOT, "docs", "ADR");
const TEMPLATE = join(ADR_DIR, "0000-template.md");

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run adr -- "Title of the ADR"');
  process.exit(1);
}

const existing = readdirSync(ADR_DIR).filter((f) => /^\d{4}-.*\.md$/.test(f));
const max = existing
  .map((f) => parseInt(f.slice(0, 4), 10))
  .filter((n) => Number.isFinite(n))
  .reduce((a, b) => Math.max(a, b), 0);
const next = String(max + 1).padStart(4, "0");

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
const filename = `${next}-${slug}.md`;
const filepath = join(ADR_DIR, filename);

const today = new Date().toISOString().slice(0, 10);
let content = readFileSync(TEMPLATE, "utf8");
content = content
  .replace("id: NNNN", `id: ${next}`)
  .replace("title: <Short, imperative phrase>", `title: ${title}`)
  .replace("date: YYYY-MM-DD", `date: ${today}`)
  .replace("# NNNN — <Short, imperative phrase>", `# ${next} — ${title}`);

writeFileSync(filepath, content);
console.log(`Created ${filepath}`);
