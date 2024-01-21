interface BaseEntity {
  indices: [number, number];
}

export interface HashTagEntity extends BaseEntity {
  text: string;
}

export interface UrlEntity extends BaseEntity {
  url: string;
  display_url: string;
  expanded_url: string;
}

export interface UserMentionEntity extends BaseEntity {
  name: string;
  screen_name: string;
}

export interface SymbolEntity extends BaseEntity {
  text: string;
}

export interface MediaEntity extends BaseEntity {
  url: string;
  display_url: string;
}

export type TweetEntity =
  | HashTagEntity
  | UrlEntity
  | UserMentionEntity
  | SymbolEntity
  | MediaEntity;

export interface Tweet {
  id:
    | number // unsafe
    | string; // new format
  id_str?: string;
  entities: {
    hashtags: HashTagEntity[];
    urls: UrlEntity[];
    user_mentions: UserMentionEntity[];
    symbols: SymbolEntity[];
    media: MediaEntity[];
  };
  text: string;
  truncated?: boolean;
  extended_tweet?: ExtendedTweet;
  quoted_status?: Tweet;
}

export type TweetEntityType = keyof Tweet["entities"];

export interface ExtendedTweet {
  full_text: string;
}
