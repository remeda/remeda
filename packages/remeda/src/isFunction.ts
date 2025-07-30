import type { NarrowedTo } from "./internal/types/NarrowedTo";

// Contrary to intuition, because TypeScript compares function params using
// contra-variance and not co-variance, in order to accept any function we need
// the most "limiting" type for the argument list, and not the most permissive
// one (which would be `readonly unknown[]`); now when any function is compared
// against this signature it will always match because `never` **everything**
// extends everything!
// @see https://www.typescriptlang.org/play/?#code/C4TwDgpgBA6glsAFgJQgQwCYHsB2AbEAVRwGscsB3HAHgBUA+KAXilqggA9gIcMBnKAAoAdKLQAnAOZ8AXFHHps+EFACupclQDaAXQCUzRurKUcAKChQA-FGDjVEC1DkAzNHj4QA3GbOhIsAiIAII4IHSMLGyc3LwCImJSslBoYQZMRhqm1rb20K7unj5+4NDwSAByEABuEOIRzKzsXDz8QqLCEtJyODV16ZkmVDl2Ds5Qbh7evv7QtBB8wABi6gDGjYJoPaoAtgBG-YZQi+JwOJLFs1AAGgAMjeUoirgExEM084srOKv0PgD0-0sUAAelYZqUbgBGB5BULhT7LNZ-MyA4FgiEBa4AJlhlT69UR31+AKBljBQA
type StrictFunction = (...args: never) => unknown;

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
