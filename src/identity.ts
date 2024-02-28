import { purry } from './purry';

/**
 * A function that always returns the param passed to it
 * @param data The data to return
 * @returns The data passed to the function
 * @signature
 *    R.identity(data)
 * @example
 *    R.identity('foo') // => 'foo'
 * @category Function
 * @dataFirst
 */
export function identity<T>(data: T): T;

/**
 * A function that always returns the param passed to it
 * @param data The data to return
 * @returns The data passed to the function
 * @signature
 *    R.identity()(data)
 * @example
 *    R.map([1,2,3], R.identity()) // => [1,2,3]
 * @category Function
 * @dataLast
 */
export function identity(): <T>(data: T) => T;

export function identity() {
  return purry(identityImplementation, arguments);
}

function identityImplementation<T>(data: T): T {
  return data;
}
