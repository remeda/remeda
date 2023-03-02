import { purry } from './purry';

function _matches(target: any, condition: any) {
  if (typeof condition === 'function') return condition(target);

  if (typeof condition === 'object') {
    return Object.entries(condition).every(([key, value]) =>
      matches(target[key], value)
    );
  }

  return target === condition;
}

type Matcher<I extends any = any> = ((dataInput: I) => boolean) | any;

/**
 * Compares the input with the matcher and returns `true` if they match.
 * The matcher can be a function (which will be fed the input and is expected
 * to return a boolean), or a value. If the value is an object, the matching
 * will be recursive.
 * @param input the input data
 * @param matcher matching function or value
 * @signature
 *   R.matches(inputData, matcher)
 * @example
 *    R.matches( 'potato', 'potato'); // => true
 *    R.matches( 'potato', 'turnip'); // => false
 *    R.matches( 'potato', vegetable => vegetable === 'potato'); // => true
 *   R.matches({ a: 1, b :2 }, { a: 1 } ); // => true
 * @data_first
 * @category Object
 */
export function matches<I extends any>(data: I, matcher: Matcher<I>): boolean;

export function matches(matcher: Matcher<any>): (dataIn: any) => boolean;

export function matches() {
  return purry(_matches, arguments);
}
