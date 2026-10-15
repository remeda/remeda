import { expect, test } from "vitest";
import { dataLastImplementation } from "./dataLastImplementation";

test.each([[[]], [[1]], [[1, 2]]])(
  "passes the data and every argument of %j through",
  (args) => {
    expect(
      dataLastImplementation(collectArguments, args)("data"),
    ).toStrictEqual(["data", ...args]);
  },
);

const collectArguments = (...args: readonly unknown[]): readonly unknown[] =>
  args;
