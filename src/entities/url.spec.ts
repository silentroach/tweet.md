import { expect, test } from "vitest";

import { url } from "./url";

test("renders url", () => {
  expect(
    url({
      url: "https://t.co/h0I2M3P2vm",
      expanded_url:
        "https://twittercommunity.com/t/removing-the-140-character-limit-from-direct-messages/41348/",
      display_url: "twittercommunity.com/t/removing-the…",
      indices: [54, 77],
    }),
  ).toMatchInlineSnapshot(
    `"[twittercommunity.com/t/removing-the…](https://t.co/h0I2M3P2vm \"https://twittercommunity.com/t/removing-the-140-character-limit-from-direct-messages/41348/\")"`,
  );
});
