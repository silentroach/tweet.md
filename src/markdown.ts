const replacements: Array<[RegExp, string]> = [
  // escaping symbols: # * ( ) [ ] _ `
  [/([#*()\[\]_`\\])/g, "\\$1"],

  // escaping less and more signs
  [/</g, "&lt;"],
  [/>/g, "&gt;"],

  // convert line break into markdown hard break
  [/\n/g, "  \n"],
] as const;

export const escapePart = (input: string): string =>
  replacements.reduce(
    (input, [replaceFrom, replaceTo]) => input.replace(replaceFrom, replaceTo),
    input,
  );

export const escape = (input: string): string =>
  escapePart(input)
    // escaping period after number at the string start
    .replace(/^(\d+)\./, "$1\\.");

export const link = (name: string, url: string, title?: string): string => {
  const parts = [url];
  if (title) {
    parts.push(`"${title}"`);
  }

  return `[${name}](${parts.join(" ")})`;
};
