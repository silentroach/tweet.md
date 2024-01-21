import { link } from "../markdown";
import type { MediaEntity } from "../types";

export const media = (data: MediaEntity): string =>
  link(data.display_url, data.url);
