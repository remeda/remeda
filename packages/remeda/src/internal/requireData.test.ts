import { describe, expect, test } from "vitest";
import { canReadData, requireData, requireDataByArity } from "./requireData";

test("`requireData` marks the evaluator", () => {
  expect(requireData((value) => value).requiresData).toBe(true);
});

test("`requireDataByArity` marks the evaluator when the callback declares `data`", () => {
  expect(requireDataByArity(declaresData, (value) => value).requiresData).toBe(
    true,
  );
});

test("`requireDataByArity` leaves the evaluator unmarked when the callback doesn't declare `data`", () => {
  expect(
    requireDataByArity(ignoresData, (value) => value).requiresData,
  ).toBeUndefined();
});

describe("known issues!", () => {
  describe("`canReadData` known foot guns", () => {
    test("a trailing rest parameter", () => {
      expect(
        canReadData(
          (_value, _index, ...rest: readonly [readonly number[]]) =>
            rest[0].length,
        ),
      ).not.toBe(true);
    });

    test("default parameters", () => {
      expect(
        canReadData(
          (_value, _index = 0, data: readonly number[] = []) => data.length,
        ),
      ).not.toBe(true);
    });

    test("`arguments` access", () => {
      expect(
        canReadData(function readsArguments(_) {
          // eslint-disable-next-line prefer-rest-params -- The point of this test is that arguments-based access is invisible to the arity check.
          return arguments[2];
        }),
      ).not.toBe(true);
    });
  });
});

const declaresData = (
  value: number,
  _index: number,
  data: readonly number[],
): number => value + data.length;

const ignoresData = (value: number, index: number): number => value + index;
