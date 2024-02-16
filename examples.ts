import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";

import { parse } from "json5";

import { renderTweet } from "./src/";

const readmePath = resolve(__dirname, "README.md");
const examplesPath = resolve(__dirname, "examples");
const splitter = "<!-- CUT -->";

const examplesData = readdirSync(examplesPath)
  .map((filename) => {
    console.log(`Rendering ${filename}...`);

    const examplePath = resolve(examplesPath, filename);
    const relativePath = relative(__dirname, examplePath);

    const tweetData = parse(
      readFileSync(examplePath, {
        encoding: "utf-8",
      }),
    );

    return `### [${filename}](${relativePath})

${renderTweet(tweetData)}
`;
  })
  .join("\n---\n\n");

const [heading] = readFileSync(readmePath, {
  encoding: "utf-8",
}).split(splitter);

writeFileSync(
  readmePath,
  `${heading}${splitter}

${examplesData}
`,
  { encoding: "utf-8" },
);
