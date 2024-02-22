/**
 * Converts a path string to an array of keys.
 * @param path a string path
 * @signature R.stringToPathArray(path)
 * @example R.stringToPathArray('a.b[0].c') // => ['a', 'b', 0, 'c']
 * @dataFirst
 * @category String
 */
export function stringToPath<Path extends string>(
  path: Path
): StringToPath<Path> {
  return _stringToPath(path) as StringToPath<Path>;
}

function _stringToPath(path: string): Array<string> {
  if (path.length === 0) return [];

  const match =
    path.match(/^\[(.+?)\](.*)$/) ?? path.match(/^\.?([^.[\]]+)(.*)$/);
  if (match) {
    const [, key, rest] = match;
    // @ts-expect-error [ts2322] - Can we improve typing here to assure that `key` and `rest` are defined when the regex matches?
    return [key, ..._stringToPath(rest)];
  }
  return [path];
}

export type StringToPath<T extends string> = T extends ''
  ? []
  : T extends `[${infer Head}].${infer Tail}`
    ? [Head, ...StringToPath<Tail>]
    : T extends `.${infer Head}${infer Tail}`
      ? [Head, ...StringToPath<Tail>]
      : T extends `${infer Head}${infer Tail}`
        ? [Head, ...StringToPath<Tail>]
        : [T];
