import { purry } from './purry';

type Pair<T, K> = [(value: T) => boolean, (value: T) => K];

function _cond<T, K>(value: T, pairs: Array<Pair<T, K>>) {
  for (const [predicate, func] of pairs) {
    if (predicate(value)) {
      return func(value);
    }
  }
  return undefined;
}

/**
 * Selects the first pair of functions where the pair's first function returns true and returns the result of calling the pair's second function. Returns undefined if no pairs match.
 * @param value the value
 * @param pairs pairs of functions
 * @signature
 *    R.cond(value, pairs)
 * @example
 *    R.cond(
 *      "Hello",
 *      [[s => s === "Hello", s => "World"], [s => s === "Foo", s => "Bar"]],
 *    ) // "World"
 * @data_first
 * @category Function
 */
export function cond<T, K>(value: T, pairs: Array<Pair<T, K>>): K | undefined;

/**
 * Selects the first pair of functions where the pair's first function returns true and returns the result of calling the pair's second function. Returns undefined if no pairs match.
 * @param pairs pairs of functions
 * @signature
 *    R.maxBy(pairs)(value)
 * @example
 *    R.pipe(
 *      "Hello",
 *      R.cond([[s => s === "Hello", s => "World"], [s => s === "Foo", s => "Bar"]])
 *    ) // "World"
 * @data_last
 * @category Function
 */
export function cond<T, K>(
  pairs: Array<Pair<T, K>>
): (value: T) => K | undefined;

export function cond() {
  return purry(_cond, arguments);
}
