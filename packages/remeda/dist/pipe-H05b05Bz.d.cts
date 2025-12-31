//#region src/pipe.d.ts
/**
 * Performs left-to-right function composition, passing data through functions
 * in sequence. Each function receives the output of the previous function,
 * creating a readable top-to-bottom data flow that matches how the
 * transformation is executed. This enables converting deeply nested function
 * calls into clear, sequential steps without temporary variables.
 *
 * When consecutive functions with a `lazy` tag (e.g., `map`, `filter`, `take`,
 * `drop`, `forEach`, etc...) are used together, they process data item-by-item
 * rather than creating intermediate arrays. This enables early termination
 * when only partial results are needed, improving performance for large
 * datasets and expensive operations.
 *
 * Functions are only evaluated lazily when their data-last form is used
 * directly in the pipe. To disable lazy evaluation, use data-first calls via
 * arrow functions: `($) => map($, callback)` instead of `map(callback)`.
 *
 * Any function can be used in pipes, not just Remeda utilities. For creating
 * custom functions with currying and lazy evaluation support, see the `purry`
 * utility.
 *
 * A "headless" variant `piped` is available for creating reusable pipe
 * functions without initial data.
 *
 * IMPORTANT: During lazy evaluation, callbacks using the third parameter (the
 * input array) receive only items processed up to that point, not the complete
 * array.
 *
 * @param data - The input data.
 * @param functions - A sequence of functions that take one argument and
 * return a value.
 * @signature
 *   R.pipe(data, ...functions);
 * @example
 *    R.pipe([1, 2, 3], R.map(R.multiply(3))); //=> [3, 6, 9]
 *
 *    // = Early termination with lazy evaluation =
 *    R.pipe(
 *      hugeArray,
 *      R.map(expensiveComputation),
 *      R.filter(complexPredicate),
 *      // Only processes items until 2 results are found, then stops.
 *      // Most of hugeArray never gets processed.
 *      R.take(2),
 *    );
 *
 *    // = Custom logic within a pipe =
 *    R.pipe(
 *      input,
 *      R.toLowerCase(),
 *      normalize,
 *      ($) => validate($, CONFIG),
 *      R.split(","),
 *      R.unique(),
 *    );
 *
 *    // = Migrating nested transformations to pipes =
 *    // Nested
 *    const result = R.prop(
 *      R.mapValues(R.groupByProp(users, "department"), R.length()),
 *      "engineering",
 *    );
 *
 *    // Piped
 *    const result = R.pipe(
 *      users,
 *      R.groupByProp("department"),
 *      R.mapValues(R.length()),
 *      R.prop("engineering"),
 *    );
 *
 *    // = Using the 3rd param of a callback =
 *    // The following would print out `data` in its entirety for each value
 *    // of `data`.
 *    R.forEach([1, 2, 3, 4], (_item, _index, data) => {
 *      console.log(data);
 *    }); //=> "[1, 2, 3, 4]" logged 4 times
 *
 *    // But with `pipe` data would only contain the items up to the current
 *    // index
 *    R.pipe([1, 2, 3, 4], R.forEach((_item, _index, data) => {
 *      console.log(data);
 *    })); //=> "[1]", "[1, 2]", "[1, 2, 3]", "[1, 2, 3, 4]"
 * @dataFirst
 * @category Function
 */
declare function pipe<A>(data: A): A;
declare function pipe<A, B>(data: A, funcA: (input: A) => B): B;
declare function pipe<A, B, C>(data: A, funcA: (input: A) => B, funcB: (input: B) => C): C;
declare function pipe<A, B, C, D>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D): D;
declare function pipe<A, B, C, D, E>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E): E;
declare function pipe<A, B, C, D, E, F>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F): F;
declare function pipe<A, B, C, D, E, F, G>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G): G;
declare function pipe<A, B, C, D, E, F, G, H>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H): H;
declare function pipe<A, B, C, D, E, F, G, H, I>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I): I;
declare function pipe<A, B, C, D, E, F, G, H, I, J>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J): J;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K): K;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L): L;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L, funcL: (input: L) => M): M;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L, funcL: (input: L) => M, funcM: (input: M) => N): N;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L, funcL: (input: L) => M, funcM: (input: M) => N, funcN: (input: N) => O): O;
declare function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(data: A, funcA: (input: A) => B, funcB: (input: B) => C, funcC: (input: C) => D, funcD: (input: D) => E, funcE: (input: E) => F, funcF: (input: F) => G, funcG: (input: G) => H, funcH: (input: H) => I, funcI: (input: I) => J, funcJ: (input: J) => K, funcK: (input: K) => L, funcL: (input: L) => M, funcM: (input: M) => N, funcN: (input: N) => O, funcO: (input: O) => P): P;
//#endregion
export { pipe as t };
//# sourceMappingURL=pipe-H05b05Bz.d.cts.map