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

export function clamp(): unknown {
  return purry(_clamp, arguments);
}

function _clamp(value: number, { min, max }: Limits): number {
  return min !== undefined && value < min
    ? min
    : max !== undefined && value > max
      ? max
      : value;
}
