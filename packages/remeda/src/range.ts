import { purry } from "./purry";

const DEFAULT_STEP = 1;

// Relative tolerance for snapping a near-integer division result to the nearest
// integer, preventing Math.ceil from inflating the length by one due to
// floating-point error in the numerator or denominator.
const SNAP_TOLERANCE = 1e-12;

type RangeOptions = {
  readonly end: number;
  readonly step: number;
};

// TODO [>2]: Change the signature so that range takes a required "end" parameter and an optional Options object with `start` and `step` defaulting to `0` and `1` respectively to better align with how `range` works in other libraries and languages.
/**
 * Returns a sequence of numbers from `start` (inclusive) to `end` (exclusive),
 * adding `step` (default is `1`) to each number in the sequence.
 *
 * @param start - The first number in the sequence.
 * @param endOrOptions - The end number **or** an object which is used to
 * **also** define a step size.
 * @param endOrOptions.end - The non-inclusive end of the range.
 * @param endOrOptions.step - The gap between consecutive numbers.
 * @signature
 *   range(start, end)
 *   range(start, { end, step })
 * @example
 *    range(1, 5); //=> [1, 2, 3, 4]
 *    range(1, { end: 5, step: 2 }); //=> [1, 3]
 * @dataFirst
 * @category Array
 */
export function range(
  start: number,
  endOrOptions: number | RangeOptions,
): number[];

/**
 * Returns a sequence of numbers from `start` (inclusive) to `end` (exclusive),
 * adding `step` (default is `1`) to each number in the sequence.
 *
 * @param endOrOptions - The end number **or** an object which is used to
 * **also** define a step size.
 * @param endOrOptions.end - The non-inclusive end of the range.
 * @param endOrOptions.step - The gap between consecutive numbers.
 * @signature
 *   range(end)(start)
 *   range({ end, step })(start)
 * @example
 *    pipe(1, range(5)); //=> [1, 2, 3, 4]
 *    pipe(1, range({ end: 5, step: 2 })); //=> [1, 3]
 * @dataLast
 * @category Array
 */
export function range(
  endOrOptions: number | RangeOptions,
): (start: number) => number[];

export function range(...args: readonly unknown[]): unknown {
  return purry(rangeImplementation, args);
}

function rangeImplementation(
  start: number,
  endOrOptions: number | RangeOptions,
): number[] {
  const step =
    typeof endOrOptions === "object" ? endOrOptions.step : DEFAULT_STEP;
  if (step === 0) {
    throw new RangeError("range: step cannot be zero (0)!");
  }

  const end =
    typeof endOrOptions === "object" ? endOrOptions.end : endOrOptions;
  const length = ceilingWithSnap((end - start) / step);
  if (length <= 0) {
    return [];
  }

  if (length === Infinity) {
    throw new RangeError("range: only finite ranges are supported!");
  }

  return Array.from({ length }, (_, i) => (i === 0 ? start : start + i * step));
}

// JS's floating-point math can create numbers that are slightly larger than
// the true mathematical result (e.g. `0.1 + 0.2 > 0.3`). This error would
// propagate into more complex calculations, and specifically can cause
// the built-in `Math.ceil` to round up a number that is effectively an
// integer (e.g. `Math.ceil(0.1 + 0.2 - 0.3) === 1`). To work around this we
// need an error margin where ceiling would ignore very small floating point
// artifacts so that it effectively "rounds" down instead of up.
function ceilingWithSnap(raw: number): number {
  const rounded = Math.round(raw);
  return Math.abs(raw - rounded) / Math.max(1, Math.abs(rounded)) <
    SNAP_TOLERANCE
    ? rounded
    : Math.ceil(raw);
}
