/**
 * A custom equality check, used in place of `===` to decide whether `a` and
 * `b` count as the same item.
 */
export type IsEqualFunction<T = unknown, S = T> = (a: T, b: S) => boolean;
