/* eslint-disable no-bitwise --
 * We randomize the bigint using randomized bitmaps, we have to use bitwise
 * operations to manipulate them.
 */

/**
 * Generate a random `bigint` between `from` and `to` (inclusive).
 *
 * This function uses [`crypto.getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) under-the-hood; it **is** cryptographically strong.
 *
 * @param from - The minimum value.
 * @param to - The maximum value.
 * @returns The random integer.
 * @signature
 *   R.randomBigInt(from, to)
 * @example
 *   R.randomBigInt(1n, 10n) // => 5n
 * @dataFirst
 * @category Number
 */
export function randomBigInt(from: bigint, to: bigint): bigint {
  if (to < from) {
    throw new RangeError(`randomBigInt: The range [${from},${to}] is empty.`);
  }

  return randomBigIntImplementation(to - from) + from;
}

function randomBigIntImplementation(max: bigint): bigint {
  // Get the max number of bits needed to encode the result. We will generate
  // this number of random bits. A radix of 2 would give us the binary
  // representation of the number.
  const { length: maxBits } = max.toString(2 /* radix */);

  // We can only generate random data in bytes, not bits, so we need to generate
  // enough bytes to cover the required number of bits.
  const maxBytes = Math.ceil(maxBits / 8);

  // The number of bits we need to ignore in the random bitmap we generate.
  const excessBits = BigInt(8 - (maxBits % 8));

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition -- It's easier to read this way than to use a do..while loop.
  while (true) {
    // We use `crypto` for our RNG, it should be supported in all modern
    // environments we support.
    const randomBytes = crypto.getRandomValues(new Uint8Array(maxBytes));

    const raw = asBigInt(randomBytes);

    // Shift the number back to our range, this effectively sets the excess bits
    // to 0.
    const result = raw >> excessBits;

    // The generated number might overflow if `max < 2 ** maxBits - 1` and can't
    // be returned. To ensure that all possible results have the same
    // probability, we ignore the value and try again.
    if (result <= max) {
      return result;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- It's not easy to make it readonly
function asBigInt(bytes: Uint8Array): bigint {
  let result = 0n;
  for (const byte of bytes) {
    result = (result << 8n) + BigInt(byte);
  }
  return result;
}
