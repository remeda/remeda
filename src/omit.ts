import { fromPairs } from './fromPairs';
import { purry } from './purry';

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param data the object
 * @param propNames the property names
 * @signature
 *    R.omit(obj, names);
 * @example
 *    R.omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * @data_first
 * @category Object
 */
export function omit<T extends object, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>
): Omit<T, K>;

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param data the object
 * @param propNames the property names
 * @signature
 *    R.omit(names)(obj);
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.omit(['a', 'd'])) // => { b: 2, c: 3 }
 * @data_last
 * @category Object
 */
export function omit<K extends PropertyKey>(
  propNames: ReadonlyArray<K>
): <T extends object>(data: T) => Omit<T, K>;

export function omit() {
  return purry(_omit, arguments);
}

function _omit<T extends object, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>
): Omit<T, K> {
  if (propNames.length === 0) {
    return { ...data };
  }

  if (propNames.length === 1) {
    const [propName] = propNames;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- use destructuring to remove a single key, letting JS optimize here...
      [propName]: omitted,
      ...remaining
    } = data;
    return remaining;
  }

  if (!propNames.some(propName => propName in data)) {
    return { ...data };
  }

  const asSet = new Set(propNames);
  return fromPairs(
    Object.entries(data).filter(([key]) => !asSet.has(key as K))
  ) as Omit<T, K>;
}
