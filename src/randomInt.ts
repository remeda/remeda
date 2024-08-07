import type {
  IntRange,
  GreaterThan,
  GreaterThanOrEqual,
  Or,
  IsNever,
  NonNegativeInteger,
  IsEqual,
} from "type-fest";

type RandomInt<From extends number, To extends number> =
  Or<
    IsNever<NonNegativeInteger<From>>,
    IsNever<NonNegativeInteger<To>>
  > extends true
    ? number
    : IsEqual<From, To> extends true
      ? From
      : GreaterThan<From, To> extends true
        ? never
        : GreaterThanOrEqual<To, 1000> extends true
          ? number
          : IntRange<From, To> | To;

/**
 * Generate a random integer between `from` and `to` (inclusive).
 *
 * @param from - The minimum value.
 * @param to - The maximum value.
 * @returns The random integer.
 * @signature
 *   R.randomInt(from, to)
 * @example
 *   R.randomInt(1, 10) // => 5
 *   R.randomInt(1.5, 1.6) // => 1
 * @dataFirst
 * @category Number
 */
export function randomInt<From extends number, To extends number>(
  from: From,
  to: To,
): RandomInt<From, To> {
  const fromCeiled = Math.ceil(from);
  const toFloored = Math.floor(to);

  if (toFloored < fromCeiled) {
    throw new RangeError(
      `randomInt: The range [${from},${to}] contains no integer`,
    );
  }

  return Math.floor(
    Math.random() * (toFloored - fromCeiled + 1) + fromCeiled,
  ) as RandomInt<From, To>;
}
