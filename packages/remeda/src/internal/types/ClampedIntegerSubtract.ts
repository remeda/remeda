import type { NTuple } from "./NTuple";

/**
 * `Minuend - Subtrahend`, clamped at 0, for non-negative integer literals of
 * any size.
 *
 * The subtraction runs on the numbers' decimal digits, so its recursion depth
 * grows with the number of digits instead of with the values: counting up with
 * tuples fails with ts2589 (Type instantiation is excessively deep and possibly
 * infinite) once a value reaches 1000.
 *
 * A negative minuend results in 0, as callers only subtract lengths, which are
 * never negative. Any other input that isn't an integer literal (`number`, a
 * fraction, or a value TypeScript prints with an exponent, like `1e21`) results
 * in `number`.
 */
export type ClampedIntegerSubtract<Minuend, Subtrahend> = Minuend extends number
  ? Subtrahend extends number
    ? IsDigits<`${Subtrahend}`> extends true
      ? `${Minuend}` extends `-${string}`
        ? 0
        : IsDigits<`${Minuend}`> extends true
          ? ParseDigits<
              SubtractReversedDigits<
                ReverseString<`${Minuend}`>,
                ReverseString<`${Subtrahend}`>
              >
            >
          : number
      : number
    : never
  : never;

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type IsDigits<S extends string> = S extends `${Digit}${infer Rest}`
  ? Rest extends ""
    ? true
    : IsDigits<Rest>
  : false;

type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : "";

// Both numbers are given least significant digit first, so that borrows move
// forward with the recursion. The difference is built most significant digit
// first, and is "0" when B is larger than A.
type SubtractReversedDigits<
  A extends string,
  B extends string,
  Borrow extends readonly unknown[] = [],
  Difference extends string = "",
> = A extends `${infer DigitA extends Digit}${infer RestA}`
  ? SubtractDigit<DigitA, FirstDigit<B>, Borrow> extends [
      infer ResultDigit extends Digit,
      infer NextBorrow extends readonly unknown[],
    ]
    ? SubtractReversedDigits<
        RestA,
        OtherDigits<B>,
        NextBorrow,
        `${ResultDigit}${Difference}`
      >
    : never
  : // A has no digits left, so B is larger if it still has digits, or if the
    // last digit needed a borrow.
    B extends ""
    ? Borrow extends readonly []
      ? Difference
      : "0"
    : "0";

// Missing digits of the shorter number are zeros.
type FirstDigit<S extends string> =
  S extends `${infer First extends Digit}${string}` ? First : "0";

type OtherDigits<S extends string> = S extends `${Digit}${infer Rest}`
  ? Rest
  : "";

// Subtracts digit B and the borrow from digit A plus 10; a result of 10 or more
// means the 10 wasn't needed, so no borrow carries over to the next digit.
type SubtractDigit<
  A extends Digit,
  B extends Digit,
  Borrow extends readonly unknown[],
> = [...BaseTuple, ...DigitTuple<A>] extends [
  ...DigitTuple<B>,
  ...Borrow,
  ...infer Rest,
]
  ? Rest extends [...BaseTuple, ...infer Remainder]
    ? [`${Remainder["length"]}`, []]
    : [`${Rest["length"]}`, [unknown]]
  : never;

type DigitTuple<D extends Digit> = D extends `${infer N extends number}`
  ? NTuple<unknown, N>
  : never;

type BaseTuple = NTuple<unknown, DecimalBase>;

type DecimalBase = 10;

// Leading zeros (from digits that cancelled out) are dropped before parsing,
// because TypeScript only infers a number from its canonical string.
type ParseDigits<S extends string> =
  S extends `0${infer Rest extends `${Digit}${string}`}`
    ? ParseDigits<Rest>
    : S extends `${infer N extends number}`
      ? N
      : never;
