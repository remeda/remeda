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

export function createPipe<A, B, C, D, E, F, G, H, I>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
  op8: (input: H) => I
): (value: A) => I;

export function createPipe<A, B, C, D, E, F, G, H, I, J>(
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
  op8: (input: H) => I,
  op9: (input: I) => J
): (value: A) => J;

export function createPipe<A, B, C, D, E, F, G, H, I, J, K>(
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K
): (value: A) => K;

export function createPipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L
): (value: A) => L;

export function createPipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M
): (value: A) => M;

export function createPipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N
): (value: A) => N;

export function createPipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
  op14: (input: N) => O
): (value: A) => O;

export function createPipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
  op14: (input: N) => O,
  op15: (input: O) => P
): (value: A) => P;

export function createPipe(...operations: ReadonlyArray<(input: any) => any>) {
  return (value: any) => (pipe as any)(value, ...operations);
}
