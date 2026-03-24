import { purry } from "./purry";

const DEFAULT_STEP = 1;

type RangeOptions = {
  readonly end: number;
  readonly step: number;
};

/**
 * Returns a sequence of numbers from `start` (inclusive) to `end` (exclusive),
 * adding `step` (default is `1`) to each number in the sequence.
 *
 * @param start - The start number.
 * @param endOrOptions - The end number or an object which also defines a step
 * size.
 * @param endOrOptions.end - The end number.
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
 * @param endOrOptions - The end number or an object which also defines a step
 * size.
 * @param endOrOptions.end - The end number.
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
  const length = Math.ceil((end - start) / step);
  if (length <= 0) {
    // The range is trivially empty!
    return [];
  }

  return Array.from({ length }, (_, i) => start + i * step);
}
