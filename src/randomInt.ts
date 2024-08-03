/**
 * Generate an inclusive random integer between `from` and `to`.
 *
 * @param from - The minimum value.
 * @param to - The maximum value.
 * @returns The random integer.
 * @signature
 *   R.randomInt(from, to)
 * @example
 *   R.randomInt(1, 10) // => 5
 *   R.randomInt(1n, 10n) // => 7n
 * @dataFirst
 * @category Number
 */
export function randomInt<T extends bigint | number>(
  from: T,
  to: Widen<T>,
): Widen<T> {
  if (to <= from) {
    throw new RangeError(`to(${to}) should be greater than from(${from})`);
  }

  if (typeof from === "bigint" && typeof to === "bigint") {
    return BigInt(
      Math.floor(Number(to - from + BigInt(1)) * Math.random() + Number(from)),
    ) as never;
  }

  if (!Number.isFinite(from)) {
    throw new TypeError(`from(${from}) is not a finite number`);
  }

  if (!Number.isFinite(to)) {
    throw new TypeError(`to(${to}) is not a finite number`);
  }

  if (!Number.isInteger(from)) {
    throw new TypeError(`from(${from}) is not an integer`);
  }

  if (!Number.isInteger(to)) {
    throw new TypeError(`to(${to}) is not an integer`);
  }

  // Cast the values to numbers since TypeScript can't infer it properly.
  const _from = from as number;
  const _to = to as number;

  return Math.floor(Math.random() * (_to - _from + 1) + _from) as never;
}

type Widen<T> = T extends bigint ? bigint : number;
