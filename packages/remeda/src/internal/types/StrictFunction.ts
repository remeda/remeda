/**
 * TypeScript compares function parameters using [contra-variance and not
 * co-variance](https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)#Function_types).
 * To accept all functions we **can't** use `readonly unknown[]` (which only
 * accepts functions with an actual variadic param). Instead, contrary to
 * intuition, we need to use `never` (which extends **everything!** and thus
 * would catch all cases). Another way to think about it is that a function
 * with `never` parameters is effectively un-callable, making functions that
 * take anything else callable, and thus are "extensions" of it.
 *
 * It's important to note that the resulting type is "academic", but not very
 * useful because of a known, and [reported](https://github.com/microsoft/TypeScript/issues/61750), limitation of TypeScript that stems
 * from the fact that TypeScript infers types parameterized by generic types
 * too eagerly, making it impossible to rely on parts of a generic type
 * generically too. Internally use `@ts-expect-error` in those cases and
 * explain what the expected type should have been, this is so that if the issue
 * is resolved in future versions of TypeScript we can easily find these places
 * and fix them.
 *
 * @see https://www.typescriptlang.org/play/?#code/C4TwDgpgBA6glsAFgJQgQwCYHsB2AbEAVRwGscsB3HAHgBUA+KAXilqggA9gIcMBnKAAoAdKLQAnAOZ8AXFHHps+EFACupclQDaAXQCUzRurKUcAKChQA-FGDjVEC1DkAzNHj4QA3GbOhIsAiIAII4IHSMLGyc3LwCImJSslBoYQZMRhqm1rb20K7unj5+4NDwSAByEABuEOIRzKzsXDz8QqLCEtJyODV16ZkmVDl2Ds5Qbh7evv7QtBB8wABi6gDGjYJoPaoAtgBG-YZQi+JwOJLFs1AAGgAMjeUoirgExEM084srOKv0PgD0-0sUAAelYZqUbgBGB5BULhT7LNZ-MyA4FgiEBa4AJlhlT69UR31+AKBljBQA
 */
export type StrictFunction = (...args: never) => unknown;
