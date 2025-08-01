import type { IsStringLiteral } from "type-fest";

/**
 * Returns a literal number for literal strings.
 *
 * Although TypeScript provides literal length for tuples via the `length`
 * property, it doesn't do so for strings.
 */
export type StringLength<
  S extends string,
  Characters extends ReadonlyArray<string> = [],
> =
  IsStringLiteral<S> extends true
    ? S extends `${infer Character}${infer Rest}`
      ? StringLength<Rest, [...Characters, Character]>
      : Characters["length"]
    : number;
