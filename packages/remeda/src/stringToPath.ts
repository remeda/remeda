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
  // We start by checking the 2 quoted variants of the square bracket access
  // syntax. We do this in a single check and not in a subsequent check that
  // would only extract the quoted part so that we can catch cases where the
  // quoted part itself contains square brackets. This allows TypeScript to be
  // "greedy" about what it infers into Quoted and DoubleQuoted.
  S extends `${infer Head}['${infer Quoted}']${infer Tail}`
    ? [...StringToPath<Head>, Quoted, ...StringToPath<Tail>]
    : S extends `${infer Head}["${infer DoubleQuoted}"]${infer Tail}`
      ? [...StringToPath<Head>, DoubleQuoted, ...StringToPath<Tail>]
      : // If we have an unquoted property access we also need to run the
        // contents recursively too (unlike the quoted variants above).
        S extends `${infer Head}[${infer Unquoted}]${infer Tail}`
        ? [
            ...StringToPath<Head>,
            ...StringToPath<Unquoted>,
            ...StringToPath<Tail>,
          ]
        : // Finally, we process any dots one after the other from left to
          // right. TypeScript will be non-greedy here, putting *everything*
          // after the first dot into the Tail.
          S extends `${infer Head}.${infer Tail}`
          ? [...StringToPath<Head>, ...StringToPath<Tail>]
          : // Finally we need to handle the few cases of simple literals.
            "" extends S
            ? // There are some edge-cases where Lodash will try to access an
              // empty property, but those seem nonsensical in practice so we
              // prefer just skipping these cases.
              []
            : // We differ from Lodash in the way we handle numbers. Lodash
              // returns everything in the path as a string, and relies on JS to
              // coerce array accessors to numbers (or the other way around in
              // practice, e.g., `myArray[123] === `myArray[123]`), but from a
              // typing perspective the two are not the same and we need the
              // path to be accurate about it.
              S extends `${infer N extends number}`
              ? [
                  If<
                    // TypeScript considers " 123 " to still extend `${number}`,
                    // but would type is as `string` instead of a literal. We
                    // can use that fact to make sure we only consider simple
                    // number literals as numbers, and take the rest as strings.
                    IsNumericLiteral<N>,
                    N,
                    S
                  >,
                ]
              : // This simplest form of a path is just a single string literal.
                [S];

/**
 * A utility to allow JSONPath-like strings to be used in other utilities which
 * take an array of path segments as input (e.g. `pathOr`, `setPath`, etc...).
 * The main purpose of this utility is to act as a bridge between the runtime
 * implementation that converts the path to an array, and the type-system that
 * parses the path string **type** into an array **type**. This type allows us
 * to return fine-grained types and to enforce correctness at the type-level.
 *
 * This utility helps bridge the gap for legacy code that already contains these
 * path strings (which are accepted by Lodash for similar utilities). We
 * strongly recommend using array paths instead as they can provide a better
 * developer experience via fine-grained error messages and automatic typeahead
 * suggestions for each segment of the path.
 *
 * **There are a bunch of limitations to this utility derived from the
 * limitations of the type itself, these are usually edge-cases around deeply
 * nested paths, escaping, whitespaces, and empty segments. This is true even
 * in cases where the runtime implementation can better handle them, this is
 * intentional. See the tests for this utility for more details and the
 * expected outputs**.
 *
 * @param path - A string path.
 * @signature
 *   R.stringToPath(path)
 * @example
 *   R.stringToPath('a.b[0].c') // => ['a', 'b', 0, 'c']
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
