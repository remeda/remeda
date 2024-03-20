import { map } from "../src/map";

export const createLazyInvocationCounter = () => {
  const count = vi.fn();
  return {
    count,
    fn: <T>() =>
      map<ReadonlyArray<T>, T>((x) => {
        count();
        return x;
      }),
  };
};
