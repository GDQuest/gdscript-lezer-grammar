import { join, dirname, extname } from "path";
import { readFile, readdir, writeFile } from "fs/promises";
import { fileURLToPath } from "url";

import { printTree } from "./printLezerTree.mts";

import { parser } from "../src/index.mts";

const FILE_PATH = dirname(fileURLToPath(import.meta.url));
const SAMPLES_PATH = join(FILE_PATH, "..", "samples");

const files = await readdir(SAMPLES_PATH);
for (const file of files) {
  if (extname(file) !== ".gd") {
    continue;
  }

  const filePath = join(SAMPLES_PATH, file);
  const fileContent = await readFile(filePath, { encoding: "utf-8" });
  const tree = parser.parse(fileContent);
  await writeFile(
    join(SAMPLES_PATH, `${file}.out`),
    printTree(tree, fileContent, { doNotColorize: true })
  );
}
