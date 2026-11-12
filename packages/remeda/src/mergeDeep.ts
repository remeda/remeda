import type { MergeDeep } from "type-fest";
import { purry2 } from "./internal/purryByArity";
import { isPlainObject } from "./isPlainObject";

/**
 * Merges the `source` object into the `data` object. The merge is similar to performing `{ ...data, ...source }` (where disjoint values from each object would be copied as-is, and for any overlapping props the value from `source` would be used); But for *each prop* (`p`), if **both** `data` and `source` have a **plain-object** as a value, the value would be taken as the result of recursively deepMerging them (`result.p === deepMerge(data.p, source.p)`).
 *
 * @param data - The object to merge into. In general, this object would have its values overridden.
 * @param source - The object to merge from. In general, shared keys would be taken from this object.
 * @returns The merged object.
 * @signature
 *    mergeDeep(data, source)
 * @example
 *    mergeDeep({ foo: 'bar', x: 1 }, { foo: 'baz', y: 2 }) // => { foo: 'baz', x: 1, y: 2 }
 * @dataFirst
 * @category Object
 */
export function mergeDeep<Destination extends object, Source extends object>(
  data: Destination,
  source: Source,
): MergeDeep<Destination, Source>;

/**
 * Merges the `source` object into the `data` object. The merge is similar to performing `{ ...data, ...source }` (where disjoint values from each object would be copied as-is, and for any overlapping props the value from `source` would be used); But for *each prop* (`p`), if **both** `data` and `source` have a **plain-object** as a value, the value would be taken as the result of recursively deepMerging them (`result.p === deepMerge(data.p, source.p)`).
 *
 * @param source - The object to merge from. In general, shared keys would be taken from this object.
 * @returns The merged object.
 * @signature
 *    mergeDeep(source)(data)
 * @example
 *    pipe(
 *      { foo: 'bar', x: 1 },
 *      mergeDeep({ foo: 'baz', y: 2 }),
 *    );  // => { foo: 'baz', x: 1, y: 2 }
 * @dataLast
 * @category Object
 */
export function mergeDeep<Source extends object>(
  source: Source,
): <Destination extends object>(
  data: Destination,
) => MergeDeep<Destination, Source>;

export function mergeDeep(dataOrSource: object, source?: object): unknown {
  return purry2(
    mergeDeepImplementation,
    arguments.length,
    dataOrSource,
    source,
  );
}

function mergeDeepImplementation<
  Destination extends object,
  Source extends object,
>(data: Destination, source: Source): MergeDeep<Destination, Source> {
  // At this point the output is already merged, simply not deeply merged.
  const output = { ...data, ...source } as Record<
    keyof Destination | keyof Source,
    unknown
  >;

  // now just scan the output and look for values that should have been deep-
  // merged
  for (const key in source) {
    if (
      Object.hasOwn(data, key) &&
      isPlainObject(
        // @ts-expect-error [ts2536] -- TypeScript isn't narrowing `key` although we checked that it exists in both objects, so it can't see this access is valid.
        data[key],
      ) &&
      isPlainObject(source[key])
    ) {
      // Both destination and source have a mergeable object for this key, so we
      // recursively merge them.
      output[key] = mergeDeepImplementation(
        // @ts-expect-error [ts2536] -- TypeScript isn't narrowing `key` although we checked that it exists in both objects, so it can't see this access is valid.
        data[key],
        source[key],
      );
    }
  }

  // @ts-expect-error [ts2322] - We build the output object iteratively, I don't think it's possible to improve the types here so that typescript infers this correctly.
  return output;
}
