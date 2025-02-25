import { purry } from "remeda";

/**
 * A wrapper that allows calling `toString` generically with a data-last
 * impl for use in mappers and pipes.
 */
// TODO: Should this be added to the library?
export function toString<S extends string>(data: {
  readonly toString: () => S;
}): S;
export function toString(): <S extends string>(data: {
  readonly toString: () => S;
}) => S;
export function toString(...args: ReadonlyArray<unknown>): unknown {
  return purry(toStringImplementation, args);
}

const toStringImplementation = <S extends string>(data: {
  readonly toString: () => S;
}): S => data.toString();
