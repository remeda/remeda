// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- Intentional! `piped` is built *around* `pipe`.
import { pipe } from "./pipe";

/**
 * Data-last version of `pipe`. See `pipe` documentation for full details.
 *
 * Use `piped` when you need to pass a transformation as a callback to
 * functions like `map` and `filter`, where the data type can be inferred
 * from the call site.
 *
 * IMPORTANT: `piped` doesn't work for defining standalone functions stored for
 * later (`const process = piped(...)`): without a contextual type, TypeScript
 * can't infer the input data type unless every function in the pipe gets
 * explicit type params. Instead, define the function explicitly and use `pipe`
 * in its implementation.
 *
 * @signature
 *    piped(...functions)(data);
 * @example
 *    map(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }],
 *      piped(prop('a'), add(1)),
 *    ); //=> [2, 3, 4]
 * @dataLast
 * @category Function
 */
export function piped<A>(): (data: A) => A;

export function piped<A, B>(funcA: (input: A) => B): (data: A) => B;

export function piped<A, B, C>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
): (data: A) => C;

export function piped<A, B, C, D>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
): (data: A) => D;

export function piped<A, B, C, D, E>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
): (data: A) => E;

export function piped<A, B, C, D, E, F>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
): (data: A) => F;

export function piped<A, B, C, D, E, F, G>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
): (data: A) => G;

export function piped<A, B, C, D, E, F, G, H>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
): (data: A) => H;

export function piped<A, B, C, D, E, F, G, H, I>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
): (data: A) => I;

export function piped<A, B, C, D, E, F, G, H, I, J>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
): (data: A) => J;

export function piped<A, B, C, D, E, F, G, H, I, J, K>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
): (data: A) => K;

export function piped<A, B, C, D, E, F, G, H, I, J, K, L>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
): (data: A) => L;

export function piped<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
  funcL: (input: L) => M,
): (data: A) => M;

export function piped<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
  funcL: (input: L) => M,
  funcM: (input: M) => N,
): (data: A) => N;

export function piped<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
  funcL: (input: L) => M,
  funcM: (input: M) => N,
  funcN: (input: N) => O,
): (data: A) => O;

export function piped<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  funcA: (input: A) => B,
  funcB: (input: B) => C,
  funcC: (input: C) => D,
  funcD: (input: D) => E,
  funcE: (input: E) => F,
  funcF: (input: F) => G,
  funcG: (input: G) => H,
  funcH: (input: H) => I,
  funcI: (input: I) => J,
  funcJ: (input: J) => K,
  funcK: (input: K) => L,
  funcL: (input: L) => M,
  funcM: (input: M) => N,
  funcN: (input: N) => O,
  funcO: (input: O) => P,
): (data: A) => P;

export function piped(...functions: readonly ((input: unknown) => unknown)[]) {
  return (value: unknown): unknown =>
    pipe(
      value,
      // @ts-expect-error [ts2556] - We can't avoid this error because pipe is typed for users and this is an internal function
      ...functions,
    );
}
