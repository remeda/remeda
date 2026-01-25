import { purry } from "./purry";

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 *
 * @param start - The start number.
 * @param end - The end number.
 * @signature range(start, end)
 * @example
 *    R.range(1, 5) // => [1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
export function range(start: number, end: number): number[];

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive) with a step.
 *
 * @param start - The start number.
 * @param end - The end number.
 * @param step - The step increment (default: 1).
 * @signature range(start, end, step)
 * @example
 *    R.range(1, 20, 5) // => [1, 6, 11, 16]
 * @dataFirst
 * @category Array
 */
export function range(start: number, end: number, step: number): number[];

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 *
 * @param end - The end number.
 * @signature range(end)(start)
 * @example
 *    R.range(5)(1) // => [1, 2, 3, 4]
 * @dataLast
 * @category Array
 */
export function range(end: number): (start: number) => number[];

export function range(...args: readonly unknown[]): unknown {
  // Handle step parameter: if 3 args, use step; if 2 args, default step to 1
  if (args.length === 3) {
    return rangeImplementation(
      args[0] as number,
      args[1] as number,
      args[2] as number,
    );
  }
  if (args.length === 2) {
    return purry(
      (start: number, end: number) => rangeImplementation(start, end, 1),
      args,
    );
  }
  if (args.length === 1) {
    return purry(
      (start: number, end: number) => rangeImplementation(start, end, 1),
      args,
    );
  }
  throw new Error("Wrong number of arguments");
}

function rangeImplementation(
  start: number,
  end: number,
  step: number,
): number[] {
  if (step === 0) {
    throw new Error("Step cannot be zero");
  }
  const ret: number[] = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      ret.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      ret.push(i);
    }
  }
  return ret;
}
