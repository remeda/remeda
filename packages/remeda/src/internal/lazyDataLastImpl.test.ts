import { expect, test } from "vitest";
import { lazyDataLastImpl } from "./lazyDataLastImpl";

test.each([[[]], [[1]], [[1, 2]]])(
  "passes the data and every argument of %j through",
  (args) => {
    // @ts-expect-error [ts2322] -- `lazyDataLastImpl` returns `unknown`; the overloads of the utilities built on it are what type the data-last function.
    const dataLast: (data: unknown) => unknown = lazyDataLastImpl(
      collectArguments,
      args,
    );

    expect(dataLast("data")).toStrictEqual(["data", ...args]);
  },
);

const collectArguments = (...args: readonly unknown[]): readonly unknown[] =>
  args;
