import { purry } from './purry';

type Invertable = { [index: string]: string } | { [index: number]: string };
type Inverted = { [index: string]: string };

/**
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 * @param object the object
 * @signature
 *    R.invert(object)
 * @example
 *    R.invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @data_first
 * @category object
 * @pipeable
 */
export function invert<T>(object: Invertable): Inverted;

/**
 * Returns an object whose keys are values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 * @param object the object
 * @signature
 *    R.invert()(object)
 * @example
 *    R.pipe({ a: "d", b: "e", c: "f" }, R.invert()); // => { d: "a", e: "b", f: "c" }
 * @data_last
 * @category object
 * @pipeable
 */
export function invert<T>(): (object: Invertable) => Inverted;

export function invert() {
  return purry(_invert, arguments);
}

function _invert(object: Invertable): Inverted {
  return Object.entries(object).reduce((accumulator, [key, value]) => {
    accumulator[value] = key;
    return accumulator;
  }, {} as Inverted)
}
