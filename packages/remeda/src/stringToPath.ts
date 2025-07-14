import type { IsNumericLiteral, IsStringLiteral } from "type-fest";
import type { If } from "./internal/types/If";

// In the stringToPath implementation we consume the path from left to right,
// each time chopping off a candidate segment for addition to the path by
// matching against **one of** the following named groups:
// - `propName`: is used to parse dot-notation paths, e.g. foo.bar.baz, we allow
// multiple sequential dots because our type allows them, but they are
// semantically meaningless. Note that this would also allow strings starting
// with a dot, e.g. `.foo`, this is fine because the dot itself is just used as
// a separator and is ignored in the final path. Note that we limit the number
// of dots to some arbitrary large number (100); this is to avoid a concern that
// regular expression unbounded prefix matching can cause non-linear performance
// issues.
// - `quoted`, `doubleQuoted`: used within square bracket notation to prevent
// any recursive parsing of their contents. As for the type itself, we only
// allow quote symbols to appear immediately after the opening square bracket
// and immediately before the closing square bracket, this allows us to handle
// more gracefully cases where a quote symbol might appear within the quoted
// part.
// - `unquoted`: If the contents of the square brackets are not quoted they will
// match this group (this is way the order is important here!). Contents of this
// group get parsed recursively.
//
// Note that this Regular Expression is anchored to the start of the string, but
// not to the end, it is assumed that there will be more contents after the
// matched part; this content will be parsed recursively.
const PATH_PARTS_RE =
  /^(?:\.{0,100}(?<propName>[^.[\]]+)|\['(?<quoted>.*?)'\]|\["(?<doubleQuoted>.*?)"\]|\[(?<unquoted>.*?)\])/u;

// This is the most efficient way to check an arbitrary string if it is a simple
// non-negative integer. We use character ranges instead of the `\d` character
// class to avoid matching non-ascii digits (e.g. Arabic-Indic digits), while
// maintaining that the regular expression supports unicode.
const NON_NEGATIVE_INTEGER_RE = /^[1-9][0-9]*$/u;

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
 * **This utility helps bridge the gap for legacy code that already contains
 * these path strings (which are accepted by Lodash for similar utilities). We
 * strongly recommend using *path arrays* instead as they provide better
 * developer experience via significantly faster type-checking, fine-grained
 * error messages, and automatic typeahead suggestions for each segment of the
 * path**.
 *
 * *There are a bunch of limitations to this utility derived from the
 * limitations of the type itself, these are usually edge-cases around deeply
 * nested paths, escaping, whitespaces, and empty segments. This is true even
 * in cases where the runtime implementation can better handle them, this is
 * intentional. See the tests for this utility for more details and the
 * expected outputs*.
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
    groups: { propName, quoted, doubleQuoted, unquoted },
  } = match;

  return [
    ...(unquoted === undefined
      ? [
          propName === undefined
            ? // We either have quoted or doubleQuoted contents at this point,
              // they are semantically equivalent and just need to be added to
              // the path, as-is.
              (quoted ?? doubleQuoted!)
            : // simple property names are the only ones we need to further
              // check and parse their content, in order to handle array index
              // accessors correctly (by parsing them as numbers), but obviously
              // we only do this if they are an non-negative integer.
              NON_NEGATIVE_INTEGER_RE.test(propName)
              ? Number(propName)
              : propName,
        ]
      : // We have unquoted square bracket contents, we need to recursively
        // parse it and add it to the path.
        stringToPath(unquoted)),
    // Our regular expression only handles a single segment at a time, we need
    // to recursively parse the remainder of the path and append it to the
    // result.
    ...stringToPath(path.slice(match[0].length)),
  ];
}
