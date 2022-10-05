const { parse: parseUrl, format: formatUrl } = require("url");

const TwitterStatusIdRegexp = /\/status\/(\w+)$/;

const TwitterHost = "twitter.com";
const TwitterUrlParsed = parseUrl(`https://${TwitterHost}`);

const getTwitterUrl = (pathname, query) =>
  formatUrl({ ...TwitterUrlParsed, pathname, query });

const getTwitterHashUrl = (query, source) => {
  const parameters = { q: `#${query}` };
  if (undefined !== source) {
    parameters.src = source;
  }

  return getTwitterUrl("search", parameters);
};

const escapeReplacements = [
  // escaping symbols: # * ( ) [ ] _ `
  [/([#*()\[\]_`\\])/g, "\\$1"],

  // escaping less and more signs
  [/</g, "&lt;"],
  [/>/g, "&gt;"],

  // convert line break into markdown hard break
  [/\n/g, "  \n"],
];

const escapeMarkdownPart = (input) =>
  escapeReplacements.reduce(
    (input, [replaceFrom, replaceTo]) => input.replace(replaceFrom, replaceTo),
    input
  );

const escapeMarkdown = (input) =>
  escapeMarkdownPart(input)
    // escaping period after number at the string start
    .replace(/^(\d+)\./, "$1\\.");

const renderMarkdownLink = (name, url, title) => {
  const parts = [url];
  if (title) {
    parts.push(`"${title}"`);
  }

  return `[${name}](${parts.join(" ")})`;
};

const renderMarkdownLinkName = (name, prefix) => {
  const data = [escapeMarkdownPart(name)];
  if (prefix) {
    data.unshift(prefix);
  }

  return data.join("");
};

const renderEntityMedia = (data) =>
  renderMarkdownLink(data.display_url, data.url);

const renderEntityMention = (data) =>
  renderMarkdownLink(
    renderMarkdownLinkName(data.screen_name, "@"),
    getTwitterUrl(data.screen_name),
    data.name
  );

const renderEntityHashtag = (data) =>
  renderMarkdownLink(
    renderMarkdownLinkName(data.text, "#"),
    getTwitterHashUrl(data.text)
  );

const renderEntitySymbol = (data) =>
  renderMarkdownLink(
    renderMarkdownLinkName(data.text, "$"),
    getTwitterHashUrl(data.text, "ctag")
  );

const renderEntityUrl = (data) =>
  renderMarkdownLink(
    renderMarkdownLinkName(data.display_url),
    data.url,
    data.expanded_url
  );

const renderEntity = (type, data) => {
  if (data.skip) return;

  switch (type) {
    case "user_mentions":
      return renderEntityMention(data);
    case "media":
      return renderEntityMedia(data);
    case "hashtags":
      return renderEntityHashtag(data);
    case "urls":
      return renderEntityUrl(data);
    case "symbols":
      return renderEntitySymbol(data);
    default:
      return null; // not undefined!
  }
};

const unicodeCharAt = (string, index) => {
  const first = string.charCodeAt(index);

  if (first >= 0xd800 && first <= 0xdbff && string.length > index + 1) {
    const second = string.charCodeAt(index + 1);
    if (second >= 0xdc00 && second <= 0xdfff) {
      return string.substring(index, index + 2);
    }
  }

  return string[index];
};

const unicodeSlice = (string, start, end = string.length) => {
  if (start === end) {
    return "";
  }

  const accumulator = [];
  let character;
  let stringIndex = 0;
  let unicodeIndex = 0;
  const length = string.length;

  while (stringIndex < length) {
    character = unicodeCharAt(string, stringIndex);
    if (unicodeIndex >= start && unicodeIndex < end) {
      accumulator.push(character);
    }
    stringIndex += character.length;
    unicodeIndex += 1;
  }

  return accumulator.join("");
};

const processText = (text, replacements) => {
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
    }, []);

  parts.push(escapeMarkdown(unicodeSlice(text, lastPos)));

  return parts.join("");
};

const getStatusIdFromUrlEntity = (entity) => {
  const { expanded_url: url } = entity;
  if (!url) return;

  const parsed = parseUrl(url);
  if (!parsed || TwitterHost !== parsed.hostname) return;

  const statusMatch = parsed.path.match(TwitterStatusIdRegexp);
  return statusMatch && statusMatch[1];
};

const renderTweet = (tweet = {}) => {
  const source = tweet.extended_tweet || tweet;

  const entities = Object.assign({}, source.entities);
  const text = source.full_text || source.text || "";

  const { quoted_status: quote } = source;

  const replacements = [];
  Object.keys(entities).forEach((entityKey) => {
    const entityList = entities[entityKey];

    // we should skip last link if it is a quote link
    if (quote && "urls" === entityKey && entityList.length > 0) {
      const lastLink = entityList[entityList.length - 1];

      if (getStatusIdFromUrlEntity(lastLink) === quote.id_str) {
        lastLink.skip = true;
      }
    }

    replacements.push(
      ...entityList
        .map((entity) => {
          const [start, end] = entity.indices;
          return [renderEntity(entityKey, entity), start, end];
        })
        // do not add anything unknown
        .filter((data) => null !== data[0])
    );
  });

  const output =
    0 === replacements.length
      ? escapeMarkdown(text)
      : processText(text, replacements);

  return [output, quote && renderQuote(quote)].filter(Boolean).join("\n");
};

const renderQuote = (data) => {
  const content = renderTweet(data)
    .split("\n")
    .map((row) => `> ${row}`)
    .join("\n");

  return `
${content}`;
};

module.exports = renderTweet;
