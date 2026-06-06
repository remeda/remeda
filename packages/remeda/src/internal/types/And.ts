/**
 * Returns a boolean for whether **every** element of a tuple of booleans is
 * `true` (logical AND). Pass the operands as a tuple: `And<[A, B, C]>`.
 * `And<[]>` is `true`. This is a variadic, lightweight drop-in for type-fest's
 * `AndAll`.
 *
 * See `Or` (`./Or.ts`) for the full rationale: type-fest's `AndAll` is built on
 * a general machine whose module carries a large fixed type-instantiation cost
 * (~9.8k, measured) paid at every consumer's call site. Recursing element-by-
 * element and checking each as a naked type parameter keeps the cost to a
 * handful of instantiations while still distributing correctly over `boolean`
 * and handling `any`, matching type-fest for every operand Remeda passes. The
 * only divergence is `never` (short-circuits to `never` rather than being
 * treated as `false`), which Remeda never passes to a boolean predicate.
 */
export type And<T extends readonly boolean[]> = T extends readonly [
  infer Head extends boolean,
  ...infer Rest extends readonly boolean[],
]
  ? Head extends false
    ? false
    : And<Rest>
  : true;
