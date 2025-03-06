import type { IsNumericLiteral } from "type-fest";
import type { IterableContainer } from "./internal/types/IterableContainer";
import { toReadonlyArray } from "./internal/toReadonlyArray";
import doTransduce from "./internal/doTransduce";
import { isArray } from "./isArray";

type FlatArray<
  T,
  Depth extends number,
  Iteration extends ReadonlyArray<unknown> = [],
> = Depth extends Iteration["length"]
  ? // Stopping condition for the recursion when the array is a tuple.
    T
  : T extends readonly []
    ? // Trivial result when the array is empty.
      []
    : T extends readonly [infer Item, ...infer Rest]
      ? // Tuples could be special-cased by "iterating" over each item
        // separately so that we maintain more information from the input type,
        // instead of putting all values in a union.
        [
          ...(Item extends IterableContainer
            ? // If the item itself is an array we continue going deeper
              FlatArray<Item, Depth, [...Iteration, unknown]>
            : // But if it isn't we add it to the output tuple
              [Item]),
          // And we merge this with the result from the rest of the tuple.
          ...FlatArray<Rest, Depth, Iteration>,
        ]
      : // For simple arrays we compute the item type, and wrap it with an
        // array.
        Array<FlatSimpleArrayItems<T, Depth, Iteration>>;

// This type is based on the built-in type for `Array.prototype.flat` from the
// ES2019 Array typescript library, but we improved it to handle any depth
// (avoiding the fixed `20` in the built-in type).
// @see https://github.com/microsoft/TypeScript/blob/main/src/lib/es2019.array.d.ts#L1-L5
type FlatSimpleArrayItems<
  T,
  Depth extends number,
  Iteration extends ReadonlyArray<unknown> = [],
  IsDone extends boolean = false,
> = {
  done: T;
  recur: T extends ReadonlyArray<infer InnerArr>
    ? FlatSimpleArrayItems<
        InnerArr,
        Depth,
        [...Iteration, unknown],
        // This trick allows us to continue 1 iteration more than the depth,
        // which is required to flatten the array up to depth.
        Iteration["length"] extends Depth ? true : false
      >
    : T;
}[IsDone extends true ? "done" : "recur"];

/**
 * Creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth. Equivalent to the built-in
 * `Array.prototype.flat` method.
 *
 * @param data - The items to flatten.
 * @param depth - The depth level specifying how deep a nested array structure
 * should be flattened. Defaults to 1. Non literal values (those typed as
 * `number`cannot be used. `Infinity`, `Number.POSITIVE_INFINITY` and
 * `Number.MAX_VALUE` are all typed as `number` and can't be used either. For
 * "unlimited" depth use a literal value that would exceed your expected
 * practical maximum nesting level.
 * @signature
 *   R.flat(data)
 *   R.flat(data, depth)
 * @example
 *   R.flat([[1, 2], [3, 4], [5], [[6]]]); // => [1, 2, 3, 4, 5, [6]]
 *   R.flat([[[1]], [[2]]], 2); // => [1, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function flat<T extends IterableContainer, Depth extends number = 1>(
  data: T,
  depth?: IsNumericLiteral<Depth> extends true ? Depth : never,
): FlatArray<T, Depth>;

/**
 * Creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth. Equivalent to the built-in
 * `Array.prototype.flat` method.
 *
 * @param depth - The depth level specifying how deep a nested array structure
 * should be flattened. Defaults to 1.
 * @signature
 *   R.flat()(data)
 *   R.flat(depth)(data)
 * @example
 *   R.pipe([[1, 2], [3, 4], [5], [[6]]], R.flat()); // => [1, 2, 3, 4, 5, [6]]
 *   R.pipe([[[1]], [[2]]], R.flat(2)); // => [1, 2]
 * @dataLast
 * @lazy
 * @category Array
 */
export function flat<Depth extends number = 1>(
  depth?: IsNumericLiteral<Depth> extends true ? Depth : never,
): <T extends IterableContainer>(data: T) => FlatArray<T, Depth>;

export function flat(
  dataOrDepth?: IterableContainer | number,
  depth?: number,
): unknown {
  return doTransduce(
    flatImplementation,
    lazyImplementation,
    [dataOrDepth, depth],
    typeof dataOrDepth === "object",
  );
}

const flatImplementation = (
  data: Iterable<unknown>,
  depth?: number,
): Array<unknown> => toReadonlyArray(data).flat(depth);

function* lazyImplementation(
  data: Iterable<unknown>,
  depth = 1,
): Iterable<unknown> {
  // Optimization for common case.
  if (depth === 1) {
    for (const value of data) {
      if (isArray(value)) {
        yield* value;
      } else {
        yield value;
      }
    }
    return;
  }

  if (depth <= 0) {
    yield* data;
    return;
  }

  for (const value of data) {
    if (isArray(value)) {
      yield* value.flat(depth - 1);
    } else {
      yield value;
    }
  }
}
