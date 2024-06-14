import { type IfNever, type Simplify } from "type-fest";
import {
  type EnumerableStringKeyOf,
  type EnumerableStringKeyedValueOf,
  type IfBoundedRecord,
  type ReconstructedRecord,
} from "./internal/types";
import { purry } from "./purry";

// Symbols are not passed to the predicate (because they can't be enumerated
// with the `Object.entries` function) and the output object is built from a
// shallow copy of the input; meaning symbols would just be passed through as-
// is.
type PickSymbolKeys<T extends object> = {
  -readonly [P in keyof T as P extends symbol ? P : never]: T[P];
};

// When we don't use a type-predicate we can't say anything about what props
// would be omitted from the output, so we need to assume any of them could be
// filtered out. This means that we effectively make all (enumerable) keys
// optional.
type PartialEnumerableKeys<T extends object> =
  // `extends unknown` is always going to be the case and is used to convert any
  // union into a [distributive conditional type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  T extends unknown
    ? Simplify<
        IfBoundedRecord<
          T,
          PickSymbolKeys<T> & {
            -readonly [P in keyof T as P extends symbol
              ? never
              : P]?: Required<T>[P];
          },
          ReconstructedRecord<T>
        >
      >
    : unknown;

// When the predicate is a type-guard we have more information to work with when
// constructing the type of the output object. We can safely remove any property
// which value would always be true for the predicate, AND we can also
// assume that properties that are rejected by the predicate perfectly would
// **always** show up in the output object. Hence to build the output object we
// need to build and merge 2 output objects: One for the properties which have a
// value of at type that would always yield a `false` result from the predicate,
// these are the "matches", which would not change the "optionality" of the
// input object's props, and one for partial matches which would also make the
// props optional (as they could have a value that would be filtered out).
type PartialEnumerableKeysNarrowed<T extends object, S> = Simplify<
  ExactProps<T, S> & PartialProps<T, S> & PickSymbolKeys<T>
>;

// The exact case, props here would always be part of the output object
type ExactProps<T, S> = {
  -readonly [P in keyof T as IsExactProp<T, P, S> extends true
    ? P
    : never]: Exclude<T[P], S>;
};

// The partial case, props here might be part of the output object, but might
// not be, hence they are optional.
type PartialProps<T, S> = {
  -readonly [P in keyof T as IsPartialProp<T, P, S> extends true
    ? P
    : never]?: Exclude<T[P], S>;
};

// If the input object's value type extends itself when the type-guard is
// excluded from it we can safely assume that the predicate would always return
// `false` for any value of that property.
type IsExactProp<T, P extends keyof T, S> = P extends symbol
  ? // Symbols are passed through via the PickSymbolKeys type
    false
  : T[P] extends Exclude<T[P], S>
    ? S extends T[P]
      ? // If S extends the T[P] it means the type the predicate is narrowing to
        // can't narrow the rejected value any further, so we can't say what
        // would happen for a concrete value in runtime (e.g. if T[P] is
        // `number` and S is `1`: `Exclude<number, 1> === number`.
        false
      : true
    : false;

// ...and if the input object's value type isn't an exact match, but still has
// some partial match (i.g. the extracted type-guard isn't completely disjoint)
// then we can assume that the property can sometimes return true, and sometimes
// false when passed to the predicate, hence it should be optional in the
// output.
type IsPartialProp<T, P extends keyof T, S> = P extends symbol
  ? // Symbols are passed through via the PickSymbolKeys type
    false
  : IsExactProp<T, P, S> extends true
    ? false
    : IfNever<Exclude<Required<T>[P], S>, false, true>;

/**
 * Creates a shallow copy of the data, and then removes any keys that the
 * predicate rejects. Symbol keys are not passed to the predicate and would be
 * passed through to the output as-is.
 *
 * See `pickBy` for a complementary function which starts with an empty object
 * and adds the entries that the predicate accepts. Because it is additive,
 * symbol keys will not be passed through to the output object.
 *
 * @param data - The target object.
 * @param predicate - A function that takes the value, key, and the data itself
 * and returns `true` if the entry shouldn't be part of the output object, or
 * `false` to keep it. If the function is a type-guard on the value the output
 * type would be narrowed accordingly.
 * @returns A shallow copy of the input object with the rejected entries
 * removed.
 * @signature R.omitBy(data, predicate)
 * @example
 *    R.omitBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {a: 1, b: 2}
 * @dataFirst
 * @category Object
 */
export function omitBy<
  T extends object,
  S extends EnumerableStringKeyedValueOf<T>,
>(
  data: T,
  predicate: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => value is S,
): PartialEnumerableKeysNarrowed<T, S>;
export function omitBy<T extends object>(
  data: T,
  predicate: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => boolean,
): PartialEnumerableKeys<T>;

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 *
 * @param predicate - The predicate.
 * @signature R.omitBy(fn)(object)
 * @example
 *    R.omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @dataLast
 * @category Object
 */
export function omitBy<
  T extends object,
  S extends EnumerableStringKeyedValueOf<T>,
>(
  predicate: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => value is S,
): (data: T) => PartialEnumerableKeysNarrowed<T, S>;
export function omitBy<T extends object>(
  predicate: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => boolean,
): (data: T) => PartialEnumerableKeys<T>;

export function omitBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(omitByImplementation, args);
}

function omitByImplementation<T extends object>(
  data: T,
  predicate: (value: unknown, key: string, data: T) => boolean,
): Record<string, unknown> {
  const out: Partial<Record<string, unknown>> = { ...data };

  for (const [key, value] of Object.entries(out)) {
    if (predicate(value, key, data)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- This is the best way to do it!
      delete out[key];
    }
  }

  return out;
}
