import type { IterableContainer } from './_types';
import type { Joined } from './join';
import { purry } from './purry';

/**
 * @link https://github.com/sindresorhus/type-fest/blob/main/source/is-equal.d.ts
 */
type isEqual<A, B> = (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B
  ? 1
  : 2
  ? true
  : false;

type Difference<A extends number, B extends number> = TupleOfLength<A> extends [
  ...infer U,
  ...TupleOfLength<B>,
]
  ? U['length']
  : never;

type isLessThan<A extends number, B extends number> = isEqual<A, B> extends true
  ? false
  : 0 extends A
  ? true
  : 0 extends B
  ? false
  : isLessThan<Difference<A, 1>, Difference<B, 1>>;

type TupleOfLength<
  L extends number,
  T extends IterableContainer = [],
> = T['length'] extends L ? T : TupleOfLength<L, [...T, unknown]>;

type IsNonNegative<T extends number> = number extends T
  ? false
  : `${T}` extends `-${string}`
  ? false
  : true;

type CharactersTuple<T extends string> = string extends T
  ? Array<string>
  : T extends `${infer C}${infer R}`
  ? [C, ...CharactersTuple<R>]
  : [];

type SwapArrayInternal<
  T extends IterableContainer,
  Index1 extends number,
  Index2 extends number,
  Position extends ReadonlyArray<unknown> = [],
  Original extends IterableContainer = T,
> = T extends readonly [infer AtPosition, ...infer Rest]
  ? [
      Position['length'] extends Index1
        ? Original[Index2]
        : Position['length'] extends Index2
        ? Original[Index1]
        : AtPosition,
      ...SwapArrayInternal<
        Rest,
        Index1,
        Index2,
        [unknown, ...Position],
        Original
      >,
    ]
  : T;

type SwapString<
  T extends string,
  K1 extends number,
  K2 extends number,
> = Joined<SwapArray<CharactersTuple<T>, K1, K2>, ''>;

type SwapArray<
  T extends IterableContainer,
  K1 extends number,
  K2 extends number,
> =
  // TODO [typescript@>4.6]: Because of limitations on the typescript version
  // used in Remeda we can't build a proper Absolute number type so we can't
  // implement proper typing for negative indices and have to opt for a less-
  // strict type instead.
  // Check out the history for the PR that introduced this TODO to see how it
  // could be implemented.
  IsNonNegative<K1> extends false
    ? Array<T[number]>
    : IsNonNegative<K2> extends false
    ? Array<T[number]>
    : // If the indices are not within the input arrays range the result would be
    // trivially the same as the input array.
    isLessThan<K1, T['length']> extends false
    ? T
    : isLessThan<K2, T['length']> extends false
    ? T
    : SwapArrayInternal<T, K1, K2>;

type SwappedIndices<
  T extends IterableContainer | string,
  K1 extends number,
  K2 extends number,
> = T extends string
  ? SwapString<T, K1, K2>
  : T extends IterableContainer
  ? SwapArray<T, K1, K2>
  : never;

/**
 * Swaps the positions of two elements in an array or string at the provided indices.
 *
 * Negative indices are supported and would be treated as an offset from the end of the array. The resulting type thought would be less strict than when using positive indices.
 *
 * If either index is out of bounds the result would be a shallow copy of the input, as-is.
 *
 * @param data the item to be manipulated. This can be an array, or a string.
 * @param index1 the first index
 * @param index2 the second index
 *
 * @signature
 *   swapIndices(data, index1, index2)
 *
 * @example
 *   swapIndices(['a', 'b', 'c'], 0, 1) // => ['b', 'a', 'c']
 *   swapIndices(['a', 'b', 'c'], 1, -1) // => ['c', 'b', 'a']
 *   swapIndices('abc', 0, 1) // => 'bac'
 *
 * @category Array
 *
 * @returns Returns the manipulated array or string.
 *
 * @dataFirst
 */
export function swapIndices<
  T extends IterableContainer | string,
  K1 extends number,
  K2 extends number,
>(data: T, index1: K1, index2: K2): SwappedIndices<T, K1, K2>;

/**
 * @param index1 the first index
 * @param index2 the second index
 *
 * @signature
 *   swapIndices(index1, index2)(data)
 *
 * @example
 *   swapIndices(0, 1)(['a', 'b', 'c']) // => ['b', 'a', 'c']
 *   swapIndices(0, -1)('abc') // => 'cba'
 *
 * @category Array
 * @returns Returns the manipulated array or string.
 * @dataLast
 */
export function swapIndices<K1 extends number, K2 extends number>(
  index1: K1,
  index2: K2
): <T extends IterableContainer | string>(data: T) => SwappedIndices<T, K1, K2>;

export function swapIndices() {
  return purry(_swapIndices, arguments);
}

function _swapIndices(
  item: IterableContainer | string,
  index1: number,
  index2: number
): unknown {
  return typeof item === 'string'
    ? _swapString(item, index1, index2)
    : _swapArray(item, index1, index2);
}

function _swapArray(
  item: ReadonlyArray<unknown>,
  index1: number,
  index2: number
): Array<unknown> {
  const result = item.slice();

  if (isNaN(index1) || isNaN(index2)) {
    return result;
  }

  const positiveIndexA = index1 < 0 ? item.length + index1 : index1;
  const positiveIndexB = index2 < 0 ? item.length + index2 : index2;

  if (positiveIndexA < 0 || positiveIndexA > item.length) {
    return result;
  }

  if (positiveIndexB < 0 || positiveIndexB > item.length) {
    return result;
  }

  result[positiveIndexA] = item[positiveIndexB];
  result[positiveIndexB] = item[positiveIndexA];

  return result;
}

function _swapString(item: string, index1: number, index2: number): string {
  const result = _swapArray(item.split(''), index1, index2);
  return result.join('');
}
