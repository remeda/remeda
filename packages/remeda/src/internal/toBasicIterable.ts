import { memoizeIterable } from "./memoizeIterable";

/**
 * A helper funtion for unit tests that turns an array into a generic iterable.
 *
 * @throws If the the number of items requested exceeds `limit`.
 */
export function toBasicIterable<T>(
  iterable: Iterable<T>,
  itemLimit?: number,
  allowMultipleTraversal = false,
): Iterable<T> {
  if (allowMultipleTraversal) {
    iterable = memoizeIterable(iterable);
  }
  itemLimit ??= Infinity;

  let startCount = 0;
  let itemCount = 0;
  return {
    [Symbol.iterator]() {
      if (startCount++ > 0 && !allowMultipleTraversal) {
        throw new Error("Multiple traversal not allowed");
      }
      const iterator = iterable[Symbol.iterator]();
      return {
        next() {
          if (itemCount++ >= itemLimit) {
            throw new Error("Item limit exceeded");
          }
          const next = iterator.next();
          if (next.done === true) {
            return { done: true, value: undefined };
          }
          return { value: next.value };
        },
      };
    },
  };
}
