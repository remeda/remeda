import { pipe } from "./pipe";
import { prop } from "./prop";
import { sortBy } from "./sortBy";

test("prop typing", () => {
  const item = { a: 1 };
  const input = [item];

  const works = sortBy(input, prop("a"));
  expectTypeOf(works).toEqualTypeOf<typeof input>();

  const doesntWork = pipe(input, sortBy(prop("a")));
  expectTypeOf(doesntWork).toEqualTypeOf<typeof input>();
});

test("prop typing standalone", () => {
  const item = { a: 1 };
  const input = [item, { a: 2 }];
  const standAlonePropA = prop("a");
  const valueA = standAlonePropA(item);
  expectTypeOf(valueA).toEqualTypeOf<number>();
  const valuesA = input.map(standAlonePropA);
  expectTypeOf(valuesA).toEqualTypeOf<Array<number>>();
});

test("prop expect error", () => {
  const standAlonePropB = prop("b");
  const item = { a: 1 };
  // @ts-expect-error - b is not a key of typeof item
  const valueB = standAlonePropB(item);
  expectTypeOf(valueB).toEqualTypeOf<unknown>();
});
