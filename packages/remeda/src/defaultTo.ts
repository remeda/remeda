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
  NonNullable<T>
>;

export function defaultTo<T, Fallback extends FallbackOf<T>>(
  data: T,
  fallback: Fallback,
): NonNullable<T> | Fallback;

export function defaultTo<T, Fallback extends FallbackOf<T>>(
  fallback: Fallback,
): (data: T) => NonNullable<T> | Fallback;

export function defaultTo(...args: ReadonlyArray<unknown>): unknown {
  return purry(defaultToImplementation, args);
}

function defaultToImplementation<T, Fallback extends FallbackOf<T>>(
  data: T,
  fallbackData: Fallback,
): NonNullable<T> | Fallback {
  return data ?? fallbackData;
}
