import type {
  IsNumericLiteral,
  IsStringLiteral,
  IsSymbolLiteral,
  Or,
  Split,
} from "type-fest";

/**
 * Checks if a type is a bounded key: a union of bounded strings, numeric
 * literals, or symbol literals.
 */
export type IsBounded<T> =
  // `extends unknown` is always going to be the case and is used to convert any
  // union into a [distributive conditional type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  (
    T extends unknown
      ? Or<
          // String literals can still be unbounded when they are a template
          // literal containing an unbounded (non-literal) type, otherwise
          // literals are bounded because they are a finite set of values.
          IsBoundedString<T>,
          Or<IsNumericLiteral<T>, IsSymbolLiteral<T>>
        >
      : never
  ) extends true
    ? // When some parts of the union result in `true` and others in `false`
      // (e.g. `"a" | number`), when we distribute the union we would get
      // `boolean` as a result (because `true | false` === `boolean`), instead
      // of a single literal boolean value; But the union as a whole is bounded
      // only if all it's parts are bounded individually, so those cases should
      // return `false`.
      true
    : false;

/**
 * Checks if a type is a bounded string: a type that only has a finite
 * number of strings that are that type.
 *
 * Most relevant for template literals: IsBoundedString<`${1 | 2}_${3 | 4}`> is
 * true, and IsBoundedString<`${1 | 2}_${number}`> is false.
 */
type IsBoundedString<T> = T extends string
  ? IsStringLiteral<T> extends true
    ? // T[number] alone doesn't work because that's just string.
      Split<T, "">[number] extends infer U
      ? // string. Otherwise, we assume it's bounded.
        [`${number}`] extends [U]
        ? false
        : [string] extends [U]
          ? false
          : true
      : false
    : false
  : false;
