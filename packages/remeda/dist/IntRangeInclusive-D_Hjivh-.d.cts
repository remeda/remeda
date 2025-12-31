import { IntRange } from "type-fest";

//#region src/internal/types/IntRangeInclusive.d.ts

/**
 * Type fest offers IntClosedRange which is a similar offering, but is
 * implemented in a way which makes it inefficient when the Step size is '1'
 * (as in our case). Their implementation can cause ts(2589) errors ('Type
 * instantiation is excessively deep and possibly infinite') errors when the
 * integers are large (even when the range itself is not).
 */
type IntRangeInclusive<From extends number, To extends number> = IntRange<From, To> | To;
//#endregion
export { IntRangeInclusive as t };
//# sourceMappingURL=IntRangeInclusive-D_Hjivh-.d.cts.map