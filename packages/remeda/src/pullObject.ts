import { dataLastImplementation2 } from "./internal/dataLastImplementation";
import type { BoundedPartial } from "./internal/types/BoundedPartial";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Creates an object that maps the result of `valueExtractor` with a key
 * resulting from running `keyExtractor` on each item in `data`. Duplicate keys
 * are overwritten, guaranteeing that the extractor functions are run on each
 * item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - The items used to pull/extract the keys and values from.
 * @param keyExtractor - Computes the key for item.
 * @param valueExtractor - Computes the value for the item.
 * @signature
 *   pullObject(data, keyExtractor, valueExtractor);
 * @example
 *   pullObject(
 *     [
 *       { name: "john", email: "john@remedajs.com" },
 *       { name: "jane", email: "jane@remedajs.com" }
 *     ],
 *     prop("name"),
 *     prop("email"),
 *   ); // => { john: "john@remedajs.com", jane: "jane@remedajs.com" }
 * @dataFirst
 * @category Object
 */
export function pullObject<
  T extends IterableContainer,
  K extends PropertyKey,
  V,
>(
  data: T,
  keyExtractor: (item: T[number], index: number, data: T) => K,
  valueExtractor: (item: T[number], index: number, data: T) => V,
): BoundedPartial<Record<K, V>>;

/**
 * Creates an object that maps the result of `valueExtractor` with a key
 * resulting from running `keyExtractor` on each item in `data`. Duplicate keys
 * are overwritten, guaranteeing that the extractor functions are run on each
 * item in `data`.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param keyExtractor - Computes the key for item.
 * @param valueExtractor - Computes the value for the item.
 * @signature
 *   pullObject(keyExtractor, valueExtractor)(data);
 * @example
 *   pipe(
 *     [
 *       { name: "john", email: "john@remedajs.com" },
 *       { name: "jane", email: "jane@remedajs.com" }
 *     ],
 *     pullObject(prop("name"), prop("email")),
 *   ); // => { john: "john@remedajs.com", jane: "jane@remedajs.com" }
 * @dataLast
 * @category Object
 */
export function pullObject<
  T extends IterableContainer,
  K extends PropertyKey,
  V,
>(
  keyExtractor: (item: T[number], index: number, data: T) => K,
  valueExtractor: (item: T[number], index: number, data: T) => V,
): (data: T) => BoundedPartial<Record<K, V>>;

export function pullObject(
  dataOrKeyExtractor: unknown,
  keyExtractorOrValueExtractor: unknown,
  valueExtractor?: unknown,
): unknown {
  return typeof dataOrKeyExtractor === "function"
    ? dataLastImplementation2(
        pullObjectImplementation,
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrKeyExtractor,
        keyExtractorOrValueExtractor,
      )
    : pullObjectImplementation(
        // @ts-expect-error [ts2345] -- Only a data-last call passes a function first; TypeScript can't narrow the other parameters from that, and the overloads guarantee their types.
        dataOrKeyExtractor,
        keyExtractorOrValueExtractor,
        valueExtractor,
      );
}

function pullObjectImplementation<T, K extends PropertyKey, V>(
  data: readonly T[],
  keyExtractor: (item: T, index: number, data: readonly T[]) => K,
  valueExtractor: (item: T, index: number, data: readonly T[]) => V,
): Partial<Record<K, V>> {
  const result: Partial<Record<K, V>> = {};

  data.forEach((item, index) => {
    const key = keyExtractor(item, index, data);
    const value = valueExtractor(item, index, data);
    if (key === "__proto__") {
      // We want `__proto__` to act just like any other key, but assigning it
      // runs the setter inherited from `Object.prototype` instead of creating
      // a property. Defining it directly creates the same own data property
      // that assigning creates for all *other* keys.
      Object.defineProperty(result, "__proto__", {
        value,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    } else {
      result[key] = value;
    }
  });

  return result;
}
