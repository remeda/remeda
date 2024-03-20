import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

describe("runtime", () => {
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
});

describe("typing", () => {
  test("dataFirst", () => {
    const result = indexBy(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ],
      prop("code"),
    );
    expectTypeOf<
      Partial<Record<97 | 100, { dir: "left" | "right"; code: 97 | 100 }>>
    >(result);
  });

  test("dataLast", () => {
    const result = pipe(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ],
      indexBy(prop("code")),
    );
    expectTypeOf<
      Partial<Record<97 | 100, { dir: "left" | "right"; code: 97 | 100 }>>
    >(result);
  });
});
