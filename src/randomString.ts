import { purry } from './purry';
import { range } from './range';

const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 * @param length the length of the random string
 * @returns the random string
 * @signature
 *   R.randomString(length)
 * @example
 *   R.randomString(5) // => aB92J
 * @category String
 * @dataFirst
 */
export function randomString(length: number): string;

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 * @param length the length of the random string
 * @returns the random string
 * @signature
 *   R.randomString()(length)
 * @example
 *    R.pipe(5, R.randomString()) // => aB92J
 * @category String
 * @dataLast
 */
export function randomString(): (length: number) => string;

export function randomString() {
  return purry(randomStringImplementation, arguments);
}

function randomStringImplementation(length: number) {
  const randomChar = () =>
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

  return range(0, length).reduce(text => text + randomChar(), '');
}
