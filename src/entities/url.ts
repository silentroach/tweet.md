import { escapePart, link } from "../markdown";
import type { UrlEntity } from "../types";

// @todo + unwound?
export const url = (data: UrlEntity): string =>
  link(escapePart(data.display_url), data.url, data.expanded_url);
