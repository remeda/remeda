import { range } from './range';

/**
 * Random a non-cryptographic random string from characters a-zA-Z0-9.
 * @param length the length of the random string
 * @signature randomString(length)
 * @example
 *    randomString(5) // => aB92J
 * @category String
 */
export function randomString(length: number) {
  const characterSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomChar = (): string =>
    // @ts-expect-error [ts2322] - We know the index will be in-range
    characterSet[Math.floor(Math.random() * characterSet.length)];

  return range(0, length).reduce(text => text + randomChar(), '');
}
