import { escapePart, link } from "../markdown";
import { getTwitterUrl } from "../twitter";
import type { UserMentionEntity } from "../types";

export const mention = (data: UserMentionEntity): string =>
  link(
    `@${escapePart(data.screen_name)}`,
    getTwitterUrl(data.screen_name),
    data.name
  );
