import { purry } from './purry';
import { _reduceLazy } from './_reduceLazy';
import { equals } from './equals';

export type Includable<T> = T[] | string;

/**
 * Returns true for:
 *   > objects: when key is present
 *   > strings: when string is present
 *   > arrays: when item is present
 * @param array
 * @signature
 *    R.includes(source, item)
 * @example
 *    R.includes({ a: 1, b: 2 }, 1) // => true
 *    R.includes([1, 2, 3, 4], 3) // => true
 *    R.includes('some text', 'ex') // => true
 *
 *    R.pipe({ a: 1, b: 2 }, includes(1)) // => true
 *    R.pipe([1, 2, 3, 4], includes(3)) // => true
 *    R.pipe('some text', includes('ex')) // => true
 * @category Array
 */
export function includes<T>(source: Includable<T>, item: T): boolean;
export function includes<T>(item: T): (source: Includable<T>) => boolean;

export function includes() {
  return purry(_includes, arguments);
}

function _includes<T>(source: Includable<T>, item: T): boolean {
  if (Array.isArray(source)) {
    return _arrayIncludes(item, source);
  } else if(typeof item === 'string') {
    return _stringIncludes(item, source);
  } else {
    return false;
  }
}

function _arrayIncludes<T>(item: T, arr: T[]) {
  return arr?.some(a => equals(a, item)) ?? false;
}

function _stringIncludes(item: string, source: string) {
  return source?.includes(item) ?? false;
}
