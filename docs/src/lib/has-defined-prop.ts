import { purry } from "remeda";

export type SetDefined<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};

export function hasDefinedProp<T extends object, K extends keyof T>(
  item: T | Record<K, unknown>,
  key: K,
): item is SetDefined<T, K>;

export function hasDefinedProp<T extends object, K extends keyof T>(
  key: K,
): (item: T | Record<K, unknown>) => item is SetDefined<T, K>;

export function hasDefinedProp(...args: ReadonlyArray<unknown>): unknown {
  return purry(hasDefinedPropImplementation, args);
}

function hasDefinedPropImplementation<T extends object, K extends keyof T>(
  item: T | Record<K, unknown>,
  key: K,
): item is SetDefined<T, K> {
  return item[key] !== undefined;
}
