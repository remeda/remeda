import type { EnumerableStringKeyedValueOf } from "./internal/types/EnumerableStringKeyedValueOf";
import type { IterableContainer } from "./internal/types/IterableContainer";
import { purry } from "./purry";

type Values<T extends object> = T extends IterableContainer
  ? T[number][]
  : EnumerableStringKeyedValueOf<T>[];

/**
 * Returns a new array containing the values of the array or object.
 *
 * @param data - Either an array or an object.
 * @signature
 *    values(source)
 * @example
 *    values(['x', 'y', 'z']) // => ['x', 'y', 'z']
 *    values({ a: 'x', b: 'y', c: 'z' }) // => ['x', 'y', 'z']
 * @dataFirst
 * @category Object
 */
export function values<T extends object>(data: T): Values<T>;

/**
 * Returns a new array containing the values of the array or object.
 *
 * @signature
 *    values()(source)
 * @example
 *    pipe(['x', 'y', 'z'], values()) // => ['x', 'y', 'z']
 *    pipe({ a: 'x', b: 'y', c: 'z' }, values()) // => ['x', 'y', 'z']
 *    pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      values(),
 *      first(),
 *    ) // => 'x'
 * @dataLast
 * @category Object
 */
export function values(): <T extends object>(data: T) => Values<T>;

export function values(...args: readonly unknown[]): unknown {
  return purry(Object.values, args);
}
