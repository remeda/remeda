export type Pred<T, K> = (input: T) => K;
export type PredIndexed<T, K> = (input: T, index: number, array: T[]) => K;
export type PredIndexedOptional<T, K> = (
  input: T,
  index?: number,
  array?: T[]
) => K;

export type LazyIndexed = (
  indexed: boolean
) => <T, K>(
  fn: PredIndexedOptional<T, K>
) => (
  value: T,
  index?: number,
  array?: T[]
) => { done: boolean; hasNext: boolean; next: K };
