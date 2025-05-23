/**
 * We built our own version of Subtract instead of using type-fest's one
 * because we needed a simpler implementation that isn't as prone to excessive
 * recursion issues and that is clamped at 0 so that we don't need to handle
 * negative values using even more utilities.
 */
export type ClampedIntegerSubtract<
  Minuend,
  Subtrahend,
  SubtrahendBag extends Array<unknown> = [],
  ResultBag extends Array<unknown> = [],
> = [...SubtrahendBag, ...ResultBag]["length"] extends Minuend
  ? // than Minuend, or 0 if it is larger (or equal).
    ResultBag["length"]
  : SubtrahendBag["length"] extends Subtrahend
    ? // "removing" items from Minuend and we now start "counting up" from 0 the
      // remainder via the ResultBag.
      ClampedIntegerSubtract<
        Minuend,
        Subtrahend,
        SubtrahendBag,
        [...ResultBag, unknown]
      >
    : // allows us to "skip" items while we count up to Minuend.
      ClampedIntegerSubtract<
        Minuend,
        Subtrahend,
        [...SubtrahendBag, unknown],
        ResultBag
      >;
