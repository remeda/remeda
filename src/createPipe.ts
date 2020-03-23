import { pipe } from './pipe';

/**
 * Creates a data-last pipe function. First function must be always annotated. Other functions are automatically inferred.
 * @signature
 *    R.createPipe(op1, op2, op3)(data);
 * @example
 *    R.createPipe(
 *      (x: number) => x * 2,
 *      x => x * 3
 *    )(1) // => 6
 * @category Function
 */
export function createPipe<A, B>(op1: (input: A) => B): (value: A) => B;

export function createPipe<A, B, C>(
  op1: (input: A) => B,
  op2: (input: B) => C
): (value: A) => C;

export function createPipe<A, B, C, D>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D
): (value: A) => D;

export function createPipe<A, B, C, D, E>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E
): (value: A) => E;

export function createPipe<A, B, C, D, E, F>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F
): (value: A) => F;

export function createPipe<A, B, C, D, E, F, G>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G
): (value: A) => G;

export function createPipe<A, B, C, D, E, F, G, H>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H
): (value: A) => H;

export function createPipe(...operations: ReadonlyArray<(input: any) => any>) {
  return (value: any) => (pipe as any)(value, ...operations);
}
