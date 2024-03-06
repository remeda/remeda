import { fromPairs } from "./fromPairs";
import { hasAtLeast } from "./hasAtLeast";
import { purry } from "./purry";

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param data - The object.
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

export function omit(): unknown {
  return purry(_omit, arguments);
}

function _omit<T extends object, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>,
): Omit<T, K> {
  if (!hasAtLeast(propNames, 1)) {
    // No props to omit at all!
    return { ...data };
  }

  if (!hasAtLeast(propNames, 2)) {
    // Only one prop to omit.

    const [propName] = propNames;
    const { [propName]: omitted, ...remaining } = data;
    return remaining;
  }

  // Multiple props to omit...

  if (!propNames.some((propName) => propName in data)) {
    return { ...data };
  }

  const asSet = new Set(propNames);
  return fromPairs(
    Object.entries(data).filter(([key]) => !asSet.has(key as K)),
  ) as Omit<T, K>;
}
