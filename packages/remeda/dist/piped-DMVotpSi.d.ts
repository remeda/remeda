//#region src/piped.d.ts
/**
 * Data-last version of `pipe`. See `pipe` documentation for full details.
 *
 * Use `piped` when you need to pass a transformation as a callback to
 * functions like `map` and `filter`, where the data type can be inferred
 * from the call site.
 *
 * IMPORTANT: `piped` does not work as a "function factory" in order to create
 * standalone utility functions; because TypeScript cannot infer the input data
 * type (without requiring to explicitly define all type params for all
 * functions in the pipe). We recommend defining the function explicitly, and
 * then use `pipe` in its implementation.
 *
 * @signature
 *    R.piped(...functions)(data);
 * @example
 *    R.map(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }],
 *      R.piped(R.prop('a'), R.add(1)),
 *    ); //=> [2, 3, 4]
 * @dataLast
 * @category Function
 */
declare function piped<A>(): (data: A) => A;
declare function piped<A, B>(funcA: (input: A) => B): (data: A) => B;
declare function piped<A, B, C>(funcA: (input: A) => B, funcB: (input: B) => C): (data: A) => C;
declare function piped<A, B, C, D>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D): (data: A) => D;
declare function piped<A, B, C, D, E>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E): (data: A) => E;
declare function piped<A, B, C, D, E, F>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F): (data: A) => F;
declare function piped<A, B, C, D, E, F, G>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G): (data: A) => G;
declare function piped<A, B, C, D, E, F, G, H>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H): (data: A) => H;
declare function piped<A, B, C, D, E, F, G, H, I>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I): (data: A) => I;
declare function piped<A, B, C, D, E, F, G, H, I, J>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J): (data: A) => J;
declare function piped<A, B, C, D, E, F, G, H, I, J, K>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K): (data: A) => K;
declare function piped<A, B, C, D, E, F, G, H, I, J, K, L>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L): (data: A) => L;
declare function piped<A, B, C, D, E, F, G, H, I, J, K, L, M>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L, funcL: (input: L) => M): (data: A) => M;
declare function piped<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L, funcL: (input: L) => M, funcM: (input: M) => N): (data: A) => N;
declare function piped<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L, funcL: (input: L) => M, funcM: (input: M) => N, funcN: (input: N) => O): (data: A) => O;
declare function piped<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L, funcL: (input: L) => M, funcM: (input: M) => N, funcN: (input: N) => O, funcO: (input: O) => P): (data: A) => P;
//#endregion
export { piped as t };
//# sourceMappingURL=piped-DMVotpSi.d.ts.map