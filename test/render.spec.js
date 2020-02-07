const fs = require("fs");
const path = require("path");

const render = require("../");

describe("render", () => {
  it("should render nothing to empty string", () => {
    expect(render("")).toBe("");
    expect(render(undefined)).toBe("");
  });

  describe("fixtures", () => {
    const fixturesPath = path.resolve(__dirname, "__fixtures__");

    fs.readdirSync(fixturesPath).forEach(filename => {
      const filepath = path.resolve(fixturesPath, filename);
      const data = require(filepath);

      it(filename, () => {
        expect(render(data)).toMatchSnapshot();
      });
    });
  });
});
