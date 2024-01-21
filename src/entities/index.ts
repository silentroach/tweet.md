import type {
  HashTagEntity,
  MediaEntity,
  SymbolEntity,
  TweetEntity,
  TweetEntityType,
  UrlEntity,
  UserMentionEntity,
} from "../types";
import { hashtag } from "./hashtag";
import { media } from "./media";
import { mention } from "./mention";
import { symbol } from "./symbol";
import { url } from "./url";

function entity(type: "urls", data: UrlEntity): string | undefined;
function entity(
  type: "user_mentions",
  data: UserMentionEntity,
): string | undefined;
function entity(type: "media", data: MediaEntity): string | undefined;
function entity(type: "hashtags", data: HashTagEntity): string | undefined;
function entity(type: "symbols", data: SymbolEntity): string | undefined;
function entity(type: TweetEntityType, data: TweetEntity): string | undefined {
  switch (type) {
    case "urls":
      return url(data as UrlEntity);
    case "user_mentions":
      return mention(data as UserMentionEntity);
    case "media":
      return media(data as MediaEntity);
    case "hashtags":
      return hashtag(data as HashTagEntity);
    case "symbols":
      return symbol(data as SymbolEntity);
    default:
      return;
  }
}

export { entity };
