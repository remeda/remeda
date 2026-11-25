import type { BoundedPartial } from "./internal/types/BoundedPartial";
import type { ArrayCallback } from "./internal/types/Callback";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - The array.
 * @param mapper - The indexing function.
 * @signature
 *    indexBy(data, mapper)
 * @example
 *    indexBy(['one', 'two', 'three'], x => x.length) // => {3: 'two', 5: 'three'}
 * @dataFirst
 * @category Array
 */
export function indexBy<T extends IterableContainer, K extends PropertyKey>(
  data: T,
  mapper: ArrayCallback<T, K>,
): BoundedPartial<Record<K, T[number]>>;

/**
 * Converts a list of objects into an object indexing the objects by the given
 * key.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param mapper - The indexing function.
 * @signature
 *    indexBy(mapper)(data)
 * @example
 *    pipe(
 *      ['one', 'two', 'three'],
 *      indexBy(x => x.length)
 *    ) // => {3: 'two', 5: 'three'}
 * @dataLast
 * @category Array
 */
export function indexBy<T extends IterableContainer, K extends PropertyKey>(
  mapper: ArrayCallback<T, K>,
): (data: T) => BoundedPartial<Record<K, T[number]>>;

export function indexBy(
  dataOrMapper:
    IterableContainer | ArrayCallback<IterableContainer, PropertyKey>,
  mapper?: ArrayCallback<IterableContainer, PropertyKey>,
): unknown {
  return typeof dataOrMapper === "function"
    ? dataLast(dataOrMapper)
    : indexByImplementation(
        dataOrMapper,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        mapper,
      );
}

const dataLast: DataLastBuilder<typeof indexByImplementation> =
  (mapper) => (data) =>
    indexByImplementation(data, mapper);

function indexByImplementation<T, K extends PropertyKey>(
  data: readonly T[],
  mapper: (item: T, index: number, data: readonly T[]) => K,
): BoundedPartial<Record<K, T>> {
  const out: Partial<Record<K, T>> = {};

  data.forEach((item, index) => {
    const key = mapper(item, index, data);
    if (key === "__proto__") {
      // We want `__proto__` to act just like any other key, but assigning it
      // runs the setter inherited from `Object.prototype` instead of creating
      // a property. Defining it directly creates the same own data property
      // that assigning creates for all *other* keys.
      Object.defineProperty(out, "__proto__", {
        value: item,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    } else {
      out[key] = item;
    }
  });

  return out as BoundedPartial<Record<K, T>>;
}
