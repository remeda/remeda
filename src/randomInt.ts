import type { IntRange, GreaterThan, LessThan } from "type-fest";

type RandomInt<From extends number, To extends number> =
  IsFloat<From> extends true
    ? number
    : IsFloat<To> extends true
      ? number
      : GreaterThan<From, To> extends true
        ? never
        : GreaterThan<From, 0> extends true
          ? LessThan<To, 1000> extends true
            ? // type-fest's `InRange` supports only numbers between 0 and 1000 (exclusive)
              IntRange<From, To> | To
            : number
          : number;

type IsFloat<T extends number> = `${T}` extends `${number}.${number}`
  ? true
  : false;

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
  if (to < from) {
    throw new RangeError(
      `randomInt: to(${to}) should be greater than from(${from})`,
    );
  }

  const fromCeiled = Math.ceil(from);
  const toFloored = Math.floor(to);

  return Math.floor(
    Math.random() * (toFloored - fromCeiled + 1) + fromCeiled,
  ) as RandomInt<From, To>;
}
