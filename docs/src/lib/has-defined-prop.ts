import { purry } from "remeda";

export type SetDefined<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};

/**
 * Checks if an object has a non-trivial value for a given key and narrows the
 * type accordingly.
 *
 * TODO: Consider adding this to the library!
 *
 * @param data - The object we check against.
 * @param key - The key we check for.
 */
export function hasDefinedProp<T extends object, K extends keyof T>(
  data: T | Record<K, unknown>,
  key: K,
): data is SetDefined<T, K>;

export function hasDefinedProp<T extends object, K extends keyof T>(
  key: K,
): (item: T | Record<K, unknown>) => item is SetDefined<T, K>;

export function hasDefinedProp(...args: ReadonlyArray<unknown>): unknown {
  return purry(hasDefinedPropImplementation, args);
}

const hasDefinedPropImplementation = <T extends object, K extends keyof T>(
  item: T | Record<K, unknown>,
  key: K,
): item is SetDefined<T, K> => item[key] !== undefined && item[key] !== null;
