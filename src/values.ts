import type {
  EnumerableStringKeyedValueOf,
  IterableContainer,
} from "./internal/types";
import { purry } from "./purry";

export type Values<T extends object> = T extends IterableContainer
  ? Array<T[number]>
  : Array<EnumerableStringKeyedValueOf<T>>;

/**
 * Returns a new array containing the values of the array or object.
 *
 * @param data - Either an array or an object.
 * @signature
 *    R.values(source)
 * @example
 *    R.values(['x', 'y', 'z']) // => ['x', 'y', 'z']
 *    R.values({ a: 'x', b: 'y', c: 'z' }) // => ['x', 'y', 'z']
 * @dataFirst
 * @category Object
 */
export function values<T extends object>(data: T): Values<T>;

/**
 * Returns a new array containing the values of the array or object.
 *
 * @signature
 *    R.values()(source)
 * @example
 *    R.pipe(['x', 'y', 'z'], R.values()) // => ['x', 'y', 'z']
 *    R.pipe({ a: 'x', b: 'y', c: 'z' }, R.values()) // => ['x', 'y', 'z']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.values(),
 *      R.first(),
 *    ) // => 'x'
 * @dataLast
 * @category Object
 */
export function values(): <T extends object>(data: T) => Values<T>;

export function values(...args: ReadonlyArray<unknown>): unknown {
  return purry(Object.values, args);
}
