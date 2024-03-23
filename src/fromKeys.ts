import type { IterableContainer } from "./_types";
import { purry } from "./purry";
import type { Simplify } from "./type-fest/simplify";

// Takes a union of literals and creates a union of records with the value V for
// each key **separately**
// @example ExactlyOneKey<"cat" | "dog", boolean> // { cat: boolean } | { dog: boolean }
type ExactlyOneKey<T, V> = T extends PropertyKey ? { [P in T]: V } : never;

type FromKeys<T extends IterableContainer, V> = T extends readonly []
  ? // eslint-disable-next-line @typescript-eslint/ban-types -- We want to return an empty object type here, but it's not trivial to build that in Typescript, other fixer suggestions like Record<PropertyKey, never> or Record<PropertyKey, unknown> both break our type tests so they don't do what we need here. Because the result is mutable this might be the correct type after all...
    {}
  : T extends readonly [infer Head, ...infer Rest]
    ? ExactlyOneKey<Head, V> & FromKeys<Rest, V>
    : T[number] extends PropertyKey
      ? Partial<Record<T[number], V>>
      : never;

/**
 * Creates an object that maps each key in `data` to the result of `mapper` for
 * that key. Duplicate keys are overwritten, guaranteeing that `mapper` is run
 * for each item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - An array of keys of the output object. All items in the array
 * would be keys in the output array.
 * @param mapper - Takes a key and returns the value that would be associated
 * with that key.
 * @signature
 *   R.fromKeys(data, mapper);
 * @example
 *   R.fromKeys(["cat", "dog"], R.length()); // { cat: 3, dog: 3 } (typed as Partial<Record<"cat" | "dog", number>>)
 *   R.fromKeys([1, 2], R.add(1)); // { 1: 2, 2: 3 } (typed as Partial<Record<1 | 2, number>>)
 * @dataFirst
 * @category Object
 */
export function fromKeys<T extends IterableContainer<PropertyKey>, V>(
  data: T,
  mapper: (item: T[number], index: number, data: T) => V,
): Simplify<FromKeys<T, V>>;

/**
 * Creates an object that maps each key in `data` to the result of `mapper` for
 * that key. Duplicate keys are overwritten, guaranteeing that `mapper` is run
 * for each item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param mapper - Takes a key and returns the value that would be associated
 * with that key.
 * @signature
 *   R.fromKeys(mapper)(data);
 * @example
 *   R.pipe(["cat", "dog"], R.fromKeys(R.length())); // { cat: 3, dog: 3 } (typed as Partial<Record<"cat" | "dog", number>>)
 *   R.pipe([1, 2], R.fromKeys(R.add(1))); // { 1: 2, 2: 3 } (typed as Partial<Record<1 | 2, number>>)
 * @dataLast
 * @category Object
 */
export function fromKeys<T extends IterableContainer<PropertyKey>, V>(
  mapper: (item: T[number], index: number, data: T) => V,
): (data: T) => Simplify<FromKeys<T, V>>;

export function fromKeys(): unknown {
  return purry(fromKeysImplementation, arguments);
}

function fromKeysImplementation<T extends IterableContainer<PropertyKey>, V>(
  data: T,
  mapper: (item: T[number], index: number, data: T) => V,
): FromKeys<T, V> {
  const result: Partial<FromKeys<T, V>> = {};

  for (let i = 0; i < data.length; i++) {
    // TODO: Use entries once we bump our typescript target.
    const key = data[i]!;
    // @ts-expect-error [ts7053] - There's no easy way to make Typescript aware that the items in T would be keys in the output object because it's type is built recursively and the "being an item of an array" property of a type is not "carried over" in the recursive type definition.
    result[key] = mapper(key, i, data);
  }

  return result as FromKeys<T, V>;
}
