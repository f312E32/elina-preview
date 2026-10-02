import { copyFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const output = resolve(dirname(fileURLToPath(import.meta.url)), "../out");
let copied = 0;

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

async function prepare(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const nested = join(directory, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const source of await filesIn(nested)) {
        const suffix = relative(nested, source).split(sep).join(".");
        await copyFile(source, join(directory, `${entry.name}.${suffix}`));
        copied += 1;
      }
    } else {
      await prepare(nested);
    }
  }
}

await prepare(output);
await writeFile(join(output, ".nojekyll"), "");
console.log(`GitHub Pages export ready: ${copied} navigation payloads and .nojekyll`);
