import { constant } from "./constant";

describe("typing", () => {
  test("supported in any api", () => {
    mockApi({
      onMixOfParams: constant(1),
      onNoParams: constant(true),
      onVariadicParams: constant("cat"),
    });
  });

  test("doesn't break return typing", () => {
    mockApi({
      // @ts-expect-error [ts2322] - string is not a number.
      onMixOfParams: constant("hello"),
      // @ts-expect-error [ts2322] - number is not a boolean.
      onNoParams: constant(123),
      // @ts-expect-error [ts2322] - "mouse" is not a cat or a dog.
      onVariadicParams: constant("mouse"),
    });
  });
});

function mockApi(_options: {
  readonly onMixOfParams: (result: string, isOptionalBoolean?: true) => number;
  readonly onNoParams: () => boolean;
  readonly onVariadicParams: (...args: ReadonlyArray<string>) => "cat" | "dog";
}): void {
  /* do nothing */
}
