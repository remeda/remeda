import { purry3 } from "./internal/purryByArity";

type SwappedProps<T, K1 extends keyof T, K2 extends keyof T> = {
  [K in keyof T]: T[K1 extends K ? K2 : K2 extends K ? K1 : K];
};

/**
 * Swaps the values of two properties in an object based on the provided keys.
 *
 * @param data - The object to be manipulated.
 * @param key1 - The first property key.
 * @param key2 - The second property key.
 * @returns Returns the manipulated object.
 * @signature
 *   swapProps(data, key1, key2)
 * @example
 *   swapProps({a: 1, b: 2, c: 3}, 'a', 'b') // => {a: 2, b: 1, c: 3}
 * @dataFirst
 * @category Object
 */
export function swapProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
>(data: T, key1: K1, key2: K2): SwappedProps<T, K1, K2>;

/**
 * Swaps the values of two properties in an object based on the provided keys.
 *
 * @param key1 - The first property key.
 * @param key2 - The second property key.
 * @returns Returns the manipulated object.
 * @signature
 *   swapProps(key1, key2)(data)
 * @example
 *   swapProps('a', 'b')({a: 1, b: 2, c: 3}) // => {a: 2, b: 1, c: 3}
 * @dataLast
 * @category Object
 */
export function swapProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
>(key1: K1, key2: K2): (data: T) => SwappedProps<T, K1, K2>;

export function swapProps(
  dataOrKey1: unknown,
  key1OrKey2?: unknown,
  key2?: unknown,
): unknown {
  return purry3(
    swapPropsImplementation,
    arguments.length,
    dataOrKey1,
    key1OrKey2,
    key2,
  );
}

const swapPropsImplementation = <T extends object>(
  data: T,
  key1: keyof T,
  key2: keyof T,
): Record<PropertyKey, unknown> => ({
  ...data,
  [key1]: data[key2],
  [key2]: data[key1],
});
