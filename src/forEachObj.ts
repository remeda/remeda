import { purry } from './purry';

type IndexedIteratee<T extends Record<PropertyKey, any>, K extends keyof T> = (
  value: T[K],
  key: K,
  obj: T
) => void;
type UnindexedIteratee<T extends Record<PropertyKey, any>> = (value: T[keyof T]) => void;

/**
 * Iterate an object using a defined callback function. The original object is returned.
 * @param object The object.
 * @param fn The callback function.
 * @returns The original object
 * @signature
 *    R.forEachObj(object, fn)
 * @example
 *    R.forEachObj({a: 1}, (val) => {
 *      console.log(`${val}`)
 *    }) // "1"
 *    R.forEachObj.indexed({a: 1}, (val, key, obj) => {
 *      console.log(`${key}: ${val}`)
 *    }) // "a: 1"
 * @data_first
 * @category Object
 */
export function forEachObj<T extends Record<PropertyKey, any>>(
  object: T,
  fn: UnindexedIteratee<T>
): T;

/**
 * Iterate an object using a defined callback function. The original object is returned.
 * @param fn The callback function.
 * @signature
 *    R.forEachObj(fn)(object)
 * @example
 *  R.pipe(
 *      {a: 1},
 *      R.forEachObj((val) => console.log(`${val}`))
 *    ) // "1"
 *    R.pipe(
 *      {a: 1},
 *      R.forEachObj.indexed((val, key) => console.log(`${key}: ${val}`))
 *    ) // "a: 1"
 * @data_last
 * @category Object
 */
export function forEachObj<T extends Record<PropertyKey, any>>(
  fn: UnindexedIteratee<T>
): (object: T) => T;

export function forEachObj() {
  return purry(_forEachObj(false), arguments);
}

const _forEachObj = (indexed: boolean) => (
  object: any,
  fn: (value: any, key?: any, obj?: any) => void
) => {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const val = object[key];
      if (indexed) fn(val, key, object);
      else fn(val);
    }
  }
  return object;
};

export namespace forEachObj {
  export function indexed<T extends Record<PropertyKey, any>>(
    object: T,
    fn: IndexedIteratee<T, keyof T>
  ): T;
  export function indexed<T extends Record<PropertyKey, any>>(
    fn: IndexedIteratee<T, keyof T>
  ): (object: T) => T;
  export function indexed() {
    return purry(_forEachObj(true), arguments);
  }
}
