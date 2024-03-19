import { piped } from "./piped";

it("should pipe a single operation", () => {
  const fn = piped((x: number) => x * 2);
  expect(fn(1)).toEqual(2);
});

it("should pipe operations", () => {
  const fn = piped(
    (x: number) => x * 2,
    (x) => x * 3,
  );
  expect(fn(1)).toEqual(6);
});
