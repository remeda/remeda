import { IsNumericLiteral, IsStringLiteral } from "type-fest";

//#region src/stringToPath.d.ts
type StringToPath<S> = IsStringLiteral<S> extends true ? StringToPathImpl<S> : Array<string | number>;
type StringToPathImpl<S> = S extends `${infer Head}['${infer Quoted}']${infer Tail}` ? [...StringToPath<Head>, Quoted, ...StringToPath<Tail>] : S extends `${infer Head}["${infer DoubleQuoted}"]${infer Tail}` ? [...StringToPath<Head>, DoubleQuoted, ...StringToPath<Tail>] : S extends `${infer Head}[${infer Unquoted}]${infer Tail}` ? [...StringToPath<Head>, ...StringToPath<Unquoted>, ...StringToPath<Tail>] : S extends `${infer Head}.${infer Tail}` ? [...StringToPath<Head>, ...StringToPath<Tail>] : "" extends S ? [] : S extends `${infer N extends number}` ? [IsNumericLiteral<N> extends true ? N : S] : [S];
/**
 * A utility to allow JSONPath-like strings to be used in other utilities which
 * take an array of path segments as input (e.g. `prop`, `setPath`, etc...).
 * The main purpose of this utility is to act as a bridge between the runtime
 * implementation that converts the path to an array, and the type-system that
 * parses the path string **type** into an array **type**. This type allows us
 * to return fine-grained types and to enforce correctness at the type-level.
 *
 * We **discourage** using this utility for new code. This utility is for legacy
 * code that already contains path strings (which are accepted by Lodash). We
 * strongly recommend using *path arrays* instead as they provide better
 * developer experience via significantly faster type-checking, fine-grained
 * error messages, and automatic typeahead suggestions for each segment of the
 * path.
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
declare function stringToPath<const Path extends string>(path: Path): StringToPath<Path>;
//#endregion
export { stringToPath as t };
//# sourceMappingURL=stringToPath-B0nbcRt2.d.ts.map