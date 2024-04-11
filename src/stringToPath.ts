type StringToPath<T extends string> = string extends T
  ? Array<string>
  : T extends ""
    ? []
    : T extends `${infer Head}[${infer Nest}].${infer Tail}`
      ? [...StringToPath<Head>, Nest, ...StringToPath<Tail>]
      : T extends `${infer Head}[${infer Nest}]`
        ? [...StringToPath<Head>, Nest]
        : T extends `${infer Head}.${infer Tail}`
          ? [...StringToPath<Head>, ...StringToPath<Tail>]
          : [T];

/**
 * Converts a path string to an array of string keys (including array index access keys).
 *
 * @param path - A string path.
 * @signature R.stringToPathArray(path)
 * @example R.stringToPathArray('a.b[0].c') // => ['a', 'b', '0', 'c']
 * @dataFirst
 * @category String
 */
export function stringToPath<Path extends string>(
  path: Path,
): StringToPath<Path> {
  return _stringToPath(path) as StringToPath<Path>;
}

function _stringToPath(path: string): Array<string> {
  if (path.length === 0) {
    return [];
  }

  const match =
    // eslint-disable-next-line prefer-named-capture-group
    /^\[(.+?)\](.*)$/u.exec(path) ?? /^\.?([^.[\]]+)(.*)$/u.exec(path);
  if (match !== null) {
    const [, key, rest] = match;
    // @ts-expect-error [ts2322] - Can we improve typing here to assure that `key` and `rest` are defined when the regex matches?
    return [key, ..._stringToPath(rest)];
  }
  return [path];
}
