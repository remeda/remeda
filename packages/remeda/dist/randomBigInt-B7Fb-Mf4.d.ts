//#region src/randomBigInt.d.ts
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
declare function randomBigInt(from: bigint, to: bigint): bigint;
//#endregion
export { randomBigInt as t };
//# sourceMappingURL=randomBigInt-B7Fb-Mf4.d.ts.map