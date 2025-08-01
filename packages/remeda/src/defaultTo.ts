import type { IsEqual } from "type-fest";
import type { If } from "./internal/types/If";
import { purry } from "./purry";
import type { RemedaTypeError } from "./internal/types/RemedaTypeError";

type FallbackOf<T> = If<
  IsEqual<T, NonNullable<T>>,
  RemedaTypeError<
    "defaultTo",
    "no unnecessary fallback",
    {
      // The type for the fallback is `never` because it will never be used ;)
      type: never;
      metadata: T;
    }
  >,
  T
>;

/**
 * A stricter wrapper around the [Nullish coalescing operator `??`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
 * that ensures that the fallback matches the type of the data. Only works
 * when data can be `null` or `undefined`.
 *
 * Notice that `Number.NaN` is not nullish and would not result in returning the
 * fallback!
 *
 * @param data - A nullish value.
 * @param fallback - A value of the same type as `data` that would be returned
 * when `data` is nullish.
 * @signature
 *   R.defaultTo(data, fallback);
 * @example
 *   R.defaultTo("hello" as string | undefined, "world"); //=> "hello"
 *   R.defaultTo(undefined as string | undefined, "world"); //=> "world"
 * @dataFirst
 * @category Other
 */
export function defaultTo<T, const Fallback extends FallbackOf<T>>(
  data: T,
  fallback: Fallback,
): NonNullable<T> | Fallback;

/**
 * A stricter wrapper around the [Nullish coalescing operator `??`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
 * that ensures that the fallback matches the type of the data, and that the
 * data is nullish (`null` or `undefined`).
 *
 * Notice that `Number.NaN` is not nullish and would not result in returning the
 * fallback!
 *
 * @param fallback - A value of the same type as `data` that would be returned
 * when `data` is nullish.
 * @signature
 *   R.defaultTo(fallback)(data);
 * @example
 *   R.pipe("hello" as string | undefined, R.defaultTo("world")); //=> "hello"
 *   R.pipe(undefined as string | undefined, R.defaultTo("world")); //=> "world"
 * @dataLast
 * @category Other
 */
export function defaultTo<T, const Fallback extends FallbackOf<T>>(
  fallback: Fallback,
): (data: T) => NonNullable<T> | Fallback;

export function defaultTo(...args: ReadonlyArray<unknown>): unknown {
  return purry(defaultToImplementation, args);
}

const defaultToImplementation = <T, Fallback extends FallbackOf<T>>(
  data: T,
  fallback: Fallback,
): NonNullable<T> | Fallback => data ?? fallback;
