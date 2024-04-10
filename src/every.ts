// TODO: Fix ESlint issues
/* eslint-disable jsdoc/require-example */
/* eslint-disable jsdoc/require-description */
import type {
  Pred,
  PredIndexed,
  PredIndexedOptional,
  TypePred,
  TypePredIndexed,
} from "./_types";
import { purry } from "./purry";

/**
 * @param data - The Array to check.
 * @param pred - A predicate function to run.
 * @returns A `boolean` indicating if every element in `data` passes the predicate `pred`.
 * @dataFirst
 * @category Array
 */
export function every<T, S extends T>(
  data: ReadonlyArray<T>,
  pred: TypePred<T, S>,
): data is Array<S>;
export function every<T>(
  data: ReadonlyArray<T>,
  pred: Pred<T, boolean>,
): boolean;

/**
 * @param pred - A predicate function to run.
 * @dataLast
 * @category Array
 */
export function every<T, S extends T>(
  pred: TypePred<T, S>,
): (data: ReadonlyArray<T>) => data is Array<S>;
export function every<T>(
  // pred: Pred<T, boolean>,
  pred: (input: T) => boolean,
): (data: ReadonlyArray<T>) => boolean;

export function every(): unknown {
  return purry(_every(false), arguments);
}

const _every =
  (indexed: boolean) =>
  <T>(data: ReadonlyArray<T>, pred: PredIndexedOptional<T, boolean>) =>
    indexed
      ? data.every((element, index, array) => pred(element, index, array))
      : data.every((element) => pred(element));

export namespace every {
  export function indexed<T, S extends T>(
    data: ReadonlyArray<T>,
    pred: TypePredIndexed<T, S>,
  ): data is Array<S>;
  export function indexed<T>(
    data: ReadonlyArray<T>,
    pred: PredIndexed<T, boolean>,
  ): boolean;
  export function indexed<T, S extends T>(
    pred: TypePredIndexed<T, S>,
  ): (data: ReadonlyArray<T>) => data is Array<S>;
  export function indexed<T>(
    pred: PredIndexed<T, boolean>,
  ): (data: ReadonlyArray<T>) => boolean;
  export function indexed(): unknown {
    return purry(_every(true), arguments);
  }
}
