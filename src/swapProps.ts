import { purry } from "./purry";

type SwappedProps<T, K1 extends keyof T, K2 extends keyof T> = {
  [K in keyof T]: T[K1 extends K ? K2 : K2 extends K ? K1 : K];
};

/**
 * Swaps the positions of two properties in an object based on the provided keys.
 *
 * @param data - The object to be manipulated.
 * @param key1 - The first property key.
 * @param key2 - The second property key.
 * @returns Returns the manipulated object.
 * @signature
 *   swap(data, key1, key2)
 * @example
 *   swap({a: 1, b: 2, c: 3}, 'a', 'b') // => {a: 2, b: 1, c: 3}
 * @dataFirst
 * @category Object
 * @similarTo ramda swap
 */
export function swapProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
>(data: T, key1: K1, key2: K2): SwappedProps<T, K1, K2>;

/**
 * Swaps the positions of two properties in an object based on the provided keys.
 *
 * @param key1 - The first property key.
 * @param key2 - The second property key.
 * @returns Returns the manipulated object.
 * @signature
 *   swap(key1, key2)(data)
 * @example
 *   swap('a', 'b')({a: 1, b: 2, c: 3}) // => {a: 2, b: 1, c: 3}
 * @dataLast
 * @category Object
 * @similarTo ramda swap
 */
export function swapProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
>(key1: K1, key2: K2): (data: T) => SwappedProps<T, K1, K2>;

export function swapProps(): unknown {
  return purry(_swapProps, arguments);
}

function _swapProps<T extends object, K1 extends keyof T, K2 extends keyof T>(
  obj: T,
  key1: K1,
  key2: K2,
): {
  [K in PropertyKey]: unknown;
} {
  const { [key1]: value1, [key2]: value2 } = obj;
  return {
    ...obj,
    [key1]: value2,
    [key2]: value1,
  };
}
