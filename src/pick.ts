import { purry } from './purry';

/**
 * Creates an object composed of the picked `object` properties.
 * @param object the target object
 * @param names the properties names
 * @signature R.pick(object, [prop1, prop2])
 * @example
 *    R.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @dataFirst
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  names: ReadonlyArray<K>
): Pick<T, K>;

/**
 * Creates an object composed of the picked `object` properties.
 * @param names the properties names
 * @signature R.pick([prop1, prop2])(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @dataLast
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  names: ReadonlyArray<K>
): (object: T) => Pick<T, K>;

export function pick() {
  return purry(_pick, arguments);
}

function _pick<T extends object, K extends keyof T>(
  object: T,
  names: ReadonlyArray<K>
) {
  if (object == null) {
    return {};
  }
  return names.reduce<Record<PropertyKey, unknown>>((acc, name) => {
    if (name in object) {
      acc[name] = object[name];
    }
    return acc;
  }, {});
}
