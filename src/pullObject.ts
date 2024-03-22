import type { IterableContainer } from "./_types";
import { purry } from "./purry";

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
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param data - The items used to pull/extract the keys and values from.
 * @param keyExtractor - Computes the key for item.
 * @param valueExtractor - Computes the value for the item.
 * @signature
 *   R.pullObject(data, keyExtractor, valueExtractor);
 * @example
 *   R.pullObject(
 *     [
 *       { name: "john", email: "john@remedajs.com" },
 *       { name: "jane", email: "jane@remedajs.com" }
 *     ],
 *     R.prop("name"),
 *     R.prop("email"),
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
  keyExtractor: (item: T[number]) => K,
  valueExtractor: (item: T[number]) => V,
): Partial<Record<K, V>>;

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
 * * `mapToObj` - Builds an object from an array of items and a single mapper for key-value pairs.
 * Refer to the docs for more details.
 *
 * @param keyExtractor - Computes the key for item.
 * @param valueExtractor - Computes the value for the item.
 * @signature
 *   R.pullObject(keyExtractor, valueExtractor)(data);
 * @example
 *   R.pipe(
 *     [
 *       { name: "john", email: "john@remedajs.com" },
 *       { name: "jane", email: "jane@remedajs.com" }
 *     ],
 *     R.pullObject(R.prop("email"), R.prop("name")),
 *   ); // => { john: "john@remedajs.com", jane: "jane@remedajs.com" }
 * @dataLast
 * @category Object
 */
export function pullObject<
  T extends IterableContainer,
  K extends PropertyKey,
  V,
>(
  keyExtractor: (item: T[number]) => K,
  valueExtractor: (item: T[number]) => V,
): (data: T) => Partial<Record<K, V>>;

export function pullObject(): unknown {
  return purry(pullObjectImplementation, arguments);
}

function pullObjectImplementation<
  T extends IterableContainer,
  K extends PropertyKey,
  V,
>(
  data: T,
  keyExtractor: (item: T[number]) => K,
  valueExtractor: (item: T[number]) => V,
): Partial<Record<K, V>> {
  const result: Partial<Record<K, V>> = {};

  for (const item of data) {
    const key = keyExtractor(item);
    const value = valueExtractor(item);
    result[key] = value;
  }

  return result;
}
