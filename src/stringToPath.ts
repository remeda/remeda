const PATH_RE = /^(?:\.?(?<propName>[^.[\]]+)|\[(?<index>.+?)\])(?<rest>.*)$/u;

type StringToPath<T extends string> = T extends ""
  ? []
  : T extends `[${infer Head}].${infer Tail}`
    ? [Head, ...StringToPath<Tail>]
    : T extends `.${infer Head}${infer Tail}`
      ? [Head, ...StringToPath<Tail>]
      : T extends `${infer Head}${infer Tail}`
        ? [Head, ...StringToPath<Tail>]
        : [T];

/**
 * Converts a path string to an array of keys.
 *
 * @param path - A string path.
 * @signature R.stringToPathArray(path)
 * @example R.stringToPathArray('a.b[0].c') // => ['a', 'b', 0, 'c']
 * @dataFirst
 * @category String
 */
export function stringToPath<Path extends string>(
  path: Path,
): StringToPath<Path> {
  if (path.length === 0) {
    return [] as StringToPath<Path>;
  }

  const match = PATH_RE.exec(path);
  return (
    match === null
      ? [path]
      : [
          match.groups!["index"] ?? match.groups!["propName"]!,
          ...stringToPath(match.groups!["rest"]!),
        ]
  ) as StringToPath<Path>;
}
