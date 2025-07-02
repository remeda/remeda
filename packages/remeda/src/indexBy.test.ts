import { expect, test } from "vitest";
import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

test("dataFirst", () => {
  expect(
    indexBy(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ],
      prop("code"),
    ),
  ).toStrictEqual({
    97: { dir: "left", code: 97 },
    100: { dir: "right", code: 100 },
  });
});

test("dataLast", () => {
  expect(
    pipe(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ],
      indexBy(prop("code")),
    ),
  ).toStrictEqual({
    97: { dir: "left", code: 97 },
    100: { dir: "right", code: 100 },
  });
});
