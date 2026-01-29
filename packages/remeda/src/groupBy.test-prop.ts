import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { groupBy } from "./groupBy";
import { pipe } from "./pipe";

test.prop([fc.array(fc.anything()), fc.func(fc.string()).map(pureGrouper)])(
  "all elements are preserved across groups",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(Object.values(result).flat()).toHaveLength(data.length);
  },
);

test.prop([fc.array(fc.anything()), fc.func(fc.string()).map(pureGrouper)])(
  "each element is grouped by its computed key",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(
      Object.entries(result).every(([key, items]) =>
        items.every((item) => grouper(item) === key),
      ),
    ).toBe(true);
  },
);

test.prop([fc.array(fc.anything()), fc.func(fc.string()).map(pureGrouper)])(
  "groups are never empty",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(Object.values(result).every((group) => group.length > 0)).toBe(true);
  },
);

test.prop([fc.array(fc.anything()), fc.func(fc.string()).map(pureGrouper)])(
  "data-first and data-last produce the same result",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(result).toStrictEqual(pipe(data, groupBy(grouper)));
  },
);

test.prop([
  fc.array(fc.anything()),
  fc.func(fc.option(fc.string(), { nil: undefined })).map(pureGrouper),
])("elements mapped to undefined are excluded", (data, grouper) => {
  const result = groupBy(data, grouper);

  expect(Object.values(result).flat()).toHaveLength(
    data.filter((item) => grouper(item) !== undefined).length,
  );
});

test.prop([
  fc.array(fc.anything()),
  fc.func(fc.option(fc.string(), { nil: undefined })).map(pureGrouper),
])("excluded elements do not appear in any group", (data, grouper) => {
  const result = groupBy(data, grouper);

  expect(
    Object.values(result)
      .flat()
      .every((item) => grouper(item) !== undefined),
  ).toBe(true);
});

test.prop([
  fc.array(fc.option(fc.anything(), { nil: undefined })),
  fc.func(fc.string()).map(pureGrouper),
])(
  "undefined items can be grouped when grouper returns a key",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(
      Object.values(result)
        .flat()
        .filter((item) => item === undefined),
    ).toHaveLength(data.filter((item) => item === undefined).length);
  },
);

function pureGrouper<Ret extends string | undefined>(
  arbitrary: (...args: readonly unknown[]) => Ret,
) {
  // Only depend on the item, ignoring index and array. This ensures calling
  // grouper(item) in tests matches what groupBy computed.
  return (item: unknown) => arbitrary(item);
}
