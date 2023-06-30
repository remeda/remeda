import { purry } from './purry';
import { isString } from './isString';
import { isArray } from './isArray';
import { clone } from './clone';

/**
 * Swaps the positions of two elements in a list, string or an object based on the provided keys.
 * For strings, the keys represent the index positions of the characters to be swapped.
 * For objects, the keys represent the property keys of the properties to be swapped.
 *
 * @param key1 the first key/index
 * @param key2 the second key/index
 *
 * @signature
 *   swap(key1, key2)(item)
 *
 * @example
 *   swap(0, 1)(['a', 'b', 'c']) // => ['b', 'a', 'c']
 *   swap(0, 1)('abc') // => 'bac'
 *   swap('a', 'b')({a: 1, b: 2}) // => {a: 2, b: 1}
 *
 * @category Array
 * @data_last
 */
export function swap(
  key1: number,
  key2: number
): <T extends string | ReadonlyArray<any>>(
  item: T
) => T extends string
  ? string
  : T extends ReadonlyArray<infer U>
  ? Array<U>
  : never;
export function swap(
  key1: PropertyKey,
  key2: PropertyKey
): <T>(item: { [K in PropertyKey]: T }) => { [K in PropertyKey]: T };

/**
 * Swaps the positions of two elements in a list, string or an object based on the provided keys.
 * For strings, the keys represent the index positions of the characters to be swapped.
 * For objects, the keys represent the property keys of the properties to be swapped.
 *
 * @param item the item to be manipulated
 * @param key1 the first key/index
 * @param key2 the second key/index
 *
 * @signature
 *   swap(key1, key2)(item)
 *
 * @example
 *   swap(['a', 'b', 'c'], 0, 1) // => ['b', 'a', 'c']
 *   swap('abc', 0, 1) // => 'bac'
 *   swap({a: 1, b: 2}, 'a', 'b') // => {a: 2, b: 1}
 *
 * @category Array
 * @data_first
 */
export function swap<T extends string | ReadonlyArray<any>>(
  item: T,
  key1: number,
  key2: number
): T extends string
  ? string
  : T extends ReadonlyArray<infer U>
  ? Array<U>
  : never;
export function swap<T>(
  item: { [K in PropertyKey]: T },
  key1: PropertyKey,
  key2: PropertyKey
): { [K in PropertyKey]: T };

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
  key1: number,
  key2: number
): Array<T> {
  const length = item.length;
  let result = item.slice();

  const positiveIndexA = key1 < 0 ? length + key1 : key1;
  const positiveIndexB = key2 < 0 ? length + key2 : key2;

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
