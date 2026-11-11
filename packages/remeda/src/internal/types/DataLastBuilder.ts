import type { StrictFunction } from "./StrictFunction";

/**
 * The type of a utility's data-last builder, derived from its data-first
 * implementation so the two can't drift apart: the implementation's parameters
 * after `data` become the builder's, and the builder returns a function of
 * `data`. Annotating the builder with it lets its arrow functions take their
 * parameter types from the implementation instead of restating them.
 *
 * A generic implementation's type parameters resolve to their constraints; the
 * utility's overloads carry the precise types. An implementation without
 * parameters has no data-last form, so it resolves to `never`.
 *
 * @example
 *   const dataLast: DataLastBuilder<typeof mapImplementation> =
 *     (callbackfn) => (data) =>
 *       mapImplementation(data, callbackfn);
 */
export type DataLastBuilder<F extends StrictFunction> =
  Parameters<F> extends readonly [infer Data, ...infer Rest]
    ? (...params: Rest) => (data: Data) => ReturnType<F>
    : never;
