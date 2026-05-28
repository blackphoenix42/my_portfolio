import fs from "node:fs";

const files = [
  "src/components/diagrams/case-study-thumbs.tsx",
  "src/components/diagrams/roadmap-diagram.tsx",
  "src/components/diagrams/xmai-architecture.tsx",
];

let total = 0;
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const src = fs.readFileSync(f, "utf8");
  const re = /<motion\.[A-Za-z]+\b[^<]*?>/gs;
  let out = "";
  let last = 0;
  let count = 0;
  for (const m of src.matchAll(re)) {
    out += src.slice(last, m.index);
    let tag = m[0];
    const hasInitial = /\binitial\s*=/.test(tag);
    const hasAnimate = /\banimate\s*=/.test(tag);
    if (!hasInitial && hasAnimate) {
      tag = tag.replace(/^(<motion\.[A-Za-z]+)/, "$1 initial={false}");
      count++;
    }
    out += tag;
    last = m.index + m[0].length;
  }
  out += src.slice(last);
  if (count > 0) {
    fs.writeFileSync(f, out);
    console.log(f, "->", count);
  } else {
    console.log(f, "-> no changes");
  }
  total += count;
}
console.log("TOTAL:", total);
