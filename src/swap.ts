import { purry } from './purry';
import { isString } from './isString';
import { isArray } from './isArray';
import { IterableContainer } from './_types';
import { Joined } from './join';

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
  ...TupleOfLength<B>
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
  T extends ReadonlyArray<unknown> = []
> = T['length'] extends L ? T : TupleOfLength<L, [...T, unknown]>;

type IsNonNegativeInteger<T extends number> = number extends T
  ? false
  : `${T}` extends `-${string}`
  ? false
  : true;

type Absolute<T extends number> = `${T}` extends `-${infer R}`
  ? R extends `${infer N extends number}`
    ? N
    : never
  : T;

type CharactersTuple<T extends string> = string extends T
  ? Array<string>
  : T extends `${infer C}${infer R}`
  ? [C, ...CharactersTuple<R>]
  : [];

type ObjectSwap<T, K1 extends keyof T, K2 extends keyof T> = {
  [K in keyof T]: T[K1 extends K ? K2 : K2 extends K ? K1 : K];
};

type SwapArrayInternal<
  T extends IterableContainer,
  Index1 extends number,
  Index2 extends number,
  Position extends IterableContainer = [],
  Original extends ReadonlyArray<unknown> = T
> = number extends Index1
  ? T
  : number extends Index2
  ? T
  : T extends readonly [infer AtPosition, ...infer Rest]
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
      >
    ]
  : T;

type SafeNegativeIndex<
  T extends IterableContainer,
  Index extends number
> = Difference<T['length'], Absolute<Index>>;

type SafePositiveIndex<
  T extends IterableContainer,
  Index extends number
> = isLessThan<Index, T['length']> extends true ? Index : never;

type SafeIndex<
  T extends IterableContainer,
  Index extends number
> = IsNonNegativeInteger<Index> extends true
  ? SafePositiveIndex<T, Index>
  : SafeNegativeIndex<T, Index>;

type SwapString<T extends string, K1, K2> = Joined<
  SwapArray<CharactersTuple<T>, K1, K2>,
  ''
>;

type SwapArray<T extends ReadonlyArray<unknown>, K1, K2> = K1 extends number
  ? number extends K1
    ? ReadonlyArray<T[number]>
    : SafeIndex<T, K1> extends never
    ? T
    : K2 extends number
    ? number extends K2
      ? ReadonlyArray<T[number]>
      : SafeIndex<T, K2> extends never
      ? T
      : SwapArrayInternal<T, SafeIndex<T, K1>, SafeIndex<T, K2>>
    : T
  : T;

type Swap<
  T extends ReadonlyArray<unknown> | string,
  K1 extends number,
  K2 extends number
> = T extends string
  ? string extends T
    ? string
    : SwapString<T, K1, K2>
  : T extends IterableContainer
  ? SwapArray<T, K1, K2>
  : never;

/**
 * Swaps the positions of two elements in a list, string or an object based on the provided keys.
 * For strings, the keys represent the index positions of the characters to be swapped.
 * For objects, the keys represent the property keys of the properties to be swapped.
 *
 * @param data the item to be manipulated. This can be an array, or a string.
 * @param key1 the first index
 * @param key2 the second index
 *
 * @signature
 *   swap(key1, key2)(data)
 *
 * @example
 *   swap(['a', 'b', 'c'], 0, 1) // => ['b', 'a', 'c']
 *   swap('abc', 0, 1) // => 'bac'
 *
 * @category Array
 *
 * @returns Returns the manipulated array or string.
 *
 * @data_first
 */
export function swap<
  T extends ReadonlyArray<unknown> | string,
  K1 extends keyof T & number,
  K2 extends keyof T & number
>(data: T, key1: K1, key2: K2): Swap<T, K1, K2>;
/**
 * @param data the object to be manipulated
 * @param key1 the first property key
 * @param key2 the second property key
 *
 * @signature
 *   swap(key1, key2)(data)
 *
 * @returns Returns the manipulated object.
 *
 * @example
 *   swap({a: 1, b: 2, c: 3}, 'a', 'b') // => {a: 2, b: 1, c: 3}
 */
export function swap<T extends object, K1 extends keyof T, K2 extends keyof T>(
  data: T,
  key1: K1,
  key2: K2
): ObjectSwap<T, K1, K2>;

/**
 * @param key1 the first index
 * @param key2 the second index
 *
 * @signature
 *   swap(key1, key2)(data)
 *
 * @example
 *   swap(0, 1)(['a', 'b', 'c']) // => ['b', 'a', 'c']
 *   swap(0, -1)('abc') // => 'cba'
 *
 * @category Array
 * @returns Returns the manipulated array or string.
 * @data_last
 */
export function swap<K1 extends number, K2 extends number>(
  key1: K1,
  key2: K2
): <T extends ReadonlyArray<unknown> | string>(data: T) => Swap<T, K1, K2>;

/**
 * Swaps the positions of two properties in an object based on the provided keys.
 * @param key1 the first property key
 * @param key2 the second property key
 *
 * @signature
 *   swap(key1, key2)(data)
 *
 * @example
 *   swap('a', 'b')({a: 1, b: 2, c: 3}) // => {a: 2, b: 1, c: 3}
 *
 * @returns Returns the manipulated object.
 */
export function swap<K1 extends PropertyKey, K2 extends PropertyKey>(
  key1: K1,
  key2: K2
): <T extends { [P in K1 | K2]: any }>(data: T) => ObjectSwap<T, K1, K2>;

/**
 * Swaps the positions of two elements in a list, string, or object based on the provided keys.
 *
 * @returns A curried function that expects the item to be manipulated.
 */
export function swap() {
  return purry(_swap, arguments);
}

function _swap(item: any, key1: any, key2: any): any {
  if (isArray(item)) {
    return _swapArray(item, key1, key2);
  } else if (isString(item)) {
    return _swapString(item, key1, key2);
  } else {
    return _swapObject(item, key1, key2);
  }
}

function _swapArray<T>(
  item: ReadonlyArray<T>,
  index1: number,
  index2: number
): Array<T> {
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

function _swapString<T extends string>(
  item: T,
  key1: number,
  key2: number
): string {
  const result = _swapArray(item.split(''), key1, key2);
  return result.join('');
}

function _swapObject(
  obj: { [K in PropertyKey]: any },
  key1: PropertyKey,
  key2: PropertyKey
): { [K in PropertyKey]: any } {
  const { [key1]: value1, [key2]: value2 } = obj;
  return {
    ...obj,
    [key1]: value2,
    [key2]: value1,
  };
}
