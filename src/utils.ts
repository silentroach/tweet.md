type ObjectEntry<T> = {
  [K in Exclude<keyof T, undefined>]: [K, T[K]];
}[Exclude<keyof T, undefined>];

export const objectEntries = Object.entries as <T>(
  o: T,
) => Array<ObjectEntry<T>>;

export const unicodeSlice = (
  string: string,
  start: number,
  end = string.length,
): string => {
  if (start === end) {
    return "";
  }

  return Array.from(string).slice(start, end).join("");
};
