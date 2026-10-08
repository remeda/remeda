import { expect, test } from "vitest";
import { requireData, requireDataByArity } from "./requireData";

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

const declaresData = (
  value: number,
  _index: number,
  data: readonly number[],
): number => value + data.length;

const ignoresData = (value: number, index: number): number => value + index;
