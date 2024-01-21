import { escapePart, link } from "../markdown";
import { getTwitterHashUrl } from "../twitter";
import type { SymbolEntity } from "../types";

export const symbol = (data: SymbolEntity): string =>
  link(`$${escapePart(data.text)}`, getTwitterHashUrl(data.text, "ctag"));
