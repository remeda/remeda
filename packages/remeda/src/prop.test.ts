import { expect, test } from "vitest";
import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

test("prop", () => {
  const result = pipe({ foo: "bar" }, prop("foo"));

  expect(result).toBe("bar");
});

test("prop standalone", () => {
  const standAlonePropA = prop("a");

  expect(indexBy([{ a: 1 }, { a: 2 }], standAlonePropA)).toStrictEqual({
    "1": { a: 1 },
    "2": { a: 2 },
  });
});
