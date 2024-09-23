import type {
  EmptyObject,
  IfNever,
  IsAny,
  IsLiteral,
  IsNever,
  IsNumericLiteral,
  IsStringLiteral,
  IsSymbolLiteral,
  KeysOfUnion,
  Simplify,
  Split,
  Tagged,
} from "type-fest";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- This symbol should only be used for RemedaTypeError
const RemedaErrorSymbol = Symbol("RemedaError");

/**
 * Used for reporting type errors in a more useful way than `never`. Use
 * numbers for things that should never happen.
 *
 * We should only use this for types that can't return a raw `string`; we want
 * this to get caught during type-checking.
 */
export type RemedaTypeError<
  Function extends string,
  Message extends string | number,
> = Message extends string
  ? Tagged<
      typeof RemedaErrorSymbol,
      `RemedaTypeError(${Function}): ${Message}.`
    >
  : RemedaTypeError<
      Function,
      `Internal error ${Message}. Please open a GitHub issue.`
    >;

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- We want to confine the typing to a specific symbol
declare const TAG_NAME_BRANDED_RETURN: unique symbol;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- The most generic function signature requires the usage of `any` instead of `unknown`
export type BrandedReturn<F extends (...args: any) => any> = (
  ...args: Parameters<F>
) => Tagged<ReturnType<F>, typeof TAG_NAME_BRANDED_RETURN, F>;

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
 * Check if a type is guaranteed to be a bounded record: a record with a finite
 * set of keys.
 *
 * @example
 *     IfBoundedRecord<{ a: 1, 1: "a" }>; //=> true
 *     IfBoundedRecord<Record<string | number, unknown>>; //=> false
 *     IfBoundedRecord<Record<`prefix_${number}`, unknown>>; //=> false
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
export type EnumerableStringKeyOf<T> =
  Required<T> extends Record<infer K, unknown>
    ? `${Exclude<K, symbol>}`
    : never;

/**
 * A union of all values of properties in T which are not keyed by a symbol,
 * following the definition of `Object.values` and `Object.entries`.
 */
export type EnumerableStringKeyedValueOf<T> = ValuesOf<{
  [K in keyof T]-?: K extends symbol ? never : T[K];
}>;

/**
 * Extracts the value type from an object type T.
 */
type ValuesOf<T> =
  // EmptyObject is used to infer value type as never instead of unknown
  // for an empty object
  T extends EmptyObject
    ? T[keyof T]
    : T extends Record<PropertyKey, infer V>
      ? V
      : never;

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

/**
 * Extracts a type predicate from a type guard function for the first argument.
 *
 * @example
 * type TypeGuardFn = (x: unknown) => x is string;
 * type Result = GuardType<TypeGuardFn>; // `string`
 */
export type GuardType<T, Fallback = never> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't care about arguments types here
  x: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't care about arguments types here
  ...rest: any
) => x is infer U
  ? U
  : Fallback;

/**
 * An array with *exactly* N elements in it.
 *
 * Only literal N values are supported. For very large N the type might result
 * in a recurse depth error. For negative N the type would result in an infinite
 * recursion. None of these have protections because this is an internal type!
 */
export type NTuple<
  T,
  N extends number,
  Result extends Array<unknown> = [],
> = Result["length"] extends N ? Result : NTuple<T, N, [...Result, T]>;

/**
 * Takes an array and returns the types that make up its parts. The prefix is
 * anything before the rest parameter (if any), the suffix is anything after
 * the rest parameter (if any), and the item is the type of the rest parameter.
 *
 * The output could be used to reconstruct the input: `[
 *   ...TupleParts<T>["prefix"],
 *   ...Array<TupleParts<T>["item"]>,
 *   ...TupleParts<T>["suffix"],
 * ]`.
 */
export type TupleParts<
  T,
  Prefix extends Array<unknown> = [],
  Suffix extends Array<unknown> = [],
> = T extends readonly [infer Head, ...infer Tail]
  ? TupleParts<Tail, [...Prefix, Head], Suffix>
  : T extends readonly [...infer Head, infer Tail]
    ? TupleParts<Head, Prefix, [Tail, ...Suffix]>
    : T extends ReadonlyArray<infer Item>
      ? {
          prefix: Prefix;
          item: Item;
          suffix: Suffix;
        }
      : never;

/**
 * `never[]` and `[]` are not the same type, and in some cases they aren't
 * interchangeable.
 *
 * This type makes it easier to use the result of TupleParts when the input is a
 * fixed-length tuple but we still want to spread the rest of the array. e.g.
 * `[...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]]`.
 *
 */
export type CoercedArray<T> = IfNever<T, [], Array<T>>;

/**
 * The result of running a function that would dedupe an array (`unique`,
 * `uniqueBy`, and `uniqueWith`).
 *
 * There are certain traits of the output which are unique to a deduped array
 * that allow us to create a better type; see comments inline.
 *
 * !Note: We can build better types for each of the unique functions
 * _separately_ by taking advantage of _other_ characteristics that are unique
 * to each one (e.g. in `unique` we know that each item that has a disjoint type
 * to all previous items would be part of the output, even when it isn't the
 * first), but to make this utility the most useful we kept it simple and
 * generic for now.
 */
export type Deduped<T extends IterableContainer> = T extends readonly []
  ? // An empty input is an empty output.
    []
  : T extends readonly [infer Head, ...infer Rest]
    ? // The first item in the array is always part of the output, if our array
      // has a first item, we can copy it over. The rest of the array is made of
      // whatever comes after that item.
      [Head, ...Array<Rest[number]>]
    : T extends readonly [...Array<unknown>, unknown]
      ? // If we don't know what the first item is, but we know that the array
        // is non empty, we can at least say that the output is non-empty as
        // well.
        NonEmptyArray<T[number]>
      : // If it's just a simple array the output is one too.
        Array<T[number]>;
