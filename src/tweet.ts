import { entity as renderEntity } from "./entities";
import {
  escape as escapeMarkdown,
  escapePart as escapeMarkdownPart,
} from "./markdown";
import { getStatusIdFromUrlEntity } from "./twitter";
import type { Tweet } from "./types";
import { objectEntries, unicodeSlice } from "./utils";

type Replacement = [string, number, number];

const processText = (text: string, replacements: Replacement[]): string => {
  if (replacements.length === 0) {
    return escapeMarkdown(text);
  }

  let lastPos = 0;

  const parts = replacements
    .sort((a, b) => a[1] - b[1])
    .reduce((parts, repl) => {
      const [replacement, start, end] = repl;

      parts.push(
        escapeMarkdownPart(unicodeSlice(text, lastPos, start)),
        replacement
      );

      lastPos = end;

      return parts;
    }, [] as string[]);

  parts.push(escapeMarkdown(unicodeSlice(text, lastPos)));

  return parts.join("");
};

export const tweet = (data: Tweet): string => {
  const text =
    data.truncated && data.extended_tweet
      ? data.extended_tweet.full_text
      : data.text;

  const { quoted_status: quoted } = data;

  const skipList = new Set<unknown>();
  const replacements: Replacement[] = [];
  for (const [entityType, entities] of objectEntries(data.entities ?? {})) {
    // we should skip last link if it is a quote link
    if (quoted && "urls" === entityType && entities.length > 0) {
      const lastLink = entities.at(-1)!;

      if (getStatusIdFromUrlEntity(lastLink) === quoted.id_str) {
        skipList.add(lastLink);
      }
    }

    replacements.push(
      ...entities
        .map((entity) => {
          const [start, end] = entity.indices;
          if (skipList.has(entity)) {
            return ["", start, end];
          }

          const rendered = renderEntity(entityType as any, entity as any);
          if (rendered === undefined) {
            return;
          }

          return [rendered, start, end];
        })
        // do not add anything unknown
        .filter((data): data is Replacement => data !== undefined)
    );
  }

  return [processText(text, replacements), quoted && quote(quoted)]
    .filter(Boolean)
    .join("\n");
};

const quote = (data: Tweet): string => {
  const content = tweet(data)
    .split("\n")
    .map((row) => `> ${row}`)
    .join("\n");

  return `
${content}`;
};
