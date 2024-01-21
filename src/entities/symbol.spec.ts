import { symbol } from "./symbol";

it("renders symbol", () => {
  expect(
    symbol({
      indices: [0, 1],
      text: "APPL",
    }),
  ).toMatchInlineSnapshot(
    `"[$APPL](https://twitter.com/search?q=%23APPL&src=ctag)"`,
  );
});
