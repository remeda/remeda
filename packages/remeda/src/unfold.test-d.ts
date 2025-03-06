import { unfold } from "./unfold";

test("unfold", () => {
  expectTypeOf(
    unfold("0", (n) =>
      n < "5" ? [Number(n), String(Number(n) + 1)] : undefined,
    ),
  ).toEqualTypeOf<Array<number>>();

  expectTypeOf(
    unfold((n: string) =>
      n < "5" ? [Number(n), String(Number(n) + 1)] : undefined,
    )("0"),
  ).toEqualTypeOf<Array<number>>();
});
