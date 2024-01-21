import { escapePart, link } from "../markdown";
import { getTwitterHashUrl } from "../twitter";
import type { HashTagEntity } from "../types";

export const hashtag = (data: HashTagEntity): string =>
  link(`#${escapePart(data.text)}`, getTwitterHashUrl(data.text));
