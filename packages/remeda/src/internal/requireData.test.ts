import { describe, expect, test } from "vitest";
import { canReadData, requireData, requireDataByArity } from "./requireData";

describe(requireData, () => {
  test("marks the evaluator", () => {
    expect(requireData((value) => value).requiresData).toBe(true);
  });
});

describe(requireDataByArity, () => {
  test("marks the evaluator when the callback declares `data`", () => {
    expect(
      requireDataByArity(declaresData, (value) => value).requiresData,
    ).toBe(true);
  });

  test("leaves the evaluator unmarked when the callback doesn't declare `data`", () => {
    expect(
      requireDataByArity(ignoresData, (value) => value).requiresData,
    ).toBeUndefined();
  });
});

describe(canReadData, () => {
  test("treats a rest-parameter callback as reading `data` because its `Function.length` is 0", () => {
    expect(canReadData((...args: readonly unknown[]) => args[2])).toBe(true);
  });

  test("judges a callback bound with partial application by its remaining arity", () => {
    expect(canReadData(ignoresDataAfterTag.bind(undefined, "t"))).toBe(false);
  });
});

describe("known issues!", () => {
  describe("`canReadData` known foot guns", () => {
    test("a trailing rest parameter", () => {
      const canRead = canReadData(
        (_value, _index, ...rest: readonly [readonly number[]]) =>
          rest[0].length,
      );

      expect(canRead).not.toBe(true);

      // Actual
      expect(canRead).toBe(false);
    });

    test("default parameters", () => {
      const canRead = canReadData(
        (_value, _index = 0, data: readonly number[] = []) => data.length,
      );

      expect(canRead).not.toBe(true);

      // Actual
      expect(canRead).toBe(false);
    });

    test("`arguments` access", () => {
      const canRead = canReadData(function readsArguments(_) {
        // eslint-disable-next-line prefer-rest-params -- The point of this test is that arguments-based access is invisible to the arity check.
        return arguments[2];
      });

      expect(canRead).not.toBe(true);

      // Actual
      expect(canRead).toBe(false);
    });
  });
});

const declaresData = (
  value: number,
  _index: number,
  data: readonly number[],
): number => value + data.length;

const ignoresData = (value: number, index: number): number => value + index;

const ignoresDataAfterTag = (
  tag: string,
  value: number,
  index: number,
): readonly unknown[] => [tag, value, index];
