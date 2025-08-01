import { describe, expectTypeOf, test } from "vitest";
import type { IterableContainer } from "./IterableContainer";
import type { TupleParts } from "./TupleParts";

declare function tupleParts<T extends IterableContainer>(x: T): TupleParts<T>;

describe("all tuple/array shapes (mutable and readonly)", () => {
  test("empty tuples", () => {
    expectTypeOf(tupleParts([] as [])).toEqualTypeOf<{
      required: [];
      optional: [];
      item: never;
      suffix: [];
    }>();

    expectTypeOf(tupleParts([] as const)).toEqualTypeOf<{
      required: [];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("arrays", () => {
    expectTypeOf(tupleParts([] as Array<number>)).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [];
    }>();

    expectTypeOf(tupleParts([] as ReadonlyArray<number>)).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [];
    }>();
  });

  test("fixed tuples", () => {
    expectTypeOf(
      tupleParts([1, "hello", true, new Date()] as [
        number,
        string,
        boolean,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [number, string, boolean, Date];
      optional: [];
      item: never;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([1, "hello", true, new Date()] as readonly [
        number,
        string,
        boolean,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [number, string, boolean, Date];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("fixed-prefix arrays", () => {
    expectTypeOf(
      tupleParts([1, "hello", true] as [
        number,
        string,
        boolean,
        ...Array<Date>,
      ]),
    ).toEqualTypeOf<{
      required: [number, string, boolean];
      optional: [];
      item: Date;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([1, "hello", true] as readonly [
        number,
        string,
        boolean,
        ...Array<Date>,
      ]),
    ).toEqualTypeOf<{
      required: [number, string, boolean];
      optional: [];
      item: Date;
      suffix: [];
    }>();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(
      tupleParts(["a", true, new Date()] as [
        ...Array<number>,
        string,
        boolean,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [string, boolean, Date];
    }>();

    expectTypeOf(
      tupleParts(["a", true, new Date()] as readonly [
        ...Array<number>,
        string,
        boolean,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [string, boolean, Date];
    }>();
  });

  test("fixed-elements arrays", () => {
    expectTypeOf(
      tupleParts([1, "a", new Date()] as [
        number,
        string,
        ...Array<boolean>,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [];
      item: boolean;
      suffix: [Date];
    }>();

    expectTypeOf(
      tupleParts([1, "a", new Date()] as readonly [
        number,
        string,
        ...Array<boolean>,
        Date,
      ]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [];
      item: boolean;
      suffix: [Date];
    }>();
  });

  test("optional tuples", () => {
    expectTypeOf(
      tupleParts([] as [number?, string?, boolean?, Date?]),
    ).toEqualTypeOf<{
      required: [];
      optional: [
        number | undefined,
        string | undefined,
        boolean | undefined,
        Date | undefined,
      ];
      item: never;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([] as readonly [number?, string?, boolean?, Date?]),
    ).toEqualTypeOf<{
      required: [];
      optional: [
        number | undefined,
        string | undefined,
        boolean | undefined,
        Date | undefined,
      ];
      item: never;
      suffix: [];
    }>();
  });

  test("optional-prefix arrays", () => {
    expectTypeOf(
      tupleParts([] as [number?, string?, boolean?, ...Array<Date>]),
    ).toEqualTypeOf<{
      required: [];
      optional: [number | undefined, string | undefined, boolean | undefined];
      item: Date;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([] as readonly [number?, string?, boolean?, ...Array<Date>]),
    ).toEqualTypeOf<{
      required: [];
      optional: [number | undefined, string | undefined, boolean | undefined];
      item: Date;
      suffix: [];
    }>();
  });

  test("mixed tuples", () => {
    expectTypeOf(
      tupleParts([1, "a"] as [number, string, boolean?, Date?]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [boolean | undefined, Date | undefined];
      item: never;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([1, "a"] as readonly [number, string, boolean?, Date?]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [boolean | undefined, Date | undefined];
      item: never;
      suffix: [];
    }>();
  });

  test("mixed-prefix arrays", () => {
    expectTypeOf(
      tupleParts([1, "a"] as [number, string, boolean?, ...Array<Date>]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [boolean | undefined];
      item: Date;
      suffix: [];
    }>();

    expectTypeOf(
      tupleParts([1, "a"] as readonly [
        number,
        string,
        boolean?,
        ...Array<Date>,
      ]),
    ).toEqualTypeOf<{
      required: [number, string];
      optional: [boolean | undefined];
      item: Date;
      suffix: [];
    }>();
  });
});

describe("unions", () => {
  test("union of arrays", () => {
    expectTypeOf(
      tupleParts([] as Array<boolean> | Array<number>),
    ).toEqualTypeOf<
      | { required: []; optional: []; item: boolean; suffix: [] }
      | { required: []; optional: []; item: number; suffix: [] }
    >();
  });

  test("mixed unions", () => {
    expectTypeOf(
      tupleParts([] as Array<boolean> | [number, string]),
    ).toEqualTypeOf<
      | { required: []; optional: []; item: boolean; suffix: [] }
      | {
          required: [number, string];
          optional: [];
          item: never;
          suffix: [];
        }
    >();
  });

  test("looks like an optional tuple", () => {
    expectTypeOf(tupleParts([] as [] | [string | undefined])).toEqualTypeOf<
      | { required: []; optional: []; item: never; suffix: [] }
      | {
          required: [string | undefined];
          optional: [];
          item: never;
          suffix: [];
        }
    >();
  });

  test("union of equivalent optional tuples", () => {
    expectTypeOf(
      tupleParts([] as [string?] | [(string | undefined)?]),
    ).toEqualTypeOf<{
      required: [];
      optional: [string | undefined];
      item: never;
      suffix: [];
    }>();
  });
});

describe("handling of undefined values", () => {
  test("undefined required item", () => {
    expectTypeOf(
      tupleParts([undefined] as [number | undefined]),
    ).toEqualTypeOf<{
      required: [number | undefined];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("undefined optional item", () => {
    expectTypeOf(
      tupleParts([undefined] as [(number | undefined)?]),
    ).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: never;
      suffix: [];
    }>();
  });

  test("undefined rest item", () => {
    expectTypeOf(
      tupleParts([undefined] as Array<number | undefined>),
    ).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number | undefined;
      suffix: [];
    }>();
  });

  test("undefined suffix and rest items", () => {
    expectTypeOf(
      tupleParts([undefined] as [
        ...Array<number | undefined>,
        string | undefined,
      ]),
    ).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number | undefined;
      suffix: [string | undefined];
    }>();
  });

  test("undefined tuple with options", () => {
    expectTypeOf(
      tupleParts([undefined] as [number | undefined, (string | undefined)?]),
    ).toEqualTypeOf<{
      required: [number | undefined];
      optional: [string | undefined];
      item: never;
      suffix: [];
    }>();
  });

  test("undefined prefix items", () => {
    expectTypeOf(
      tupleParts([undefined] as [
        number | undefined,
        (string | undefined)?,
        ...Array<boolean | undefined>,
      ]),
    ).toEqualTypeOf<{
      required: [number | undefined];
      optional: [string | undefined];
      item: boolean | undefined;
      suffix: [];
    }>();
  });

  test("undefined fixed and rest elements", () => {
    expectTypeOf(
      tupleParts([undefined, undefined] as [
        number | undefined,
        ...Array<boolean | undefined>,
        string | undefined,
      ]),
    ).toEqualTypeOf<{
      required: [number | undefined];
      optional: [];
      item: boolean | undefined;
      suffix: [string | undefined];
    }>();
  });
});
