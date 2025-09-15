import { purry } from "./purry";

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * A [pseudo-random](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) [alpha-numeric](https://en.wikipedia.org/wiki/Alphanumericals)
 * [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).
 *
 * It is not [cryptographically secure](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator)!
 *
 * @param length - The length of the random string.
 * @returns The random string.
 * @signature
 *   R.randomString(length)
 * @example
 *   R.randomString(5) // => aB92J
 * @dataFirst
 * @category String
 */
export function randomString(length: number): string;

/**
 * A [pseudo-random](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) [alpha-numeric](https://en.wikipedia.org/wiki/Alphanumericals)
 * [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).
 *
 * It is not [cryptographically secure](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator)!
 *
 * @returns The random string.
 * @signature
 *   R.randomString()(length)
 * @example
 *   R.pipe(5, R.randomString()) // => aB92J
 * @dataLast
 * @category String
 */
export function randomString(): (length: number) => string;

export function randomString(...args: ReadonlyArray<unknown>): unknown {
  return purry(randomStringImplementation, args);
}

function randomStringImplementation(length: number): string {
  const out: Array<string> = [];
  for (let iteration = 0; iteration < length; iteration++) {
    const randomChar = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!;
    out.push(randomChar);
  }
  return out.join("");
}
