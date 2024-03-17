import type { IterableContainer } from "./_types";
import { purry } from "./purry";
import type { Simplify } from "./type-fest/simplify";

type SplitUnion<T, V> = T extends PropertyKey ? { [P in T]: V } : never;

type FromKeys<T extends IterableContainer, V> = T extends readonly []
  ? { [K in never]: V }
  : T extends readonly [infer Head, ...infer Rest]
    ? FromKeys<Rest, V> & SplitUnion<Head, V>
    : T[number] extends PropertyKey
      ? Partial<Record<T[number], V>>
      : never;

export function fromKeys<T extends IterableContainer<PropertyKey>, V>(
  data: T,
  mapper: (item: T[number]) => V,
): Simplify<FromKeys<T, V>>;

export function fromKeys<T extends IterableContainer<PropertyKey>, V>(
  mapper: (item: T[number]) => V,
): (data: T) => Simplify<FromKeys<T, V>>;

export function fromKeys(): unknown {
  return purry(fromKeysImplementation, arguments);
}

function fromKeysImplementation<T extends IterableContainer<PropertyKey>, V>(
  data: T,
  mapper: (item: T[number]) => V,
): FromKeys<T, V> {
  const result: Partial<FromKeys<T, V>> = {};

  for (const key of data) {
    // @ts-expect-error [ts7053] - TODO
    result[key] = mapper(key);
  }

  return result as FromKeys<T, V>;
}
