import { type IfNever, type Simplify } from "type-fest";
import {
  type EnumerableStringKeyOf,
  type EnumerableStringKeyedValueOf,
  type IfSimpleRecord,
  type ReconstructedRecord,
} from "./internal/types";
import { purry } from "./purry";

// Because pickBy needs to iterate over all entries of the object, only
// enumerable keys (those returned by `Object.entries`) could be part of the
// output object. Any symbol keys would be skipped and filtered out.
type EnumerableKey<T> = `${T extends number | string ? T : never}`;

// When the predicate isn't a type-guard we don't know which properties would be
// part of the output and which wouldn't so we can only safely downgrade the
// whole object to a Partial of the input.
type EnumeratedPartial<T> = Simplify<
  IfSimpleRecord<
    T,
    ReconstructedRecord<T>,
    {
      -readonly [P in keyof T as EnumerableKey<P>]?: Required<T>[P];
    }
  >
>;

// When the predicate is a type-guard we have more information to work with when
// constructing the type of the output object. We can safely remove any property
// which value would never come up true for the predicate, AND we can also
// assume that properties that match the predicate perfectly would **always**
// show up in the output object. Hence to build the output object we need to
// build and merge 2 output objects: One for the properties which have a value
// of at type that would always yield a `true` result from the predicate, these
// are the "matches", which would not change the "optionality" of the input
// object's props, and one for partial matches which would also make the props
// optional (as they could have a value that would be filtered out).
type EnumeratedPartialNarrowed<T, S> = Simplify<
  ExactProps<T, S> & PartialProps<T, S>
>;

// The exact case, props here would always be part of the output object
type ExactProps<T, S> = {
  -readonly [P in keyof T as EnumerableKey<
    IsExactProp<T, P, S> extends true ? P : never
  >]: Extract<Required<T>[P], S>;
};

// The partial case, props here might be part of the output object, but might
// not be, hence they are optional.
type PartialProps<T, S> = {
  -readonly [P in keyof T as EnumerableKey<
    IsPartialProp<T, P, S> extends true ? P : never
  >]?: IfNever<
    Extract<T[P], S>,
    // If the result of extracting S from T[P] is never but S still extends
    // it, it means that T[P] is too wide and S can't be extracted from it:
    // e.g. if T[P] is `number` S is `1` then `Extract<number, 1> === never`.
    // For these cases we can return S directly as the type as it's already
    // very narrowed compared to T[P].
    S extends T[P] ? S : never,
    Extract<T[P], S>
  >;
};

// If the input object's value type extends itself when the type-guard is
// extracted from it we can safely assume that the predicate would always return
// true for any value of that property.
type IsExactProp<T, P extends keyof T, S> =
  T[P] extends Extract<T[P], S> ? true : false;

// ...and if the input object's value type isn't an exact match, but still has
// some partial match (i.g. the extracted type-guard isn't completely disjoint)
// then we can assume that the property can sometimes return true, and sometimes
// false when passed to the predicate, hence it should be optional in the
// output.
type IsPartialProp<T, P extends keyof T, S> =
  IsExactProp<T, P, S> extends true
    ? false
    : IfNever<
        Extract<T[P], S>,
        S extends T[P]
          ? // If the result of extracting S from T[P] is never but S still
            // extends it, it means that T[P] is too wide and S can't be
            // extracted from it: e.g. if T[P] is `number` S is `1` then
            // `Extract<number, 1> === never`, but `1` extends `number`. We need
            // to handle these cases when we extract the value too (see above).
            true
          : false,
        true
      >;

/**
 * Iterates over the entries of `data` and reconstructs the object using only
 * entries that `predicate` accepts. Symbol keys are not passed to the predicate
 * and would be filtered out from the output object.
 *
 * See `omitBy` for a complementary function which starts with a shallow copy of
 * the input object and removes the entries that the predicate rejects. Because
 * it is subtractive symbol keys would be copied over to the output object.
 * See also `entries`, `filter`, and `fromEntries` which could be used to build
 * your own version of `pickBy` if you need more control (though the resulting
 * type might be less precise).
 *
 * @param data - The target object.
 * @param predicate - A function that takes the value, key, and the data itself
 * and returns true if the entry should be part of the output object, or `false`
 * to remove it. If the function is a type-guard on the value the output type
 * would be narrowed accordingly.
 * @returns A shallow copy of the input object with the rejected entries
 * removed.
 * @signature R.pickBy(data, predicate)
 * @example
 *    R.pickBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {A: 3, B: 4}
 * @dataFirst
 * @category Object
 */
export function pickBy<
  T extends object,
  S extends EnumerableStringKeyedValueOf<T>,
>(
  data: T,
  predicate: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => value is S,
): EnumeratedPartialNarrowed<T, S>;
export function pickBy<T extends object>(
  data: T,
  predicate: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => boolean,
): EnumeratedPartial<T>;

/**
 * Iterates over the entries of `data` and reconstructs the object using only
 * entries that `predicate` accepts. Symbol keys are not passed to the predicate
 * and would be filtered out from the output object.
 *
 * See `omitBy` for a complementary function which starts with a shallow copy of
 * the input object and removes the entries that the predicate rejects. Because
 * it is subtractive symbol keys would be copied over to the output object.
 * See also `entries`, `filter`, and `fromEntries` which could be used to build
 * your own version of `pickBy` if you need more control (though the resulting
 * type might be less precise).
 *
 * @param predicate - A function that takes the value, key, and the data itself
 * and returns true if the entry should be part of the output object, or `false`
 * to remove it. If the function is a type-guard on the value the output type
 * would be narrowed accordingly.
 * @signature
 *   R.pickBy(predicate)(data)
 * @example
 *    R.pipe({a: 1, b: 2, A: 3, B: 4}, pickBy((val, key) => key.toUpperCase() === key)); // => {A: 3, B: 4}
 * @dataLast
 * @category Object
 */
export function pickBy<
  T extends object,
  S extends EnumerableStringKeyedValueOf<T>,
>(
  predicate: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => value is S,
): (data: T) => EnumeratedPartialNarrowed<T, S>;
export function pickBy<T extends object>(
  predicate: (
    value: EnumerableStringKeyedValueOf<T>,
    key: EnumerableStringKeyOf<T>,
    data: T,
  ) => boolean,
): (data: T) => EnumeratedPartial<T>;

export function pickBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(pickByImplementation, args);
}

function pickByImplementation<T extends object>(
  data: T,
  predicate: (value: unknown, key: string, data: T) => boolean,
): Record<string, unknown> {
  const out: Partial<Record<string, unknown>> = {};

  for (const [key, value] of Object.entries(data)) {
    if (predicate(value, key, data)) {
      out[key] = value;
    }
  }

  return out;
}
