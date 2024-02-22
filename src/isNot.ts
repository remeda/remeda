/**
 * A function that takes a guard function as predicate and returns a guard that negates it
 * @param predicate the guard function to negate
 * @signature
 *    R.isNot(R.isTruthy)(data)
 * @returns function A guard function
 * @example
 *    R.isNot(R.isTruthy)(false) //=> true
 *    R.isNot(R.isTruthy)(true) //=> false
 * @dataLast
 * @category Guard
 */
export function isNot<T, S extends T>(
  predicate: (data: T) => data is S
): (data: T) => data is Exclude<T, S>;
export function isNot<T>(predicate: (data: T) => boolean): (data: T) => boolean;

export function isNot<T>(predicate: (data: T) => boolean) {
  return (data: T) => {
    return !predicate(data);
  };
}
