/* eslint-disable no-bitwise, @typescript-eslint/no-magic-numbers --
 * We randomize the bigint using randomized bitmaps, we have to use bitwise
 * operations to manipulate them.
 */

/**
 * Generate a random `bigint` between `from` and `to` (inclusive).
 *
 * ! Important: In most environments this function uses
 * [`crypto.getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
 * under-the-hood which **is** cryptographically strong. When the WebCrypto API
 * isn't available (Node 18) we fallback to an implementation that uses
 * [`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
 * which is **NOT** cryptographically secure.
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
    throw new RangeError(
      `randomBigInt: The range [${from.toString()},${to.toString()}] is empty.`,
    );
  }

  const range = to - from;

  // Get the max number of bits needed to encode the result. We will generate
  // this number of random bits. A radix of 2 would give us the binary
  // representation of the number.
  const { length: maxBits } = range.toString(2 /* radix */);

  // We can only generate random data in bytes, not bits, so we need to generate
  // enough bytes to cover the required number of bits.
  const maxBytes = Math.ceil(maxBits / 8);

  // The number of bits we need to ignore in the random bitmap we generate.
  const excessBits = BigInt(8 - (maxBits % 8));

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- It's more readable than using a do..while loop.
  while (true) {
    // We use `crypto` for our RNG, it should be supported in all modern
    // environments we support.
    const randomBytes = random(maxBytes);

    const raw = asBigInt(randomBytes);

    // Shift the number back to our range, this effectively sets the excess bits
    // to 0.
    const result = raw >> excessBits;

    // The generated number might overflow when `range < 2 ** maxBits - 1`, so
    // it can't be returned. To ensure that all possible results have the same
    // probability, we ignore the value entirely and try again (instead of
    // trying to adapt it to the output range somehow).
    if (result <= range) {
      return result + from;
    }
  }
}

function asBigInt(bytes: Iterable<number>): bigint {
  let result = 0n;
  for (const byte of bytes) {
    // We build the bigint by shifting the current value by a byte, and putting
    // the next byte in that "slot".
    result = (result << 8n) + BigInt(byte);
  }
  return result;
}

function random(numBytes: number): Uint8Array {
  const output = new Uint8Array(numBytes);

  if (typeof crypto === "undefined") {
    // Polyfill for environments without `crypto` support. The only env which
    // requires this and we support is Node 18; once we drop support for it we
    // can drop the polyfill.
    for (let index = 0; index < numBytes; index += 1) {
      output[index] = Math.floor(Math.random() * 256);
    }
  } else {
    crypto.getRandomValues(output);
  }

  return output;
}
