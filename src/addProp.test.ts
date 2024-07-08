import { addProp } from "./addProp";
import { pipe } from "./pipe";

describe("runtime", () => {
  describe("data first", () => {
    test("simple", () => {
      const actual = addProp({ a: 1 }, "b", 2);
      expect(actual).toEqual({ a: 1, b: 2 });
    });
  });

  describe("data last", () => {
    test("simple", () => {
      const actual = pipe({ a: 1 }, addProp("b", 2));
      expect(actual).toEqual({ a: 1, b: 2 });
    });
  });
});
