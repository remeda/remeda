import { purry } from "./purry";

type Limits = {
  readonly min?: number;
  readonly max?: number;
};

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
 * @dataFirst
 * @category Number
 */
export function clamp(value: number, limits: Limits): number;

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
 * @dataLast
 * @category Number
 */
export function clamp(limits: Limits): (value: number) => number;

export function clamp() {
  return purry(_clamp, arguments);
}

function _clamp(value: number, limits: Limits) {
  if (limits.min !== undefined) {
    if (limits.min > value) {
      return limits.min;
    }
  }
  if (limits.max !== undefined) {
    if (limits.max < value) {
      return limits.max;
    }
  }
  return value;
}
