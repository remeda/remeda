import { createLazyDifferenceMultisetByEvaluator } from './_createLazyDifferenceMultisetByEvaluator';
import { _reduceLazy } from './_reduceLazy';
import { purry } from './purry';

export function unionMultiset<TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
): [...Array<TData>, ...Array<TOther>];

export function unionMultiset<TData, TOther = TData>(
  other: ReadonlyArray<TOther>
): (data: ReadonlyArray<TData>) => [...Array<TData>, ...Array<TOther>];

export function unionMultiset() {
  return purry(unionMultisetImplementation, arguments);
}

const unionMultisetImplementation = <TData, TOther = TData>(
  data: ReadonlyArray<TData>,
  other: ReadonlyArray<TOther>
): [...Array<TData>, ...Array<TOther>] => [
  ...data,
  // A multi-set union is similar to an array concat, with the exception that
  // we need to remove items that are already in the first array. This is a copy
  // of the same code that implements `differenceMutltiset` - We do this to
  // avoid exporting the non-purried implementation function from that file.
  ..._reduceLazy(other, createLazyDifferenceMultisetByEvaluator(data)),
];
