import { purry } from './purry';
import { isString } from './isString';
import { isArray } from './isArray';
import { clone } from './clone';

type ParseInt<T> = T extends `${infer N extends number}` ? N : never;

type Length<T extends ReadonlyArray<any>> = T extends { length: infer L }
  ? L
  : never;

type EQ<A, B> = A extends B ? (B extends A ? true : false) : false;

type AtTerminus<A extends number, B extends number> = A extends 0
  ? true
  : B extends 0
  ? true
  : false;

type LT<A extends number, B extends number> = AtTerminus<A, B> extends true
  ? EQ<A, B> extends true
    ? false
    : A extends 0
    ? true
    : false
  : LT<Subtract<A, 1>, Subtract<B, 1>>;

type BuildTuple<
  L extends number,
  T extends ReadonlyArray<any> = []
> = T extends {
  length: L;
}
  ? T
  : BuildTuple<L, [...T, any]>;

type Subtract<A extends number, B extends number> = BuildTuple<A> extends [
  ...infer U,
  ...BuildTuple<B>
]
  ? Length<U>
  : never;

type NonNegativeInteger<T extends number> = number extends T
  ? never
  : `${T}` extends `-${string}` | `${string}.${string}`
  ? never
  : T;

type Absolute<T extends number> = `${T}` extends `-${infer R}` ? R : `${T}`;

type StringToChars<T extends string> = string extends T
  ? Array<string>
  : T extends `${infer C}${infer R}`
  ? [C, ...StringToChars<R>]
  : [];

type Join<
  Strings extends ReadonlyArray<string>,
  Acc extends string = ''
> = Strings extends readonly [infer Head, ...infer Rest]
  ? Rest extends ReadonlyArray<string>
    ? Join<
        Rest,
        Head extends string ? (Acc extends '' ? Head : `${Acc}${Head}`) : never
      >
    : Acc
  : Acc;

type ObjectSwap<T, K1 extends keyof T, K2 extends keyof T> = {
  [K in keyof T]: T[K1 extends K ? K2 : K2 extends K ? K1 : K];
};

type ArraySwap<
  T extends ReadonlyArray<unknown> | [],
  Index1 extends number,
  Index2 extends number,
  Position extends ReadonlyArray<unknown> | [] = [],
  Original extends ReadonlyArray<unknown> = T
> = T extends readonly [infer AtPosition, ...infer Rest]
  ? number extends Index1
    ? T
    : number extends Index2
    ? T
    : [
        Length<Position> extends Index1
          ? Original[Index2]
          : Length<Position> extends Index2
          ? Original[Index1]
          : AtPosition,
        ...ArraySwap<Rest, Index1, Index2, [unknown, ...Position], Original>
      ]
  : T;

type SafeNegativeIndex<
  T extends ReadonlyArray<unknown> | [],
  Index extends number
> = Subtract<Length<T>, ParseInt<Absolute<Index>>> extends never
  ? never
  : Subtract<Length<T>, ParseInt<Absolute<Index>>>;

type SafePositiveIndex<
  T extends ReadonlyArray<unknown> | [],
  Index extends number
> = LT<Index, Length<T>> extends true ? Index : never;

type SafeIndex<
  T extends ReadonlyArray<unknown> | [],
  Index extends number
> = NonNegativeInteger<Index> extends never
  ? SafeNegativeIndex<T, Index> extends never
    ? never
    : SafeNegativeIndex<T, Index>
  : SafePositiveIndex<T, Index> extends never
  ? never
  : SafePositiveIndex<T, Index>;

/**
 * Swaps the positions of two elements in a list, string or an object based on the provided keys.
 * For strings, the keys represent the index positions of the characters to be swapped.
 * For objects, the keys represent the property keys of the properties to be swapped.
 *
 * @param data the item to be manipulated. This can be an object, an array, or a string.
 * @param key1 the first key/index
 * @param key2 the second key/index
 *
 * @signature
 *   swap(key1, key2)(data)
 *
 * @example
 *   swap(['a', 'b', 'c'], 0, 1) // => ['b', 'a', 'c']
 *   swap('abc', 0, 1) // => 'bac'
 *
 * @category Array
 * @data_first
 */
