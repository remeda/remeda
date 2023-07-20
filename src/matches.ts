import { purry } from './purry';

function _matches(target: any, condition: any) {
  if (typeof condition === 'function') {
    return condition(target);
  }

  if (typeof condition === 'object') {
    for (const key in condition) {
      if (!_matches(target[key], condition[key])) {
        return false;
      }
    }
    return true;
  }

  return target === condition;
}

type Matcher<I = any> = ((dataInput: I) => boolean) | any;

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
 *    R.matches({ a: 1, b :2 }, { a: 1 } ); // => true
 *    R.matches({ 'a': 4, 'b': 5, 'c': 6 }, { 'a': 4, 'c': 6 }) // => true
 * @data_first
 * @category Object
 */
export function matches<I>(data: I, matcher: Matcher<I>): boolean;

/**
 * Compares the input with the matcher and returns `true` if they match.
 * The matcher can be a function (which will be fed the input and is expected
 * to return a boolean), or a value. If the value is an object, the matching
 * will be recursive.
 * @param input the input data
 * @param matcher matching function or value
 * @signature
 *   R.matches(matcher)(inputData)
 * @example
 *   R.pipe({a:1,b:2}, R.matches({ a: 1 }) ) // => true
 *   R.pipe({a:1,b:2}, R.matches({ b: (val) => val < 5 }) ) // => true
 *   R.pipe({a:1,b:2}, R.matches({ c: 3 }) ) // => false
 *   R.pipe( { 'a': 4, 'b': 5, 'c': 6 }, R.matches({ 'a': 4, 'c': 6 })) // => true
 * @data_last
 * @category Object
 */
export function matches(matcher: Matcher): (dataIn: any) => boolean;

export function matches() {
  return purry(_matches, arguments);
}
