import { ReadonlyTuple } from './_types';
import { purry } from './purry';

type ArrayMinN<T, N extends number> = number extends N
  ? // We can only compute the type for a literal number!
    Array<T>
  : // I don't know why we need to special-case the 0 case, but otherwise
    // typescript complains we have a deep recursion.
    N extends 0
    ? Array<T>
    : [...ReadonlyTuple<T, N>, ...Array<T>];

/**
 * Checks if the given array has at least the defined number of elements, and
 * refines the output type accordingly so that those indices are defined when
 * accessing the array even when using typescript's 'noUncheckedIndexAccess'.
 *
 * @param data the input array
 * @param minimum the minimum number of elements the array must have
 * @return true if the array's length is *at least* `minimum`.
 * @signature
 *   R.hasAtLeast(data, minimum)
 * @example
 *   R.hasAtLeast([], 4); // => false
 *
 *   const data: number[] = [1,2,3,4];
 *   R.hasAtLeast(data, 1); // => true
 *   data[0]; // 1, with type `number`
 * @dataFirst
 * @category Array
 */
export function hasAtLeast<T, N extends number>(
  data: ReadonlyArray<T>,
  minimum: N
): data is ArrayMinN<T, N>;

/**
 * Checks if the given array has at least the defined number of elements, and
 * refines the output type accordingly so that those indices are defined when
 * accessing the array even when using typescript's 'noUncheckedIndexAccess'.
 *
 * @param data the input array
 * @param minimum the minimum number of elements the array must have
 * @return true if the array's length is *at least* `minimum`.
 * @signature
 *   R.hasAtLeast(minimum)(data)
 * @example
 *   R.pipe([], R.hasAtLeast(4)); // => false
 *
 *   const data = [[1,2], [3], [4,5]];
 *   R.pipe(
 *     data,
 *     R.filter(R.hasAtLeast(2)),
 *     R.map(([, second]) => second),
 *   ); // => [2,5], with type `number[]`
 * @dataLast
 * @category Array
 */
export function hasAtLeast<N extends number>(
  minimum: N
): <T>(data: ReadonlyArray<T>) => data is ArrayMinN<T, N>;

export function hasAtLeast(...args: ReadonlyArray<unknown>): unknown {
  return purry(hasAtLeastImplementation, args);
}

const hasAtLeastImplementation = <T, N extends number>(
  data: ReadonlyArray<T>,
  minimum: N
): data is ArrayMinN<T, N> => data.length >= minimum;
