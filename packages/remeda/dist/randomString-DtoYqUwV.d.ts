//#region src/randomString.d.ts
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
declare function randomString(length: number): string;
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
declare function randomString(): (length: number) => string;
//#endregion
export { randomString as t };
//# sourceMappingURL=randomString-DtoYqUwV.d.ts.map