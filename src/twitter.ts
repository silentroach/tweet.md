import type { UrlEntity } from "./types";

const TwitterHost = "twitter.com";
const TwitterStatusIdRegexp = /\/status\/(\w+)$/;
const TwitterBaseUrl = `https://${TwitterHost}`;

export const getStatusIdFromUrlEntity = (
  entity: UrlEntity,
): string | undefined => {
  const { expanded_url: url } = entity;
  if (!url) return;

  const parsed = new URL(url);
  if (TwitterHost !== parsed.hostname) return;

  const statusMatch = parsed.pathname.match(TwitterStatusIdRegexp);
  if (statusMatch === null) {
    return;
  }

  return statusMatch[1];
};

export const getTwitterUrl = (
  pathname: string,
  query?: Record<string, string>,
): string => {
  const url = new URL(TwitterBaseUrl);
  url.pathname = pathname;
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }

  return String(url);
};

export const getTwitterHashUrl = (query: string, source?: string): string => {
  const parameters: Record<string, string> = { q: `#${query}` };
  if (source !== undefined) {
    parameters.src = source;
  }

  return getTwitterUrl("search", parameters);
};
