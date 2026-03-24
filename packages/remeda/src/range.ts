import { purry } from "./purry";

const DEFAULT_STEP = 1;

type RangeOptions = {
  readonly end: number;
  readonly step?: number;
};

/**
 * Returns a sequence of numbers from `start` (inclusive) to `end` (exclusive)
 * of a given `step` size.
 *
 * @param start - The start number.
 * @param endOrOptions - The end number or an object which also defines a step
 * size.
 * @param endOrOptions.end - The end number.
 * @param endOrOptions.step - The step number. Default is `1`.
 * @signature
 *   range(start, end)
 *   range(start, { end, step })
 * @example
 *    range(1, 5) //=> [1, 2, 3, 4]
 *    range(1, { end: 5, step: 2 }); //=> [1, 3]
 * @dataFirst
 * @category Array
 */
export function range(
  start: number,
  endOrOptions: number | RangeOptions,
): number[];

/**
 * Returns a sequence of numbers from `start` (inclusive) to `end` (exclusive)
 * of a given `step` size.
 *
 * @param endOrOptions - The end number or an object which also defines a step
 * size.
 * @param endOrOptions.end - The end number.
 * @param endOrOptions.step - The step number. Default is `1`.
 * @signature
 *   range(end)(start)
 *   range({ end, step })(start)
 * @example
 *    pipe(1, range(5)) //=> [1, 2, 3, 4]
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
  const { end, step = DEFAULT_STEP } =
    typeof endOrOptions === "object" ? endOrOptions : { end: endOrOptions };

  if (start + step === start) {
    throw new RangeError(`range: step of '${step.toString()}' is not allowed.`);
  }

  return Array.from(
    { length: Math.max(0, Math.ceil((end - start) / step)) },
    (_, i) => start + i * step,
  );
}
