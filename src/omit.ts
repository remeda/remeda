import { hasAtLeast } from "./hasAtLeast";
import { purry } from "./purry";

/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param propNames - The property names.
 * @signature
 *    R.omit(names)(obj);
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.omit(['a', 'd'])) // => { b: 2, c: 3 }
 * @dataLast
 * @category Object
 */
export function omit<T extends object, K extends keyof T>(
  propNames: ReadonlyArray<K>,
): (data: T) => Omit<T, K>;

/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param data - The object.
 * @param propNames - The property names.
 * @signature
 *    R.omit(obj, names);
 * @example
 *    R.omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * @dataFirst
 * @category Object
 */
export function omit<T extends object, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>,
): Omit<T, K>;

export function omit(...args: ReadonlyArray<unknown>): unknown {
  return purry(omitImplementation, args);
}

function omitImplementation<T extends object, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>,
): Omit<T, K> {
  if (!hasAtLeast(propNames, 1)) {
    // No props to omit at all!
    return { ...data };
  }

  if (!hasAtLeast(propNames, 2)) {
    // Only one prop to omit.
    const { [propNames[0]]: _omitted, ...remaining } = data;
    return remaining;
  }

  // Multiple props to omit...

  const out = { ...data };
  for (const prop of propNames) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- This is the best way to do it!
    delete out[prop];
  }
  return out;
}
