import { purry } from "./purry";
import { times } from "./times";

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 *
 * @param length - The length of the random string.
 * @returns The random string.
 * @signature
 *   R.randomString(length)
 * @example
 *   R.randomString(5) // => aB92J
 *   R.pipe(5, R.randomString) // => aB92J
 * @dataFirst
 * @category String
 */
export function randomString(length: number): string;

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 *
 * @returns The random string.
 * @signature
 *   R.randomString()(length)
 * @example
 *    R.pipe(5, R.randomString()) // => aB92J
 * @dataLast
 * @category String
 */
// TODO: Add this back when we deprecate headless calls in V2 of Remeda. Currently the dataLast overload breaks the typing for the headless version of the function, which is used widely in the wild.
// export function randomString(): (length: number) => string;

export function randomString(): unknown {
  return purry(randomStringImplementation, arguments);
}

function randomStringImplementation(length: number): string {
  return times(length, randomChar).join("");
}

const randomChar = (): string =>
  ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!;
