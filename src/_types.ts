export type Pred<T, K> = (input: T) => K;
export type PredIndexed<T, K> = (input: T, index: number, array: T[]) => K;
export type PredIndexedOptional<T, K> = (
  input: T,
  index?: number,
  array?: T[]
) => K;
