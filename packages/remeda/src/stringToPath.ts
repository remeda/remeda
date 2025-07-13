import type { IsNumericLiteral, IsStringLiteral } from "type-fest";
import type { If } from "./internal/types/If";

const PATH_PARTS_RE =
  /^(?:\.*(?<propName>[^.[\]]+)|\['(?<quoted>.*?)'\]|\["(?<doubleQuoted>.*?)"\]|\[(?<unquoted>.*?)\])(?<rest>.*)$/u;

const NON_NEGATIVE_INTEGER_RE = /^[0-9]+$/u;

type StringToPath<S> = If<
  // We can only compute the path type for literals that TypeScript can
  // break down further into parts.
  IsStringLiteral<S>,
  StringToPathImpl<S>,
  Array<string | number>
>;

type StringToPathImpl<S> =
  S extends `${infer Head}['${infer Quoted}']${infer Tail}`
    ? [...StringToPath<Head>, Quoted, ...StringToPath<Tail>]
    : S extends `${infer Head}["${infer DoubleQuoted}"]${infer Tail}`
      ? [...StringToPath<Head>, DoubleQuoted, ...StringToPath<Tail>]
      : S extends `${infer Head}[${infer Unquoted}]${infer Tail}`
        ? [
            ...StringToPath<Head>,
            ...StringToPath<Unquoted>,
            ...StringToPath<Tail>,
          ]
        : S extends `${infer Head}.${infer Tail}`
          ? [...StringToPath<Head>, ...StringToPath<Tail>]
          : "" extends S
            ? []
            : S extends `${infer N extends number}`
              ? [If<IsNumericLiteral<N>, N, S>]
              : [S];

/**
 * Converts a path string to an array of string keys (including array index
 * access keys).
 *
 * ! IMPORTANT: Attempting to pass a simple `string` type will result in the
 * result being inferred as `never`. This is intentional to help with type-
 * safety as this function is primarily intended to help with other "object path
 * access" functions like `pathOr` or `setPath`.
 *
 * @param path - A string path.
 * @signature R.stringToPath(path)
 * @example
 *   R.stringToPath('a.b[0].c') // => ['a', 'b', '0', 'c']
 * @dataFirst
 * @category Utility
 */
export function stringToPath<const Path extends string>(
  path: Path,
): StringToPath<Path> {
  if (path === "") {
    return [];
  }

  const match = PATH_PARTS_RE.exec(path);
  if (match?.groups === undefined) {
    return [path];
  }
  const {
    groups: { propName, quoted, doubleQuoted, unquoted, rest },
  } = match;

  if (quoted !== undefined || doubleQuoted !== undefined) {
    // @ts-expect-error [ts2322] -- This is OK, TypeScript can't infer this
    // automatically.
    return [quoted ?? doubleQuoted, ...stringToPath(rest!)];
  }

  if (unquoted !== undefined) {
    return [...stringToPath(unquoted), ...stringToPath(rest!)];
  }

  // @ts-expect-error [ts2322] -- This is OK, TypeScript can't infer this
  // automatically.
  return [
    NON_NEGATIVE_INTEGER_RE.test(propName!) ? Number(propName) : propName,
    ...stringToPath(rest!),
  ];
}
