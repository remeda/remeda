import type {
  GreaterThan,
  GreaterThanOrEqual,
  IntRange,
  IsEqual,
  IsNever,
  NonNegativeInteger,
  Or,
} from "type-fest";

// This limitation is defined by type-fest
type MaxLiteral = 1000;

type RandomInteger<From extends number, To extends number> =
  Or<
    IsNever<NonNegativeInteger<From>>,
    IsNever<NonNegativeInteger<To>>
  > extends true
    ? number
    : IsEqual<From, To> extends true
      ? From
      : GreaterThan<From, To> extends true
        ? never
        : GreaterThanOrEqual<To, MaxLiteral> extends true
          ? number
          : // We don't use IntClosedRange from type-fest here because it runs
            // less efficiently for simple cases like this and can cause 'Type
            // instantiation is excessively deep and possibly infinite.
            // ts(2589)' errors when the integers are large (even when the
            // range itself is not).
            IntRange<From, To> | To;

/**
 * Generate a random integer between `from` and `to` (inclusive).
 *
 * !Important: This function uses [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) under-the-hood, which has two major limitations:
 * 1. It generates 2^52 possible values, so the bigger the range, the less
 * uniform the distribution of values would be, and at ranges larger than that
 * some values would never come up.
 * 2. It is not cryptographically secure and should not be used for security
 * scenarios.
 *
 * @param from - The minimum value.
 * @param to - The maximum value.
 * @returns The random integer.
 * @signature
 *   R.randomInteger(from, to)
 * @example
 *   R.randomInteger(1, 10) // => 5
 *   R.randomInteger(1.5, 2.6) // => 2
 * @dataFirst
 * @category Number
 */
export function randomInteger<From extends number, To extends number>(
  from: From,
  to: To,
): RandomInteger<From, To> {
  const fromCeiled = Math.ceil(from);
  const toFloored = Math.floor(to);

  if (toFloored < fromCeiled) {
    throw new RangeError(
      `randomInteger: The range [${from.toString()},${to.toString()}] contains no integer`,
    );
  }

  return Math.floor(
    Math.random() * (toFloored - fromCeiled + 1) + fromCeiled,
  ) as RandomInteger<From, To>;
}
