import { purry } from "remeda";

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
