import type { IsAny, IsNever } from "type-fest";

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

// Records keyed with generic `string` and `number` have different semantics
// to those with a a union of literal values (e.g. 'cat' | 'dog') when using
// 'noUncheckedIndexedAccess', the former being implicitly `Partial` whereas
// the latter are implicitly `Required`.
// TODO: Support template string literals (e.g. `prefix_${number}`)
export type ExactRecord<Key extends PropertyKey, Value> =
  // If either string, number or symbol extend Key it means that Key is at least
  // as wide as them, so we don't need to wrap the returned record with Partial.
  string extends Key
    ? Record<Key, Value>
    : number extends Key
      ? Record<Key, Value>
      : // If the key is specific, e.g. 'cat' | 'dog', the result is partial
        // because we can't statically know what values the mapper would return on
        // a specific input
        Partial<Record<Key, Value>>;

export type ReorderedArray<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};

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
