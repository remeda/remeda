import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

test("prop", () => {
  const result = pipe({ foo: "bar" }, prop("foo"));

  expect(result).toBe("bar");
});

test("prop standalone", () => {
  const input = [{ a: 1 }, { a: 2 }];
  const standAlonePropA = prop("a");
  const byPropA = pipe(input, indexBy(standAlonePropA));

  expect(byPropA).eqls({ "1": { a: 1 }, "2": { a: 2 } });

  const byPropADataFirst = indexBy(input, standAlonePropA);

  expect(byPropADataFirst).toStrictEqual({ "1": { a: 1 }, "2": { a: 2 } });
});
