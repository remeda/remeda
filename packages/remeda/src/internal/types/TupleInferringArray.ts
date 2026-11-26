/**
 * A readonly array of `T` for constraining a type parameter inferred from array
 * data, when the result's type depends on the data's tuple shape. Its
 * `readonly []` member makes TypeScript infer an array literal argument as a
 * tuple (`[number, number]`, not `number[]`), keeping its length and the type
 * at each position; arguments that aren't literals keep their declared type.
 *
 * Constrain with `readonly unknown[]` when the result only depends on the item
 * type: tuple inference skips the normalization TypeScript applies to array
 * literals, so an inline array of differently-shaped objects infers as
 * `[{ a: number }, { a: number; b: string }]` instead of
 * `({ a: number; b?: never } | { a: number; b: string })[]`, and a callback
 * can't read `b` from its items.
 *
 * @example
 *   function map<T extends TupleInferringArray, U>(
 *     data: T,
 *     callbackfn: ArrayCallback<T, U>,
 *   ): Mapped<T, U>;
 * @see The type definition of `Promise.all`, which uses the same constraint (https://github.com/microsoft/TypeScript/blob/1df5717b120cddd325deab8b0f2b2c3eecaf2b01/src/lib/es2015.promise.d.ts#L21)
 */
export type TupleInferringArray<T = unknown> = readonly T[] | readonly [];
