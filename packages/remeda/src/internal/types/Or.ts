/**
 * Returns a boolean for whether **any** element of a tuple of booleans is
 * `true` (logical OR). Pass the operands as a tuple: `Or<[A, B, C]>`. `Or<[]>`
 * is `false`. This is a variadic, lightweight drop-in for type-fest's `OrAll`.
 *
 * We don't use type-fest's `OrAll` (which `Or` delegates to) because it is built
 * on a general `SomeExtend` machine whose module carries a large fixed
 * type-instantiation cost (~9.8k just to import and use it once, measured via
 * `tsc --extendedDiagnostics`) that is paid at every downstream consumer's call
 * site. Recursing element-by-element and checking each as a naked type parameter
 * keeps the cost to a handful of instantiations while still distributing
 * correctly over `boolean` (e.g. `Or<[false, boolean]>` is `boolean`) and
 * handling `any`, matching type-fest for every operand Remeda passes (resolved
 * or deferred boolean predicates). The only divergence is `never`: type-fest
 * treats it as `false`, whereas here it short-circuits the whole result to
 * `never`. Remeda never feeds `never` to a boolean predicate, and handling it
 * would forfeit the `boolean` distribution above, which is what matters here.
 */
export type Or<T extends readonly boolean[]> = T extends readonly [
  infer Head extends boolean,
  ...infer Rest extends readonly boolean[],
]
  ? Head extends true
    ? true
    : Or<Rest>
  : false;
