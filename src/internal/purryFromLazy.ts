import { pipe, type LazyDefinition, type LazyEvaluator } from "../pipe";

export function purryFromLazy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lazy: (...args: any) => LazyEvaluator,
  args: ReadonlyArray<unknown>,
): unknown {
  const diff = args.length - lazy.length;

  if (diff === 1) {
    // dataFirst
    const [data, ...rest] = args;
    const lazyDefinition = { lazy, lazyArgs: rest } satisfies LazyDefinition;

    // @ts-expect-error [ts2353] - We are tricking pipe here...
    return pipe(data, lazyDefinition);
  }

  if (diff === 0) {
    const lazyDefinition = { lazy, lazyArgs: args } satisfies LazyDefinition;

    // @ts-expect-error [ts2353] - We are tricking pipe here...
    const dataLast = (data: unknown): unknown => pipe(data, lazyDefinition);
    return Object.assign(dataLast, lazyDefinition);
  }

  throw new Error("Wrong number of arguments");
}
