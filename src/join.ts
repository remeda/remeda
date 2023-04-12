import { IterableContainer } from './_types';
import { purry } from './purry';

type Joinable = bigint | boolean | number | string | null | undefined;

type Joined<T extends IterableContainer, Glue extends string> =
  // Empty tuple
  T[number] extends never
    ? ''
    : // Single Item tuple
    T extends readonly [infer Only]
    ? JoinedValue<Only>
    : // Tuple with non-rest element (head)
    T extends readonly [infer First, ...infer Tail]
    ? `${JoinedValue<First>}${Glue}${Joined<Tail, Glue>}`
    : // Tuple with non-rest element (tail)
    T extends readonly [...infer Head, infer Last]
    ? `${Joined<Head, Glue>}${Glue}${JoinedValue<Last>}`
    : // Arrays and tuple rest-elements, we can't say anything about the output
      string;

type JoinedValue<V> =
  // `undefined` and `null` are special-cased by join, a regular cast to string
  // would result in the strings 'undefined' and 'null', but join returns an
  // empty strings instead.
  undefined extends V
    ? ''
    : null extends V
    ? ''
    : V extends NonNullable<Joinable>
    ? `${V}`
    : "ERROR: Trying to join a value type that isn't castable to string";

export function join<
  T extends ReadonlyArray<Joinable> | [],
  Glue extends string
>(data: T, glue: Glue): Joined<T, Glue>;

export function join<
  T extends ReadonlyArray<Joinable> | [],
  Glue extends string
>(glue: Glue): (data: T) => Joined<T, Glue>;

export function join(): unknown {
  return purry(joinImplementation, arguments);
}

const joinImplementation = (
  data: ReadonlyArray<unknown>,
  glue: string
): string => data.join(glue);
