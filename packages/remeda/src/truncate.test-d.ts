import { describe, expectTypeOf, test } from "vitest";
import { truncate } from "./truncate";
import { pipe } from "./pipe";

describe("default options", () => {
  test("literals, truncated", () => {
    expectTypeOf(truncate("Hello, world!", 8)).toEqualTypeOf<"Hello...">();
  });

  test("literals, no truncation", () => {
    expectTypeOf(
      truncate("Hello, world!", 20),
    ).toEqualTypeOf<"Hello, world!">();
  });

  test("literals, shorter than default omission", () => {
    expectTypeOf(truncate("Hello, world!", 2)).toEqualTypeOf<"..">();
  });

  test("primitive 'data'", () => {
    expectTypeOf(
      truncate("Hello, world!" as string, 8),
    ).toEqualTypeOf<string>();
  });

  test("primitive 'n'", () => {
    expectTypeOf(
      truncate("Hello, world!", 8 as number),
    ).toEqualTypeOf<string>();
  });

  test("both primitive", () => {
    expectTypeOf(
      truncate("Hello, world!" as string, 8 as number),
    ).toEqualTypeOf<string>();
  });
});

describe("custom omission, no separator", () => {
  test("literals, truncated", () => {
    expectTypeOf(
      truncate("Hello, world!", 9, { omission: "bye" }),
    ).toEqualTypeOf<"Hello,bye">();
  });

  test("literals, no truncation", () => {
    expectTypeOf(
      truncate("Hello, world!", 20, { omission: "bye" }),
    ).toEqualTypeOf<"Hello, world!">();
  });

  test("literals, shorter than default omission", () => {
    expectTypeOf(
      truncate("Hello, world!", 2, { omission: "bye" }),
    ).toEqualTypeOf<"by">();
  });

  test("primitive 'data'", () => {
    expectTypeOf(
      truncate("Hello, world!" as string, 9, { omission: "bye" }),
    ).toEqualTypeOf<string>();
  });

  test("primitive 'n'", () => {
    expectTypeOf(
      truncate("Hello, world!", 9 as number, { omission: "bye" }),
    ).toEqualTypeOf<string>();
  });

  test("primitive 'data' and 'n'", () => {
    expectTypeOf(
      truncate("Hello, world!" as string, 9 as number, { omission: "bye" }),
    ).toEqualTypeOf<string>();
  });

  test("primitive 'omission'", () => {
    expectTypeOf(
      truncate("Hello, world!", 9, { omission: "bye" as string }),
    ).toEqualTypeOf<string>();
  });

  test("primitive 'data' and 'omission'", () => {
    expectTypeOf(
      truncate("Hello, world!" as string, 9, { omission: "bye" as string }),
    ).toEqualTypeOf<string>();
  });

  test("primitive 'n' and 'omission'", () => {
    expectTypeOf(
      truncate("Hello, world!", 9 as number, { omission: "bye" as string }),
    ).toEqualTypeOf<string>();
  });

  test("all primitive", () => {
    expectTypeOf(
      truncate("Hello, world!" as string, 9 as number, {
        omission: "bye" as string,
      }),
    ).toEqualTypeOf<string>();
  });
});

describe("with separator", () => {
  test("literal string separator", () => {
    expectTypeOf(
      truncate("Hello, world!", 8, { separator: " " }),
    ).toEqualTypeOf<string>();
  });

  test("primitive separator", () => {
    expectTypeOf(
      truncate("Hello, world!", 8, { separator: " " as string }),
    ).toEqualTypeOf<string>();
  });

  test("regex separator", () => {
    expectTypeOf(
      truncate("Hello, world!", 8, { separator: /,/gu }),
    ).toEqualTypeOf<string>();
  });
});

