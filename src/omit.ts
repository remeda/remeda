import { purry } from './purry';

/**
 * Returns a partial copy of an object omitting the keys specified.
 * 
 * If the properties are optional and they don't exist in the input object then
 * the same object is returned (unlike when using destructuring, which returns a
 * new clone of the object).

 * @param data the object
 * @param propNames the property names
 * @signature
 *    R.omit(obj, names);
 * @example
 *    R.omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * 
 *    const obj: { a?: number, b: number } = { b: 2 };
 *    const result = R.omit(obj, ['a']);
 *    result === obj // => true
 * @data_first
 * @category Object
 */
export function omit<T, K extends keyof T>(
  data: T,
  propNames: ReadonlyArray<K>
): Omit<T, K>;

/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * If the properties are optional and they don't exist in the input object then
 * the same object is returned (unlike when using destructuring, which returns a
 * new clone of the object).
 *
 * @param data the object
 * @param propNames the property names
 * @signature
 *    R.omit(names)(obj);
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.omit(['a', 'd'])) // => { b: 2, c: 3 }
 *
 *    const obj: { a?: number, b: number } = { b: 2 };
 *    const result = R.pipe(obj, R.omit(['a']));
 *    result === obj // => true
 * @data_last
 * @category Object
 */
export function omit<K extends PropertyKey>(
  propNames: ReadonlyArray<K>
): <T>(data: T) => Omit<T, K>;

export function omit() {
  return purry(_omit, arguments);
}

function _omit<T extends Record<PropertyKey, any>, K extends keyof T>(
  object: T,
  propNames: Array<K>
): Omit<T, K> {
  if (!propNames.some(propName => propName in object)) {
    // Avoid creating a clone of the input object when the output is unchanged.
    return object;
  }

  if (propNames.length === 1) {
    const [propName] = propNames;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- use destructuring to remove a single key, letting JS optimize here...
      [propName]: omitted,
      ...remaining
    } = object;
    return remaining;
  }

  const set = new Set(propNames as Array<string>);
  return Object.entries(object).reduce<any>((acc, [name, value]) => {
    if (!set.has(name)) {
      acc[name] = value;
    }
    return acc;
  }, {}) as Omit<T, K>;
}
