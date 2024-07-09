import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

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
