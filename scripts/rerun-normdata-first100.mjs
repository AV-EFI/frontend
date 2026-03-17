import fs from "node:fs";
import { suggestNormdataIds } from "./suggest-normdata-ids.js";

function readJsonWithBom(filePath) {
  const buffer = fs.readFileSync(filePath);
  let raw;

  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    raw = new TextDecoder("utf-16le").decode(buffer);
  } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    raw = new TextDecoder("utf-16be").decode(buffer);
  } else {
    raw = buffer.toString("utf8");
  }

  raw = raw.replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

async function main() {
  const subjectsIn = readJsonWithBom("normdata_extended_has_subject.json");
  const genresIn = readJsonWithBom("normdata_extended_has_genre.json");

  const subjectsFirst100 = subjectsIn.slice(0, 100).map((entry) => ({ value: entry.genre }));
  const genresFirst100 = genresIn.slice(0, 100).map((entry) => ({ value: entry.genre }));

  const subjectsOut = await suggestNormdataIds(subjectsFirst100);
  const genresOut = await suggestNormdataIds(genresFirst100);

  fs.writeFileSync("normdata_extended_has_subject.first100.rerun.json", JSON.stringify(subjectsOut, null, 2), "utf8");
  fs.writeFileSync("normdata_extended_has_genre.first100.rerun.json", JSON.stringify(genresOut, null, 2), "utf8");

  console.log(`WROTE ${subjectsOut.length} subjects and ${genresOut.length} genres`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
