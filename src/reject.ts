type RejectFN<T> = (input: T) => boolean;

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param items The array to reject.
 * @param fn the callback function.
 * @example
 *    R.reject([1, 2, 3], x => x % 2 === 1) // => [2]
 * @data_first
 */
export function reject<T, K>(items: T[], fn: (input: T) => K): K[];

/**
 * Reject the elements of an array that meet the condition specified in a callback function.
 * @param items The array to reject.
 * @example
 *    R.reject(x => x % 2 === 1)([1, 2, 3]) // => [2]
 * @data_last
 */
export function reject<T, K>(fn: (input: T) => K): (items: T[]) => K[];

export function reject<T>(
  arg1: T[] | RejectFN<T>,
  arg2?: T[] | RejectFN<T>
): T[] | ((items: T[]) => T[]) {
  if (arguments.length === 1) {
    return (items: T[]) => _reject(items, arg1 as RejectFN<T>);
  }
  return _reject(arg1 as T[], arg2 as RejectFN<T>);
}

function _reject<T>(items: T[], fn: (input: T) => boolean) {
  return items.filter(item => !fn(item));
}
