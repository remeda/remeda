/**
 * Converts a path string to an array of keys.
 * @param path a string path
 * @signature R.stringToPathArray(path)
 * @example R.stringToPathArray('a.b[0].c') // => ['a', 'b', 0, 'c']
 * @data_first
 * @category String
 */
export function stringToPath<Path extends string>(
  path: Path
): StringToPath<Path> {
  return _stringToPath(path) as any;
}

function _stringToPath(path: string): string[] {
  if (path.length === 0) return [];

  let match =
    path.match(/^\[(.+?)\](.*)$/) || path.match(/^\.?([^\.\[\]]+)(.*)$/);
  if (match) {
    const [_, key, rest] = match;
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
