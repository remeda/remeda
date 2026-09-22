declare const VALUE: unique symbol;

/**
 * Some exotic types require to go through boxing the value to circumvent
 * TypeScript eagerly narrowing trivial values out, like `never`.
 *
 * @example
 *   Boxed.Extract<
 *     UnionToIntersection<
 *       T extends unknown
 *         ? IsSomething<T> extends true
 *           ? Boxed<T>
 *           : never
 *         : never
 *     >
 *   >
 */
export type Boxed<T = unknown> = { readonly [VALUE]: T };

// eslint-disable-next-line @typescript-eslint/no-namespace -- This is a neat hack to keep both types strictly coupled.
export namespace Boxed {
  export type Extract<T extends Boxed> = T[typeof VALUE];
}
