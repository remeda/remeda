import type { NarrowedTo } from "./internal/types/NarrowedTo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Contrary to intuition, because TypeScript compares function params using contra-variance and not co-variance, in order to accept all functions we **can't** use `readonly unknown[]` because it will only accept functions with an actual variadic param. On the other hand we can't use `never` either (although `never` extends **everything** and thus would catch all cases, @see https://www.typescriptlang.org/play/?#code/C4TwDgpgBA6glsAFgJQgQwCYHsB2AbEAVRwGscsB3HAHgBUA+KAXilqggA9gIcMBnKAAoAdKLQAnAOZ8AXFHHps+EFACupclQDaAXQCUzRurKUcAKChQA-FGDjVEC1DkAzNHj4QA3GbOhIsAiIAII4IHSMLGyc3LwCImJSslBoYQZMRhqm1rb20K7unj5+4NDwSAByEABuEOIRzKzsXDz8QqLCEtJyODV16ZkmVDl2Ds5Qbh7evv7QtBB8wABi6gDGjYJoPaoAtgBG-YZQi+JwOJLFs1AAGgAMjeUoirgExEM084srOKv0PgD0-0sUAAelYZqUbgBGB5BULhT7LNZ-MyA4FgiEBa4AJlhlT69UR31+AKBljBQA) because it breaks any function that handles functions generically and that use `Parameters<F>`, because it would be converted to `never` *too early*, losing it's relation to F (similar to this issue: https://github.com/microsoft/TypeScript/issues/61750).
type StrictFunction = (...args: any) => unknown;

/**
 * A function that checks if the passed parameter is a Function and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a Function, false otherwise.
 * @signature
 *    R.isFunction(data)
 * @example
 *    R.isFunction(() => {}) //=> true
 *    R.isFunction('somethingElse') //=> false
 * @category Guard
 */
export const isFunction = <T>(
  data: StrictFunction | T,
): data is NarrowedTo<T, StrictFunction> => typeof data === "function";
