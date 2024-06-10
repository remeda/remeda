import {
  type IsAny,
  type IsLiteral,
  type IsNever,
  type IsNumericLiteral,
  type IsStringLiteral,
  type IsSymbolLiteral,
  type KeysOfUnion,
  type Simplify,
  type Split,
} from "type-fest";

declare const __brand: unique symbol;

export type Branded<T, Brand extends symbol> = T & { [__brand]: Brand };

export type NonEmptyArray<T> = [T, ...Array<T>];

export type Mapped<T extends IterableContainer, K> = {
  -readonly [P in keyof T]: K;
};

/**
 * This should only be used for defining generics which extend any kind of JS
 * array under the hood, this includes arrays *AND* tuples (of the form [x, y],
 * and of the form [x, ...y[]], etc...), and their readonly equivalent. This
 * allows us to be more inclusive to what functions can process.
 *
 * @example map<T extends ArrayLike>(items: T) { ... }
 *
 * We would've named this `ArrayLike`, but that's already used by typescript...
 * @see This was inspired by the type-definition of Promise.all (https://github.com/microsoft/TypeScript/blob/1df5717b120cddd325deab8b0f2b2c3eecaf2b01/src/lib/es2015.promise.d.ts#L21)
 */
export type IterableContainer<T = unknown> = ReadonlyArray<T> | readonly [];

/**
 * Check if a type is guaranteed to be a bounded record: a record with a fixed
 * set of keys.
 *
 * For example, a record with a union of string or number keys is unbounded,
 * and so is a record with keys like `prefix_${number}`, but a record with keys
 * like "a" | 1 is bounded.
 */
export type IfBoundedRecord<
  T,
  TypeIfBoundedRecord = true,
  TypeIfUnboundedRecord = false,
> =
  IsBoundedKey<KeysOfUnion<T>> extends true
    ? TypeIfBoundedRecord
    : TypeIfUnboundedRecord;

/**
 * Checks if a type is a bounded key: a union of bounded strings, numeric
 * literals, or symbol literals.
 */
type IsBoundedKey<T> =
  // `extends unknown` is always going to be the case and is used to convert any
  // union into a [distributive conditional type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  T extends unknown
    ? IsStringLiteral<T> extends true
      ? IsBoundedString<T>
      : IsNumericLiteral<T> extends true
        ? true
        : IsSymbolLiteral<T>
    : never;

/**
 * Checks if a type is a bounded string: a type that only has a finite
 * number of strings that are that type.
 *
 * Most relevant for template literals: IsBoundedString<`${1 | 2}_${3 | 4}`> is
 * true, and IsBoundedString<`${1 | 2}_${number}`> is false.
 */
type IsBoundedString<T> = T extends string
  ? // Let U be the union of the types of each character in T.
    // (T[number] alone doesn't work because that's just string.)
    Split<T, "">[number] extends infer U
    ? // Eliminate unbounded cases, where a character can be any number or any
      // string. Otherwise, we assume it's bounded.
      [`${number}`] extends [U]
      ? false
      : [string] extends [U]
        ? false
        : true
    : false
  : false;

/**
 * A union of all keys of T which are not symbols, and where number keys are
 * converted to strings, following the definition of `Object.keys` and
 * `Object.entries`.
 *
 * Inspired and largely copied from [`sindresorhus/ts-extras`](https://github.com/sindresorhus/ts-extras/blob/44f57392c5f027268330771996c4fdf9260b22d6/source/object-keys.ts).
 *
 * @see EnumerableStringKeyedValueOf
 */
export type EnumerableStringKeyOf<T> = `${Exclude<keyof T, symbol>}`;

/**
 * A union of all values of properties in T which are not keyed by a symbol,
 * following the definition of `Object.values` and `Object.entries`.
 */
export type EnumerableStringKeyedValueOf<T> = {
  [K in keyof T]-?: K extends symbol ? never : T[K];
}[keyof T];

/**
 * This is the type you'd get from doing:
 * `Object.fromEntries(Object.entries(x))`.
 */
export type ReconstructedRecord<T> = Record<
  EnumerableStringKeyOf<T>,
  EnumerableStringKeyedValueOf<T>
>;

/**
 * An extension of Extract for type predicates which falls back to the base
 * in order to narrow the `unknown` case.
 *
 * @example
 *   function isMyType<T>(data: T | MyType): data is NarrowedTo<T, MyType> { ... }
 */
export type NarrowedTo<T, Base> =
  Extract<T, Base> extends never
    ? Base
    : IsAny<T> extends true
      ? Base
      : Extract<T, Base>;

/**
 * A compare function that is compatible with the native `Array.sort` function.
 *
 * @returns >0 if `a` should come after `b`, 0 if they are equal, and <0 if `a` should come before `b`.
 */
export type CompareFunction<T> = (a: T, b: T) => number;

// Records with an unbounded set of keys have different semantics to those with
// a bounded set of keys when using 'noUncheckedIndexedAccess', the former
// being implicitly `Partial` whereas the latter are implicitly `Required`.
export type ExactRecord<Key extends PropertyKey, Value> = IfBoundedRecord<
  Record<Key, Value>,
  // If the key is bounded, e.g. 'cat' | 'dog', the result is partial
  // because we can't statically know what values the mapper would return on
  // a specific input.
  Partial<Record<Key, Value>>,
  // If the key is unbounded, it means that Key is at least as wide
  // as them, so we don't need to wrap the returned record with Partial.
  Record<Key, Value>
>;

export type ReorderedArray<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};

export type UpsertProp<T, K extends PropertyKey, V> = Simplify<
  // Copy any uninvolved props from the object, they are unaffected by the type.
  Omit<T, K> &
    // Rebuild the object for the rest:
    (IsSingleLiteral<K> extends true
      ? // If it's a single literal we need to remove the optionality and set
        // the value as we know this prop would be exactly this value in the
        // output.
        { -readonly [P in K]-?: V }
      : // The key is either a broad type (`string`) or union of literals
        // ('cat' | 'dog') so we can't say anything for sure, we need to narrow
        // the types of all relevant props, this has 2 parts, for props already
        // in the object this means the value _might_ change, or it might not.
        {
          -readonly [P in keyof T as P extends K ? P : never]: T[P] | V;
        } & {
          // And for new props they might have been added to the object, or they
          // might not have been, so we need to set them as optional.
          -readonly [P in K as P extends keyof T ? never : P]?: V;
        })
>;

// This type attempts to detect when a type is a single literal value (e.g.
// "cat"), and not anything else (e.g. "cat" | "dog", string, etc...)
type IsSingleLiteral<K> =
  IsLiteral<K> extends true ? (IsUnion<K> extends true ? false : true) : false;

// TODO [2024-10-01]: This type is copied from type-fest because it isn't
// exported. It's part of the "internal" types. We should check back in a while
// to see if this type is added to the public offering.
export type IsUnion<T> = InternalIsUnion<T>;
type InternalIsUnion<T, U = T> = (
  IsNever<T> extends true
    ? false
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Copy pasted from type-fest
      T extends any
      ? [U] extends [T]
        ? false
        : true
      : never
) extends infer Result
  ? // In some cases `Result` will return `false | true` which is `boolean`,
    // that means `T` has at least two types and it's a union type,
    // so we will return `true` instead of `boolean`.
    boolean extends Result
    ? true
    : Result
  : never; // Should never happen
