import { purry } from "./purry";

type Values<T extends object> = T extends ReadonlyArray<unknown> | []
  ? Array<T[number]>
  : Array<T[keyof T]>;

/**
 * Returns a new array containing the values of the array or object.
 *
 * @param data - Either an array or an object.
 * @signature
 *    R.values(source)
 * @example
 *    R.values(['x', 'y', 'z']) // => ['x', 'y', 'z']
 *    R.values({ a: 'x', b: 'y', c: 'z' }) // => ['x', 'y', 'z']
 *    R.pipe(['x', 'y', 'z'], R.values) // => ['x', 'y', 'z']
 *    R.pipe({ a: 'x', b: 'y', c: 'z' }, R.values) // => ['x', 'y', 'z']
 *    R.pipe(
 *      { a: 'x', b: 'y', c: 'z' },
 *      R.values,
 *      R.first,
 *    ) // => 'x'
 * @dataFirst
 * @pipeable
 * @category Object
 */
export function values<T extends object>(data: T): Values<T>;

/**
 * Returns a new array containing the values of the array or object.
 *
 * @param source - Either an array or an object.
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
 * @pipeable
 * @category Object
 */
// TODO: Add this back when we deprecate headless calls in V2 of Remeda. Currently the dataLast overload breaks the typing for the headless version of the function, which is used widely in the wild.
// export function values(): <T extends object>(data: T) => Values<T>;

export function values(): unknown {
  return purry(Object.values, arguments);
}