export function swap<T, K1 extends keyof T, K2 extends keyof T>(
  data: T,
  key1: K1,
  key2: K2
): T extends string
  ? string extends T
    ? string
    : K1 extends number
    ? number extends K1
      ? string
      : SafeIndex<StringToChars<T>, K1> extends never
      ? T
      : K2 extends number
      ? number extends K2
        ? string
        : SafeIndex<StringToChars<T>, K2> extends never
        ? T
        : Join<
            ArraySwap<
              StringToChars<T>,
              SafeIndex<StringToChars<T>, K1>,
              SafeIndex<StringToChars<T>, K2>
            >
          >
      : never
    : never
  : T extends ReadonlyArray<unknown> | []
  ? K1 extends number
    ? number extends K1
      ? ReadonlyArray<T[number]>
      : SafeIndex<T, K1> extends never
      ? T
      : K2 extends number
      ? number extends K2
        ? ReadonlyArray<T[number]>
        : SafeIndex<T, K2> extends never
        ? T
        : ArraySwap<T, SafeIndex<T, K1>, SafeIndex<T, K2>>
      : never
    : never
  : T extends object
  ? ObjectSwap<T, K1, K2>
  : never;

/**
 * Swaps the positions of two elements in a list, string or an object based on the provided keys.
 * For strings, the keys represent the index positions of the characters to be swapped.
 * For objects, the keys represent the property keys of the properties to be swapped.
 *
 * @param key1 the first key/index
 * @param key2 the second key/index
 *
 * @signature
 *   swap(key1, key2)(data)
 *
 * @example
 *   swap(0, 1)(['a', 'b', 'c']) // => ['b', 'a', 'c']
 *   swap(0, -1)('abc') // => 'cba'
 *
 * @category Array
 * @data_last
 */
export function swap<K1 extends PropertyKey, K2 extends PropertyKey>(
  key1: K1,
  key2: K2
): <T>(
  data: T
) => T extends string
  ? string extends T
    ? string
    : K1 extends number
    ? number extends K1
      ? string
      : SafeIndex<StringToChars<T>, K1> extends never
      ? T
      : K2 extends number
      ? number extends K2
        ? string
        : SafeIndex<StringToChars<T>, K2> extends never
        ? T
        : Join<
            ArraySwap<
              StringToChars<T>,
              SafeIndex<StringToChars<T>, K1>,
              SafeIndex<StringToChars<T>, K2>
            >
          >
      : never
    : never
  : T extends ReadonlyArray<unknown> | []
  ? K1 extends number
    ? number extends K1
      ? ReadonlyArray<T[number]>
      : SafeIndex<T, K1> extends never
      ? T
      : K2 extends number
      ? number extends K2
        ? ReadonlyArray<T[number]>
        : SafeIndex<T, K2> extends never
        ? T
        : ArraySwap<T, SafeIndex<T, K1>, SafeIndex<T, K2>>
      : never
    : never
  : T extends object
  ? K1 extends keyof T
    ? K2 extends keyof T
      ? ObjectSwap<T, K1, K2>
      : T
    : T
  : never;

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
    return _swapList(item, key1, key2);
  } else if (isString(item)) {
    return _swapString(item, key1, key2);
  } else {
    return _swapObject(item, key1, key2);
  }
}

function _swapList<T>(
  item: ReadonlyArray<T>,
  index1: number,
  index2: number
): Array<T> {
  const length = item.length;
  let result = item.slice();

  const positiveIndexA = index1 < 0 ? length + index1 : index1;
  const positiveIndexB = index2 < 0 ? length + index2 : index2;

  const positiveMin = Math.min(positiveIndexA, positiveIndexB);
  const positiveMax = Math.max(positiveIndexA, positiveIndexB);

  if (positiveIndexA < 0 || positiveIndexA > length) {
    return result;
  }
  if (positiveIndexB < 0 || positiveIndexB > length) {
    return result;
  }
  if (positiveIndexA === positiveIndexB) {
    return result;
  }

  result = Array.prototype.concat.apply(
    [],
    [
      result.slice(0, positiveMin),
      [result[positiveMax]],
      result.slice(positiveMin + 1, positiveMax),
      [result[positiveMin]],
      result.slice(positiveMax + 1, length),
    ]
  );

  return result;
}

function _swapString<T extends string>(
  item: T,
  key1: number,
  key2: number
): string {
  const result = _swapList(item.split(''), key1, key2);
  return result.join('');
}

function _swapObject(
  item: { [K in PropertyKey]: any },
  key1: PropertyKey,
  key2: PropertyKey
): { [K in PropertyKey]: any } {
  const copy = clone(item);
  if (
    Object.prototype.hasOwnProperty.call(copy, key1) &&
    Object.prototype.hasOwnProperty.call(copy, key2)
  ) {
    const tmp = copy[key1];
    copy[key1] = copy[key2];
    copy[key2] = tmp;
  }
  return copy;
}
