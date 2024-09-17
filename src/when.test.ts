import { constant } from "./constant";
import { isDefined } from "./isDefined";
import { isNot } from "./isNot";
import { isNullish } from "./isNullish";
import { isStrictEqual } from "./isStrictEqual";
import { isString } from "./isString";
import { map } from "./map";
import { pipe } from "./pipe";
import { when } from "./when";

describe("dataFirst", () => {
  describe("without else", () => {
    it("returns the happy path when true", () => {
      expect(when("hello", isStrictEqual("hello"), constant("was true"))).toBe(
        "was true",
      );
    });

    it("returns the identity when false", () => {
      expect(when("hello", isStrictEqual("olleh"), constant("was true"))).toBe(
        "hello",
      );
    });

    it("passes extra args to the functions", () => {
      expect(
        when(
          "20",
          isString,
          (x, radix) => Number.parseInt(x, radix),
          // Extra args:
          16 /* radix */,
        ),
      ).toBe(32);
    });
  });

  describe("with else", () => {
    it("returns the happy path when true", () => {
      expect(when("hello", isStrictEqual("hello"), constant("was true"))).toBe(
        "was true",
      );
    });

    it("returns the else path when false", () => {
      expect(
        when("hello", isStrictEqual("olleh"), {
          onTrue: constant("was true"),
          onFalse: constant("was false"),
        }),
      ).toBe("was false");
    });

    it("passes extra args to the functions", () => {
      expect(
        when(
          123,
          (x) => x % 2 === 0,
          {
            onTrue: (x, offset) => x + offset,
            onFalse: (x, offset) => x + offset + 1,
          },
          // Extra args:
          100,
        ),
      ).toBe(224);
    });
  });
});

describe("dataLast", () => {
  describe("without else", () => {
    it("returns the happy path when true", () => {
      expect(
        pipe("hello", when(isStrictEqual("hello"), constant("was true"))),
      ).toBe("was true");
    });

    it("returns the identity when false", () => {
      expect(
        pipe("hello", when(isStrictEqual("olleh"), constant("was true"))),
      ).toBe("hello");
    });

    it("passes extra args to the functions", () => {
      expect(
        map(
          [1, 2, 3, 4],
          when(
            (x) => x % 2 === 0,
            (x, index) => x + index,
          ),
        ),
      ).toStrictEqual([1, 3, 3, 7]);
    });
  });

  describe("with else", () => {
    it("returns the happy path when true", () => {
      expect(
        pipe("hello", when(isStrictEqual("hello"), constant("was true"))),
      ).toBe("was true");
    });

    it("returns the else path when false", () => {
      expect(
        pipe(
          "hello",
          when(isStrictEqual("olleh"), {
            onTrue: constant("was true"),
            onFalse: constant("was false"),
          }),
        ),
      ).toBe("was false");
    });
  });

  it("passes extra args to the functions", () => {
    expect(
      map(
        [1, 2, 3, 4],
        when((x) => x % 2 === 0, {
          onTrue: (x, index) => x + index,
          onFalse: (x, index) => `${x}${index}`,
        }),
      ),
    ).toStrictEqual(["10", 3, "32", 7]);
  });
});

it("can return other types", () => {
  expect(
    when(
      "hello",
      isStrictEqual("hello"),
      constant(42),
      constant({ a: "hello" }),
    ),
  ).toBe(42);

  expect(
    when("hello", isStrictEqual("olleh"), {
      onTrue: constant(42),
      onFalse: constant({ a: "hello" }),
    }),
  ).toStrictEqual({ a: "hello" });
});

describe("recipes", () => {
  it("acts as a coalesce tool", () => {
    expect(
      map(
        [0, 1, 2, undefined, 4, undefined, 6],
        when(isNot(isDefined), constant("missing")),
      ),
    ).toStrictEqual([0, 1, 2, "missing", 4, "missing", 6]);
  });

  it("can replace defaultTo", () => {
    // Nullish
    expect(
      map([undefined, null, 1], when(isNullish, constant(42))),
    ).toStrictEqual([42, 42, 1]);

    // NaN
    expect(
      map([Number.NaN, 1], when(Number.isNaN, constant(42))),
    ).toStrictEqual([42, 1]);

    // All
    expect(
      map(
        [Number.NaN, undefined, null, 1],
        when(
          (x) => Number.isNaN(x) || x === null || x === undefined,
          constant(42),
        ),
      ),
    ).toStrictEqual([42, 42, 42, 1]);
  });
});
