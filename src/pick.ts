import { purry } from './purry';

/**
 * Creates an object composed of the picked `object` properties.
 * @param object the target object
 * @param names the properties names
 * @signature R.pick(object, [prop1, prop2])
 * @example
 *    R.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @data_first
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  names: readonly K[]
): Pick<T, K>;

/**
 * Creates an object composed of the picked `object` properties.
 * @param names the properties names
 * @signature R.pick([prop1, prop2])(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @data_last
 * @category Object
 */
export function pick<T extends object, K extends keyof T>(
  names: readonly K[]
): (object: T) => Pick<T, K>;

export function pick() {
  return purry(_pick, arguments);
}

function _pick(object: any, names: string[]) {
  if (object == null) {
    return {};
  }
  return names.reduce((acc, name) => {
    if (name in object) {
      acc[name] = object[name];
    }
    return acc;
  }, {} as any);
}
