import { IterableContainer } from './_types';
import { purry } from './purry';

type Joinable = bigint | boolean | number | string | null | undefined;

type Joined<
  T extends IterableContainer,
  Glue extends string
> = T[number] extends never
  ? ''
  : T extends readonly [infer Only]
  ? JoinedValue<Only>
  : T extends readonly [infer First, ...infer Tail]
  ? `${JoinedValue<First>}${Glue}${Joined<Tail, Glue>}`
  : T extends readonly [...infer Head, infer Last]
  ? `${Joined<Head, Glue>}${Glue}${JoinedValue<Last>}`
  : string;

type JoinedValue<V> = undefined extends V
  ? ''
  : null extends V
  ? ''
  : V extends NonNullable<Joinable>
  ? `${V}`
  : never;

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
