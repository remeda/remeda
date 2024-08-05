import { randomInt } from "./randomInt";

test("Returns number for floats", () => {
  expectTypeOf(randomInt(0.5, 1)).toEqualTypeOf<number>();
  expectTypeOf(randomInt(1, 1.5)).toEqualTypeOf<number>();
});

test("Returns never for invalid range", () => {
  expectTypeOf(randomInt(10, 1)).toEqualTypeOf<never>();
});

test("Returns range for valid range", () => {
  expectTypeOf(randomInt(1, 5)).toEqualTypeOf<1 | 2 | 3 | 4 | 5>();
  expectTypeOf(randomInt(1, 1)).toEqualTypeOf<1>();
});

test("Returns number for invalid range", () => {
  expectTypeOf(randomInt(0, 5)).toEqualTypeOf<number>();
  expectTypeOf(randomInt(1, 1000)).toEqualTypeOf<number>();
});
