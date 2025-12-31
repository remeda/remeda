import { GreaterThan } from "type-fest";

//#region src/times.d.ts
type MAX_LITERAL_SIZE = 46;
type TimesArray<T, N extends number, Iteration extends ReadonlyArray<unknown> = []> = number extends N ? Array<T> : `${N}` extends `-${number}` ? [] : `${N}` extends `${infer K extends number}.${number}` ? TimesArray<T, K, Iteration> : GreaterThan<N, MAX_LITERAL_SIZE> extends true ? [...TimesArray<T, MAX_LITERAL_SIZE, Iteration>, ...Array<T>] : N extends Iteration["length"] ? [] : [T, ...TimesArray<T, N, [unknown, ...Iteration]>];
/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param count - A value between `0` and `n - 1`. Increments after each
 * function call.
 * @param fn - The function to invoke. Passed one argument, the current value of
 * `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @signature
 *    R.times(count, fn)
 * @example
 *    R.times(5, R.identity()); //=> [0, 1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
declare function times<T, N extends number>(count: N, fn: (index: number) => T): TimesArray<T, N>;
/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @param fn - The function to invoke. Passed one argument, the current value of
 * `n`.
 * @returns An array containing the return values of all calls to `fn`.
 * @signature
 *    R.times(fn)(count)
 * @example
 *    R.times(R.identity())(5); //=> [0, 1, 2, 3, 4]
 * @dataLast
 * @category Array
 */
declare function times<T>(fn: (index: number) => T): <N extends number>(count: N) => TimesArray<T, N>;
//#endregion
export { times as t };
//# sourceMappingURL=times-Dw6ZNK1t.d.ts.map