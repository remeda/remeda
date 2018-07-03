import { purry } from './purry';

/**
 * Clamp the given value within the inclusive min and max bounds.
 * @param value the number
 * @param limits the bounds limits
 * @signature
 *    R.clamp(value, { min, max });
 * @example
 *    clamp(10, { min: 20 }) // => 20
 *    clamp(10, { max: 5 }) // => 5
 *    clamp(10, { max: 20, min: 5 }) // => 10
 * @data_first
 * @category Number
 */
export function clamp(
  value: number,
  limits: { min?: number; max?: number }
): number;

/**
 * Clamp the given value within the inclusive min and max bounds.
 * @param value the number
 * @param limits the bounds limits
 * @signature
 *    R.clamp({ min, max })(value);
 * @example
 *    clamp({ min: 20 })(10) // => 20
 *    clamp({ max: 5 })(10) // => 5
 *    clamp({ max: 20, min: 5 })(10) // => 10
 * @data_last
 * @category Number
 */
export function clamp(limits: {
  min?: number;
  max?: number;
}): (value: number) => number;

export function clamp() {
  return purry(_clamp, arguments);
}

function _clamp(value: number, limits: { min?: number; max?: number }) {
  if (limits.min != null) {
    if (limits.min > value) {
      return limits.min;
    }
  }
  if (limits.max != null) {
    if (limits.max < value) {
      return limits.max;
    }
  }
  return value;
}
