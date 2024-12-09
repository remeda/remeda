import type { IntRange } from "type-fest";

/**
 * Type fest offers IntClosedRange which is a similar offering, but is
 * implemented in a way which makes it inefficient when the Step size is '1'
 * (as in our case). Their implementation can cause ts(2589) errors ('Type
 * instantiation is excessively deep and possibly infinite') errors when the
 * integers are large (even when the range itself is not).
 */
export type IntRangeInclusive<From extends number, To extends number> =
  | IntRange<From, To>
  | To;
