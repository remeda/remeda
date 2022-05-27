import { purry } from './purry';

/**
 * Returns a partial copy of an object containing only the keys that satisfy the supplied predicate.
 * @param object the target object
 * @param pred predicate
 * @signature R.pickBy(object, (value, key) => true )
 * @example
 *    R.pickBy({ a: 1, b: 2, c: 3, d: 4 }, (value) => value === 1 || value === 4) // => { a: 1, d: 4 }
 * @data_first
 * @category Object
 */
export function pickBy<T extends object>(
  object: T,
  pred: (value: T[keyof T], key: keyof T) => boolean
): Partial<T>;

/**
 * Returns a partial copy of an object containing only the keys that satisfy the supplied predicate.
 * @param pred predicate
 * @signature R.pickBy((value, key) => true )(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.pickBy((value) => value === 1 || value === 4)) // => { a: 1, d: 4 }
 * @data_last
 * @category Object
 */
export function pickBy<T extends object, U>(
  pred: (value: any, key: string) => boolean
): (object: T) => Partial<T>;

export function pickBy() {
  return purry(_pickBy, arguments);
}

function _pickBy(object: any, pred: (value: any, key: string) => boolean) {
  if (object == null) {
    return {};
  }

  const result = {} as any;
  for (const key in object) {
    if (pred(object[key], key)) {
      result[key] = object[key];
    }
  }
  return result;
}
