import { branch } from "./branch";
import { constant } from "./constant";
import { isDefined } from "./isDefined";
import { isNot } from "./isNot";
import { isStrictEqual } from "./isStrictEqual";
import { map } from "./map";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  describe("without else", () => {
    it("returns the happy path when true", () => {
      expect(
        branch("hello", isStrictEqual("hello"), constant("was true")),
      ).toBe("was true");
    });

    it("returns the identity when false", () => {
      expect(
        branch("hello", isStrictEqual("olleh"), constant("was true")),
      ).toBe("hello");
    });
  });

  describe("with else", () => {
    it("returns the happy path when true", () => {
      expect(
        branch("hello", isStrictEqual("hello"), constant("was true")),
      ).toBe("was true");
    });

    it("returns the else path when false", () => {
      expect(
        branch(
          "hello",
          isStrictEqual("olleh"),
          constant("was true"),
          constant("was false"),
        ),
      ).toBe("was false");
    });
  });
});

describe("dataLast", () => {
  describe("without else", () => {
    it("returns the happy path when true", () => {
      expect(
        pipe("hello", branch(isStrictEqual("hello"), constant("was true"))),
      ).toBe("was true");
    });

    it("returns the identity when false", () => {
      expect(
        pipe("hello", branch(isStrictEqual("olleh"), constant("was true"))),
      ).toBe("hello");
    });
  });

  describe("with else", () => {
    it("returns the happy path when true", () => {
      expect(
        pipe("hello", branch(isStrictEqual("hello"), constant("was true"))),
      ).toBe("was true");
    });

    it("returns the else path when false", () => {
      expect(
        pipe(
          "hello",
          branch(
            isStrictEqual("olleh"),
            constant("was true"),
            constant("was false"),
          ),
        ),
      ).toBe("was false");
    });
  });
});

it("can return other types", () => {
  expect(
    branch(
      "hello",
      isStrictEqual("hello"),
      constant(42),
      constant({ a: "hello" }),
    ),
  ).toBe(42);

  expect(
    branch(
      "hello",
      isStrictEqual("olleh"),
      constant(42),
      constant({ a: "hello" }),
    ),
  ).toEqual({ a: "hello" });
});

it("acts as a coalesce tool", () => {
  expect(
    map(
      [0, 1, 2, undefined, 4, undefined, 6],
      branch(isNot(isDefined), constant("missing")),
    ),
  ).toEqual([0, 1, 2, "missing", 4, "missing", 6]);
});
