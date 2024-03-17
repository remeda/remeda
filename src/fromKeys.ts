import type { IterableContainer } from "./_types";
import { purry } from "./purry";
import type { Simplify } from "./type-fest/simplify";

type SplitUnion<T, V> = T extends PropertyKey ? { [P in T]: V } : never;

type FromKeys<T extends IterableContainer, V> = T extends readonly []
  ? // eslint-disable-next-line @typescript-eslint/ban-types -- We want to return an empty object type here, but it's not trivial to build that in Typescript, other fixer suggestions like Record<PropertyKey, never> or Record<PropertyKey, unknown> both break our type tests so they don't do what we need here. Because the result is mutable this might be the correct type after all...
    {}
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
