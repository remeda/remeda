export type Pred<T, K> = (input: T) => K;
export type PredIndexed<T, K> = (input: T, index: number, array: Array<T>) => K;
export type PredIndexedOptional<T, K> = (
  input: T,
  index?: number,
  array?: Array<T>
) => K;

/** types that may be returned by `keyof` */
export type Key = string | number | symbol;

/** Mapped type to remove optional, null, and undefined from all props */
export type NonNull<T> = { [K in keyof T]-?: Exclude<T[K], null | undefined> };

export type NonEmptyArray<T> = [T, ...Array<T>];
