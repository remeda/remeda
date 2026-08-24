type Predicate<T> = (data: T) => boolean;

/**
 * A function that takes a guard function as predicate and returns a guard that negates it.
 *
 * @param predicate - The guard function to negate.
 * @returns Function A guard function.
 * @signature
 *    isNot(isTruthy)(data)
 * @example
 *    isNot(isTruthy)(false) //=> true
 *    isNot(isTruthy)(true) //=> false
 * @dataLast
 * @category Guard
 */
export function isNot<T, Narrow extends T>(
  predicate: (data: T) => data is Narrow,
): <Wide extends T>(data: Wide) => data is Exclude<Wide, Narrow>;

export function isNot<T>(predicate: Predicate<T>): Predicate<T>;

export function isNot<T>(predicate: Predicate<T>): Predicate<T> {
  return (data) => !predicate(data);
}
