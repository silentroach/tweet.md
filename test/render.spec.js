const fs = require("node:fs");
const path = require("node:path");

const render = require("../");

const fixturesPath = path.resolve(__dirname, "__fixtures__");

describe("render", () => {
  it("should render nothing to empty string", () => {
    expect(render("")).toBe("");
    expect(render(undefined)).toBe("");
  });

  describe("fixtures", () => {
    fs.readdirSync(fixturesPath).forEach((filename) => {
      const filepath = path.resolve(fixturesPath, filename);
      const data = require(filepath);

      it(filename, () => {
        expect(render(data)).toMatchSnapshot();
      });
    });
  });
});
