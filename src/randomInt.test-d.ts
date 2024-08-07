import { randomInt } from "./randomInt";

test("returns number when from is float", () => {
  expectTypeOf(randomInt(0.5, 1)).toEqualTypeOf<number>();
});

test("returns number when to is float", () => {
  expectTypeOf(randomInt(1, 1.5)).toEqualTypeOf<number>();
});

test("returns never when from is greater than to", () => {
  expectTypeOf(randomInt(10, 1)).toEqualTypeOf<never>();
});

test("returns the range as union for valid range (0-999)", () => {
  expectTypeOf(randomInt(0, 5)).toEqualTypeOf<0 | 1 | 2 | 3 | 4 | 5>();
  expectTypeOf(randomInt(998, 999)).toEqualTypeOf<998 | 999>();
});

test("returns the same value when to equals from", () => {
  expectTypeOf(randomInt(1, 1)).toEqualTypeOf<1>();
});

test("returns the same value when to equals from and out of range", () => {
  expectTypeOf(randomInt(10_000, 10_000)).toEqualTypeOf<10_000>();
});

test("Returns number for invalid range (to >= 1000)", () => {
  expectTypeOf(randomInt(1, 1001)).toEqualTypeOf<number>();
});

test("Returns number when from is a negative integer", () => {
  expectTypeOf(randomInt(-1, 1)).toEqualTypeOf<number>();
});

test("Returns number when to is a negative integer", () => {
  expectTypeOf(randomInt(1, -1)).toEqualTypeOf<number>();
});

test("Returns number when from is a negative decimal", () => {
  expectTypeOf(randomInt(-1.5, 1)).toEqualTypeOf<number>();
});

test("Returns number when to is a negative decimal", () => {
  expectTypeOf(randomInt(1, -1.5)).toEqualTypeOf<number>();
});

test("Returns number when from is number", () => {
  expectTypeOf(randomInt(1 as number, 5)).toEqualTypeOf<number>();
});

test("Returns number when to is number", () => {
  expectTypeOf(randomInt(1, 5 as number)).toEqualTypeOf<number>();
});

test("Returns number when from and to are number", () => {
  expectTypeOf(randomInt(1 as number, 5 as number)).toEqualTypeOf<number>();
});

test("Returns number when from is a max int", () => {
  expectTypeOf(randomInt(Number.MAX_SAFE_INTEGER, 0)).toEqualTypeOf<number>();
});

test("Returns number when to is a max int", () => {
  expectTypeOf(randomInt(0, Number.MAX_SAFE_INTEGER)).toEqualTypeOf<number>();
});

test("Returns number when from and to are max int", () => {
  expectTypeOf(
    randomInt(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
  ).toEqualTypeOf<number>();
});
