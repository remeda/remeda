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

/**
 * This should only be used for defining generics which extend any kind of JS
 * array under the hood, this includes arrays *AND* tuples (of the form [x, y],
 * and of the form [x, ...y[]], etc...), and their readonly equivalent. This
 * allows us to be more inclusive to what functions can process.
 *
 * @example map<T extends ArrayLike>(items: T) { ... }
 *
 * We would've named this `ArrayLike`, but that's already used by typescript...
 *
 * @see This was inspired by the type-definition of Promise.all (https://github.com/microsoft/TypeScript/blob/1df5717b120cddd325deab8b0f2b2c3eecaf2b01/src/lib/es2015.promise.d.ts#L21)
 */
export type IterableContainer = ReadonlyArray<unknown> | [];