describe("unions", () => {
  describe("union of 'data'", () => {
    test("both truncated", () => {
      expectTypeOf(truncate("catcat" as "catcat" | "dogdog", 4)).toEqualTypeOf<
        "c..." | "d..."
      >();
    });

    test("both not truncated", () => {
      expectTypeOf(truncate("catcat" as "catcat" | "dogdog", 20)).toEqualTypeOf<
        "catcat" | "dogdog"
      >();
    });

    test("one truncated, one not", () => {
      expectTypeOf(
        truncate("catcat" as "catcat" | "dogdogdogdogdogdog", 10),
      ).toEqualTypeOf<"catcat" | "dogdogd...">();
    });

    test("'n' is shorter than 'omission'", () => {
      expectTypeOf(
        truncate("catcat" as "catcat" | "dogdog", 2),
      ).toEqualTypeOf<"..">();
    });
  });

  describe("union of 'n'", () => {
    test("both truncate", () => {
      expectTypeOf(truncate("Hello, world!", 4 as 4 | 5)).toEqualTypeOf<
        "H..." | "He..."
      >();
    });

    test("both don't truncate", () => {
      expectTypeOf(
        truncate("Hello, world!", 20 as 20 | 30),
      ).toEqualTypeOf<"Hello, world!">();
    });

    test("one truncates, the other doesn't", () => {
      expectTypeOf(truncate("Hello, world!", 4 as 4 | 20)).toEqualTypeOf<
        "Hello, world!" | "H..."
      >();
    });
  });

  describe("union of 'omission'", () => {
    test("both shorter than 'n'", () => {
      expectTypeOf(
        truncate("Hello, world!", 4, { omission: "..." as "..." | "bye" }),
      ).toEqualTypeOf<"Hbye" | "H...">();
    });

    test("both longer than 'n'", () => {
      expectTypeOf(
        truncate("Hello, world!", 3, {
          omission: "..." as "catcat" | "dogdog",
        }),
      ).toEqualTypeOf<"cat" | "dog">();
    });

    test("one shorter than 'n', the other longer", () => {
      expectTypeOf(
        truncate("Hello, world!", 4, {
          omission: "catcat" as "..." | "catcat",
        }),
      ).toEqualTypeOf<"H..." | "catc">();
    });
  });

  test("everything is a union", () => {
    expectTypeOf(
      truncate("catcat" as "catcat" | "dogdog", 4 as 4 | 5, {
        omission: "..." as "..." | "bye",
      }),
    ).toEqualTypeOf<
      "c..." | "d..." | "cbye" | "dbye" | "cabye" | "dobye" | "ca..." | "do..."
    >();
  });
});

describe("unbounded string literals", () => {
  test("'n' is larger than the literal prefix", () => {
    expectTypeOf(
      truncate("Hello, world!" as `H${string}`, 4),
    ).toEqualTypeOf<string>();
  });

  test("'n' is smaller than the literal prefix", () => {
    expectTypeOf(
      truncate("Hello, world!" as `Hello, world!${string}`, 4),
    ).toEqualTypeOf<string>();
  });
});

describe("data-last", () => {
  test("with default options", () => {
    expectTypeOf(
      pipe("Hello, world!" as const, truncate(4)),
    ).toEqualTypeOf<"H...">();
  });

  test("with custom 'omissions'", () => {
    expectTypeOf(
      pipe("Hello, world!" as const, truncate(4, { omission: "bye" })),
    ).toEqualTypeOf<"Hbye">();
  });
});

describe("skips unsupported 'n' values", () => {
  test("negative numbers", () => {
    expectTypeOf(truncate("Hello, world!", -3)).toEqualTypeOf<string>();
  });

  test("non-integer numbers", () => {
    expectTypeOf(truncate("Hello, world!", 3.5)).toEqualTypeOf<string>();
  });
});

test("returns literal empty string for `n === 0` even when other inputs are not literals", () => {
  expectTypeOf(
    truncate("Hello, world!" as string, 0, {
      omission: "..." as string,
      separator: "," as string,
    }),
  ).toEqualTypeOf<"">();
});

truncate("Hello, world!", 8, { omission: "..." });
