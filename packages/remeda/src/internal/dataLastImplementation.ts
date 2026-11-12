export type DataFirst<T, P extends readonly unknown[], R> = (
  data: T,
  ...args: P
) => R;

export type UnaryFunction<T = unknown, R = unknown> = (data: T) => R;

/**
 * Builds the data-last function for a `dataFirst` implementation that takes
 * one argument after the data.
 */
export const dataLastImplementation1 =
  <T, P extends readonly [unknown], R>(
    dataFirst: DataFirst<T, P, R>,
    argument: P[0],
  ): UnaryFunction<T, R> =>
  (data) =>
    dataFirst(
      data,
      // @ts-expect-error [ts2345] -- The arguments are the elements of `P`, which TypeScript can't match to a generic tuple one by one.
      argument,
    );

/**
 * Builds the data-last function for a `dataFirst` implementation that takes
 * two arguments after the data.
 */
export const dataLastImplementation2 =
  <T, P extends readonly [unknown, unknown], R>(
    dataFirst: DataFirst<T, P, R>,
    first: P[0],
    second: P[1],
  ): UnaryFunction<T, R> =>
  (data) =>
    dataFirst(
      data,
      // @ts-expect-error [ts2345] -- The arguments are the elements of `P`, which TypeScript can't match to a generic tuple one by one.
      first,
      second,
    );
