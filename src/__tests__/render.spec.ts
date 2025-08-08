import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { parse } from "json5";
import { describe, expect, test } from "vitest";

import { renderTweet } from "../";

const fixturesPath = resolve(__dirname, "__fixtures__");

describe("renderTweet", () => {
  readdirSync(fixturesPath).forEach((filename) => {
    const filepath = resolve(fixturesPath, filename);
    const data = parse(readFileSync(filepath, { encoding: "utf-8" }));

    test(filename, () => {
      expect(renderTweet(data)).toMatchSnapshot();
    });
  });

  test("quote above the text", () => {
    const data = parse(
      readFileSync(resolve(fixturesPath, "quote.json5"), {
        encoding: "utf-8",
      }),
    );

    expect(
      renderTweet(data, { render: { quote: { aboveText: true } } }),
    ).toMatchSnapshot();
  });
});
