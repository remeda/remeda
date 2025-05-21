import type {
  IsNumericLiteral,
  IsStringLiteral,
  IsSymbolLiteral,
  KeysOfUnion,
  Or,
  Split,
} from "type-fest";

/**
 * Check if a type is guaranteed to be a bounded record: a record with a finite
 * set of keys.
 *
 * @example
 *   IfBoundedRecord<{ a: 1, 1: "a" }>; //=> true
 *   IfBoundedRecord<Record<string | number, unknown>>; //=> false
 *   IfBoundedRecord<Record<`prefix_${number}`, unknown>>; //=> false
 */
export type IfBoundedRecord<T, WhenTrue = true, WhenFalse = false> =
  IsBounded<KeysOfUnion<T>> extends true ? WhenTrue : WhenFalse;

/**
 * Checks if a type is a bounded key: a union of bounded strings, numeric
 * literals, or symbol literals.
 */
type IsBounded<T> =
  // We distribute unions to allow iterating over each value separately.
  T extends unknown
    ? IsStringLiteral<T> extends true
      ? IsBoundedString<T>
      : Or<IsNumericLiteral<T>, IsSymbolLiteral<T>>
    : never;

/**
 * Checks if a type is a bounded string: a type that only has a finite
 * number of strings that are that type.
 *
 * Most relevant for template literals: IsBoundedString<`${1 | 2}_${3 | 4}`> is
 * true, and IsBoundedString<`${1 | 2}_${number}`> is false.
 */
type IsBoundedString<T> = T extends string
  ? // (T[number] alone doesn't work because that's just string.)
    Split<T, "">[number] extends infer U
    ? // string. Otherwise, we assume it's bounded.
      [`${number}`] extends [U]
      ? false
      : [string] extends [U]
        ? false
        : true
    : false
  : false;
