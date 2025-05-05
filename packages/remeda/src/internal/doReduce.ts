import type { EagerReducer, LazyReducerImpl } from "./types/LazyFunc";

/**
 * This function is almost identical to {@link purry}, but it is used to make a
 * reducer function compatible with {@link pipe}'s lazy optimization,
 * potentially avoiding the creation of temporary arrays.
 */
export default function doReduce<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  impl: LazyReducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): unknown {
  switch (impl.length - args.length) {
    case 0:
      return impl(...(args as readonly [ReadonlyArray<Data>, ...Rest]));
    case 1: {
      const dataLast: EagerReducer<Data, Result> = (data) =>
        impl(data, ...(args as Rest));
      return Object.assign(dataLast, {
        lazyKind: "reducer",
      });
    }
    default:
      throw new Error("Wrong number of arguments");
  }
}
