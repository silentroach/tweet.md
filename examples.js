const fs = require("fs");
const path = require("path");

const render = require("./");

const readmePath = path.resolve(__dirname, "README.md");
const examplesPath = path.resolve(__dirname, "examples");
const splitter = "<!-- CUT -->";

const examplesData = fs
  .readdirSync(examplesPath)
  .map((filename) => {
    const examplePath = path.resolve(examplesPath, filename);
    const relativePath = path.relative(__dirname, examplePath);

    const tweetData = JSON.parse(
      fs.readFileSync(examplePath, {
        encoding: "utf-8",
      })
    );

    return `### [${filename}](${relativePath})

${render(tweetData)}
`;
  })
  .join("- - -\n\n");

const [heading] = fs
  .readFileSync(readmePath, {
    encoding: "utf-8",
  })
  .split(splitter);

fs.writeFileSync(
  readmePath,
  `${heading}${splitter}

${examplesData}
`
);
