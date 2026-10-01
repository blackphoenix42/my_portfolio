// Keep executable WASM same-origin and tied to the locked npm dependency.
import { copyFile, mkdir } from "node:fs/promises";

const output = new URL("../public/wllama/", import.meta.url);
await mkdir(output, { recursive: true });
await copyFile(
  new URL("../node_modules/@wllama/wllama/esm/wasm/wllama.wasm", import.meta.url),
  new URL("wllama.wasm", output),
);
