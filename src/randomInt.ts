/**
 * Generate a random integer between `from` and `to`.
 *
 * @param from - The minimum value.
 * @param to - The maximum value.
 * @returns The random integer.
 * @signature
 *   R.randomInt(from, to)
 *   R.randomInt(to)
 * @example
 *   R.randomInt(1, 10) // => 5
 *   R.randomInt(1n, 10n) // => 7n
 *   R.randomInt(10) // => 5
 *   R.randomInt(10n) // => 7n
 * @dataFirst
 * @category Number
 */
export function randomInt<T extends bigint | number>(
  from: T,
  to?: Widen<T>,
): Widen<T> {
  let lower: bigint | number;
  let upper: bigint | number;

  if (to === undefined) {
    lower = typeof from === "bigint" ? 0n : 0;
    upper = from;
  } else {
    lower = from;
    upper = to;
  }

  if (typeof lower === "bigint" && typeof upper === "bigint") {
    return BigInt(
      Math.floor(
        Number(upper - lower + BigInt(1)) * Math.random() + Number(lower),
      ),
    ) as never;
  }

  if (!Number.isFinite(lower)) {
    throw new TypeError(`from(${lower}) is not a finite number`);
  }

  if (!Number.isFinite(upper)) {
    throw new TypeError(`to(${upper!}) is not a finite number`);
  }

  if (!Number.isInteger(lower)) {
    throw new TypeError(`from(${lower}) is not an integer`);
  }

  if (!Number.isInteger(upper)) {
    throw new TypeError(`to(${upper}) is not an integer`);
  }

  if (upper < lower) {
    throw new RangeError(`to(${upper}) should be greater than from(${lower})`);
  }

  // Cast the values to numbers since TypeScript can't infer it properly.
  const _from = lower as number;
  const _to = upper as number;

  return Math.floor(Math.random() * (_to - _from + 1) + _from) as never;
}

type Widen<T> = T extends bigint ? bigint : number;
