import { map } from "../src/map";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const createLazyInvocationCounter = () => {
  const count = vi.fn<() => void>();
  return {
    count,
    fn: <T>() =>
      map<ReadonlyArray<T>, T>((x) => {
        count();
        return x;
      }),
  };
};
