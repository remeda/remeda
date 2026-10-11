import { expect, test } from "vitest";
import { lazyDataLastImpl } from "./lazyDataLastImpl";

test.each([[[]], [[1]], [[1, 2]]])(
  "passes the data and every argument of %j through",
  (args) => {
    expect(
      // @ts-expect-error [ts2322] -- `lazyDataLastImpl` returns `unknown`; the overloads of the utilities built on it are what type the data-last function.
      lazyDataLastImpl(collectArguments, args)("data"),
    ).toStrictEqual(["data", ...args]);
  },
);

const collectArguments = (...args: readonly unknown[]): readonly unknown[] =>
  args;
