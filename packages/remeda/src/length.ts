import { purry1 } from "./internal/purryByArity";

type Enumerable<T> = ArrayLike<T> | Iterable<T>;

/**
 * Counts values of the collection or iterable.
 *
 * @param data - The input data.
 * @signature
 *    length(data)
 * @example
 *    length([1, 2, 3]) // => 3
 * @dataFirst
 * @category Array
 */
export function length<T>(data: Enumerable<T>): number;

/**
 * Counts values of the collection or iterable.
 *
 * @signature
 *    length()(data)
 * @example
 *    pipe([1, 2, 3], length()) // => 3
 * @dataLast
 * @category Array
 */
export function length<T>(): (data: Enumerable<T>) => number;

export function length(data?: Enumerable<unknown>): unknown {
  return purry1(lengthImplementation, arguments.length, data);
}

const lengthImplementation = <T>(data: Enumerable<T>): number =>
  "length" in data ? data.length : [...data].length;
