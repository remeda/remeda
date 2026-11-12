import type { EnumerableStringKeyOf } from "./EnumerableStringKeyOf";
import type { EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf";

/**
 * The callback for each enumerable string-keyed entry of an object, the ones
 * `Object.entries` lists.
 *
 * @see ArrayCallback
 */
export type ObjectCallback<T extends object = object, R = unknown> = (
  value: EnumerableStringKeyedValueOf<T>,
  key: EnumerableStringKeyOf<T>,
  data: T,
) => R;

/**
 * Helper type for object type predicates (because TypeScript doesn't support a
 * syntax like `ObjectCallback<T, is S>`).
 */
export type ObjectTypePredicate<
  T extends object,
  S extends EnumerableStringKeyedValueOf<T>,
> = (
  value: EnumerableStringKeyedValueOf<T>,
  key: EnumerableStringKeyOf<T>,
  data: T,
) => value is S;
