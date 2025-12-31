//#region src/internal/types/ClampedIntegerSubtract.d.ts
/**
 * We built our own version of Subtract instead of using type-fest's one
 * because we needed a simpler implementation that isn't as prone to excessive
 * recursion issues and that is clamped at 0 so that we don't need to handle
 * negative values using even more utilities.
 */
type ClampedIntegerSubtract<Minuend, Subtrahend, SubtrahendBag extends Array<unknown> = [], ResultBag extends Array<unknown> = []> = [...SubtrahendBag, ...ResultBag]["length"] extends Minuend ? ResultBag["length"] : SubtrahendBag["length"] extends Subtrahend ? ClampedIntegerSubtract<Minuend, Subtrahend, SubtrahendBag, [...ResultBag, unknown]> : ClampedIntegerSubtract<Minuend, Subtrahend, [...SubtrahendBag, unknown], ResultBag>;
//#endregion
export { ClampedIntegerSubtract as t };
//# sourceMappingURL=ClampedIntegerSubtract-RjA0M8T2.d.ts.map