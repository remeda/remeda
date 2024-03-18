import type { Narrow } from "./_narrow";
import { purry } from "./purry";

/**
 * Determines if a value is _shallowly_ equal to the specified value using Object.is equality,
 * and narrows the type of the value to match.
 *
 * @param specificValue the to compare to. This type should be narrower than the type being passed into the returned function.
 * @returns a function that returns true if the the two values are equal.
 * @signature
 *    R.isEqual(specificValue)(wideValue);
 * @example
 *   [1, 2, 3].filter(R.isEqual(2)); // => [2]
 * @dataLast
 * @category Guard
 */
export function isEqual<WideValue, SpecificValue extends WideValue>(
  specificValue: Narrow<SpecificValue>,
): (wideValue: WideValue) => wideValue is SpecificValue;

/**
 * Determines if the two values are _shallowly_ equal using Object.is equality
 * and narrows the type of the first value to match that of the second value.
 *
 * @param wideValue the first value to compare.
 * @param specificValue the second value to compare. This type should be narrower than the first value.
 * @returns true if the the two values are equal, false otherwise
 * @signature
 *    R.isEqual(wideValue, specificValue);
 * @dataFirst
 * @category Guard
 */
export function isEqual<WideValue, SpecificValue extends WideValue>(
  wideValue: WideValue,
  specificValue: Narrow<SpecificValue>,
): wideValue is SpecificValue;

export function isEqual(): unknown {
  return purry(isEqualImplementation, arguments);
}

function isEqualImplementation<WideValue, SpecificValue extends WideValue>(
  widened: WideValue,
  value: SpecificValue,
): widened is SpecificValue {
  return Object.is(widened, value);
}
