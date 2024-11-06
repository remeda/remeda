import type { EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf";
import type { EnumerableStringKeyOf } from "./EnumerableStringKeyOf";

/**
 * This is the type you'd get from doing:
 * `Object.fromEntries(Object.entries(x))`.
 */
export type ReconstructedRecord<T> = Record<
  EnumerableStringKeyOf<T>,
  EnumerableStringKeyedValueOf<T>
>;
