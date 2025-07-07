import type { IsStringLiteral } from "type-fest";
import type { If } from "./If";

/**
 * Returns a literal number for literal strings.
 *
 * Although TypeScript provides literal length for tuples via the `length`
 * property, it doesn't do so for strings.
 */
export type StringLength<
  S extends string,
  Characters extends ReadonlyArray<string> = [],
> = If<
  IsStringLiteral<S>,
  S extends `${infer Character}${infer Rest}`
    ? StringLength<Rest, [...Characters, Character]>
    : Characters["length"],
  number
>;
