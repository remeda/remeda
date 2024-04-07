import { lazyDataLastImpl } from "./_lazyDataLastImpl";
import type { IterableContainer } from "./_types";
import type { LazyEvaluator } from "./pipe";

// This is obvious and not likely to change, but it makes reading the code a
// little easier as the constant has a name.
const DEFAULT_DEPTH = 1;

// Copied from the TypeScript's typing for ES2019 Array lib. @see https://github.com/microsoft/TypeScript/blob/main/src/lib/es2019.array.d.ts#L1-L5
type FlatArray<T, Depth extends number> = {
  done: T;
  recur: T extends ReadonlyArray<infer InnerArr>
    ? FlatArray<
        InnerArr,
        [
          -1,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
        ][Depth]
      >
    : T;
}[Depth extends -1 ? "done" : "recur"];

/**
 * Creates a new array with all sub-array elements concatenated into it
 * recursively up to the specified depth. Equivalent to the built-in
 * `Array.prototype.flat` method.
 *
 * @param data - The items to flatten.
 * @param depth - The depth level specifying how deep a nested array structure
 * should be flattened. Defaults to 1.
 * @signature
 *   R.flat(data)
 *   R.flat(data, depth)
 * @example
 *   R.flat([[1, 2], [3, 4], [5], [[6]]]); // => [1, 2, 3, 4, 5, [6]]
 *   R.flat([[[1]], [[2]]], 2); // => [1, 2]
 * @dataFirst
 * @category Array
 */
export function flat<
  T extends IterableContainer,
  D extends number = typeof DEFAULT_DEPTH,
>(data: T, depth?: D): Array<FlatArray<T, D>>;

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
 * @category Array
 */
export function flat<D extends number = typeof DEFAULT_DEPTH>(
  depth?: D,
): <T extends IterableContainer>(data: T) => Array<FlatArray<T, D>>;

export function flat(
  dataOrDepth: IterableContainer | number,
  depth?: number,
): unknown {
  if (typeof dataOrDepth === "object") {
    // TODO: Use the built-in `Array.prototype.flat` in V2.
    return flatImplementation(dataOrDepth, depth);
  }

  return lazyDataLastImpl(flatImplementation, arguments, lazyImplementation);
}

const lazyImplementation = (depth = DEFAULT_DEPTH): LazyEvaluator =>
  depth <= 0
    ? lazyIdentity
    : (value) =>
        Array.isArray(value)
          ? {
              next: flatImplementation(value, depth - 1),
              hasNext: true,
              hasMany: true,
              done: false,
            }
          : { next: value, hasNext: true, done: false };

// This function is pulled out so that we don't generate a new arrow function
// each time. It acts as a lazy identity function by wrapping the value with a
// lazy object.
const lazyIdentity = <T>(value: T) =>
  ({ next: value, hasNext: true, done: false }) as const;

function flatImplementation(
  data: IterableContainer,
  depth = DEFAULT_DEPTH,
): IterableContainer {
  if (depth <= 0) {
    return data;
  }

  const output: Array<unknown> = [];

  for (const item of data) {
    if (Array.isArray(item)) {
      output.push(...flatImplementation(item, depth - 1));
    } else {
      output.push(item);
    }
  }

  return output;
}
