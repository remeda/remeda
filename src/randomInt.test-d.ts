import { randomInt } from "./randomInt";

test("Both params are of the same type", () => {
  // @ts-expect-error [ts2345] - Both should be number.
  randomInt(0, 10n);

  // @ts-expect-error [ts2345] - Both should be bigint.
  randomInt(0n, 10);
});

test("Returns the same type as the params", () => {
  expectTypeOf(randomInt(0, 10)).toEqualTypeOf<number>();
  expectTypeOf(randomInt(0n, 10n)).toEqualTypeOf<bigint>();
});

test("Accepts one argument", () => {
  expectTypeOf(randomInt(10)).toEqualTypeOf<number>();
  expectTypeOf(randomInt(10n)).toEqualTypeOf<bigint>();
});
