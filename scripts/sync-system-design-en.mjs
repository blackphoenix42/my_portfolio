/**
 * Sync messages/en.json systemDesign.systems.* from src/content/system-design.ts
 * (English source of truth for whiteboard copy).
 *
 * Usage: node --experimental-strip-types scripts/sync-system-design-en.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentUrl = pathToFileURL(join(root, "src/content/system-design.ts")).href;
const { systemDesigns, systemDesignNotes } = await import(contentUrl);

const enPath = join(root, "messages/en.json");
const en = JSON.parse(readFileSync(enPath, "utf8"));

const systems = {};
for (const item of systemDesigns) {
  const notes = systemDesignNotes[item.slug];
  systems[item.slug] = {
    title: item.title,
    tagline: item.tagline,
    requirements: Object.fromEntries(item.requirements.map((v, i) => [String(i), v])),
    components: Object.fromEntries(
      item.components.map((c, i) => [String(i), { name: c.name, role: c.role }]),
    ),
    tradeoffs: Object.fromEntries(item.tradeoffs.map((v, i) => [String(i), v])),
    lld: {
      dataModel: notes.dataModel,
      api: notes.api,
      execution: notes.execution,
      pseudocode: notes.pseudocode,
      failures: notes.failures,
    },
  };
}

en.systemDesign.systems = systems;
en.systemDesign.galleryIntro =
  "Senior-style reference designs: capacity-aware HLD, deployment UML, and implementation-level LLD — interactive demos included where noted.";
en.systemDesign.pageIntro =
  "Whiteboards written the way I’d present them in a design review: requirements with SLOs, layered architecture, data models, APIs, failure modes, and executable pseudo-code.";
en.systemDesign.umlCaption =
  "Deployment-style component diagram · solid = sync path · dashed = async / degraded";
en.systemDesign.uml = "Architecture diagram";
en.systemDesign.demoScope =
  "Portfolio reference demo: browser-simulated control flow. Treat HLD/LLD below as the design artifact; the demo is illustrative, not a production deployment claim.";

writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`);
console.log(
  `[sync-system-design-en] updated ${Object.keys(systems).length} systems in messages/en.json`,
);
