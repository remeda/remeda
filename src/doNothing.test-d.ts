import { doNothing } from "./doNothing";

describe("typing", () => {
  test("supported in any api", () => {
    mockApi({
      onMixOfParams: doNothing(),
      onNoParams: doNothing(),
      onVariadicParams: doNothing(),
    });
  });
});

function mockApi(_options: {
  readonly onMixOfParams: (result: string, isOptionalBoolean?: true) => void;
  readonly onNoParams: () => void;
  readonly onVariadicParams: (...args: ReadonlyArray<string>) => void;
}): void {
  /* do nothing */
}
