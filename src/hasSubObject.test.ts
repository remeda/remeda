import { hasSubObject } from "./hasSubObject";
import { pipe } from "./pipe";

describe("data first", () => {
  it("works with empty sub-object", () => {
    expect(hasSubObject({ a: 1, b: "b", c: 3 }, {})).toBe(true);
    expect(hasSubObject({}, {})).toBe(true);
  });

  it("works with primitives", () => {
    expect(hasSubObject({ a: 1, b: "b", c: 3 }, { a: 1, b: "b" })).toBe(true);
    expect(hasSubObject({ a: 1, b: "c", c: 3 }, { a: 1, b: "b" })).toBe(false);
    expect(hasSubObject({ a: 2, b: "b", c: 3 }, { a: 1, b: "b" })).toBe(false);
  });

  it("works with deep objects", () => {
    expect(hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 2 } })).toBe(
      true,
    );
    expect(hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 0 } })).toBe(
      false,
    );
  });

  it("checks for matching key", () => {
    const data = {} as { a?: undefined };
    expect(hasSubObject(data, { a: undefined })).toBe(false);
  });
});

describe("data last", () => {
  it("works with empty sub-object", () => {
    expect(pipe({ a: 1, b: 2, c: 3 }, hasSubObject({}))).toBe(true);
    expect(pipe({}, hasSubObject({}))).toBe(true);
  });

  it("works with primitives", () => {
    expect(pipe({ a: 1, b: "b", c: 3 }, hasSubObject({ a: 1, b: "b" }))).toBe(
      true,
    );
    expect(pipe({ a: 1, b: "c", c: 3 }, hasSubObject({ a: 1, b: "b" }))).toBe(
      false,
    );
    expect(pipe({ a: 2, b: "b", c: 3 }, hasSubObject({ a: 1, b: "b" }))).toBe(
      false,
    );
  });

  it("works with deep objects", () => {
    expect(
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1, c: 2 } })),
    ).toBe(true);

    expect(
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1, c: 3 } })),
    ).toBe(false);
  });
});

describe("typing", () => {
  describe("data-first", () => {
    it("must have matching keys and values", () => {
      expectTypeOf(hasSubObject({ a: 2 }, { a: 1 })).toEqualTypeOf<boolean>();

      // ok
      hasSubObject({ a: 1, b: 2 }, { b: 2 });

      // @ts-expect-error [ts2322] - non-matching key
      hasSubObject({ b: 2 }, { a: 1 });

      // @ts-expect-error [ts2322] - non-matching key
      hasSubObject({ b: 2 }, { b: 2, a: 1 });

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: "a" }, { a: 1 });

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: "a" }, { a: { b: 2 } });

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: { b: 2 } }, { a: "a" });

      // ok - wider value type
      hasSubObject({ a: "a" as number | string }, { a: 1 });

      // ok - wider value type
      hasSubObject({ a: "a" }, { a: 1 as number | string });

      // ok - wider value type
      hasSubObject({ a: "a" as number | string }, { a: 1 as boolean | number });

      // @ts-expect-error [ts2345] - only allow valid objects to be passed
      hasSubObject({ a: 2 } as unknown, { a: 1 });

      // ok - const value
      hasSubObject({ a: 2, b: 2 }, { a: 1 } as const);
    });

    it("allows nested objects", () => {
      // @ts-expect-error [ts2322] - nested sub-object has missing keys
      hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1 } });

      // @ts-expect-error [ts2379] - nested sub-object has missing keys
      hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1 } } as {
        a?: { b: number };
      });

      // @ts-expect-error [ts2322] - nested sub-object has extra keys
      hasSubObject({ a: { b: 1 } }, { a: { b: 1, c: 2 } });

      hasSubObject({ a: { b: 1 } } as { a?: { b: number } }, {
        // @ts-expect-error ts[2322] - nested sub-object has extra keys
        a: { b: 1, c: 2 },
      });

      // @ts-expect-error [ts2322] - nested sub-object has wrong value types
      hasSubObject({ a: { b: 4, c: "c" } }, { a: { b: 1, c: 2 } });

      // @ts-expect-error [ts2322] - deep-nested sub-object has wrong value types
      hasSubObject({ a: { b: { c: 2 } } }, { a: { b: { c: "2" } } });

      // ok
      hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 2 } });

      // ok - deep-nested sub-object
      hasSubObject({ a: { b: { c: 2 } } }, { a: { b: { c: 2 } } });

      // ok
      hasSubObject({ a: { b: 1 } }, {
        a: { b: 1 },
      } as { a?: { b?: number } });

      // ok
      hasSubObject({ a: { b: 1 } } as { a?: { b?: number } }, {
        a: { b: 1 },
      });

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: { b: "a" } }, { a: { b: { c: 2 } } });

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: { b: { c: 2 } } }, { a: { b: "a" } });

      // ok - nested object wider value type
      hasSubObject({ a: { b: 1 as number | string } }, { a: { b: 1 } });

      // ok - nested sub-object wider value type
      hasSubObject({ a: { b: 1 } }, { a: { b: 1 as number | string } });

      // ok - nested object and sub-object wider value type
      hasSubObject(
        { a: { b: 1 as boolean | number } },
        { a: { b: 1 as number | string } },
      );
    });

    it("narrows with empty object", () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj, {})) {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it("narrows with same object", () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj, obj)) {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it("narrows optional field to required", () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj, { a: "a" })) {
        expectTypeOf(obj).toMatchTypeOf<{ a: string; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it("narrows field to constant type", () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj, { a: "a" } as const)) {
        expectTypeOf(obj).toMatchTypeOf<{ a: "a"; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it("narrows with sub-object union type field", () => {
      const obj: { a?: string; b?: number; c?: boolean } = {};

      if (hasSubObject(obj, { c: true as boolean | number })) {
        expectTypeOf(obj).toMatchTypeOf<{
          a?: string;
          b?: number;
          c: boolean;
        }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{
          a?: string;
          b?: number;
          c?: boolean;
        }>();
      }
    });

    it("narrows union types", () => {
      const obj: { a?: string; b?: number; c?: number | string } = {};

      if (hasSubObject(obj, { c: true } as { c?: boolean | number })) {
        expectTypeOf(obj).toMatchTypeOf<{
          a?: string;
          b?: number;
          c?: number;
        }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{
          a?: string;
          b?: number;
          c?: number | string;
        }>();
      }
    });

    it("narrows nested fields with sub-object union types", () => {
      const obj = {
        a: { foo: "test", bar: true },
        b: { foo: "test", bar: true },
      };

      if (
        hasSubObject(obj, {
          a: { foo: 12 as number | string, bar: true },
          b: { foo: "test", bar: true as boolean | number },
        })
      ) {
        expectTypeOf(obj).toMatchTypeOf<{
          a: { foo: string; bar: boolean };
          b: { foo: string; bar: boolean };
        }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{
          a: { foo: string; bar: boolean };
          b: { foo: string; bar: boolean };
        }>();
      }
    });

    it("narrows nested fields with union types", () => {
      const obj = {
        a: { foo: "test" as number | string, bar: true },
        b: { foo: "test", bar: true as boolean | number },
      };

      if (
        hasSubObject(obj, {
          a: { foo: 12, bar: true },
          b: { foo: "test", bar: true },
        })
      ) {
        expectTypeOf(obj).toMatchTypeOf<{
          a: { foo: number; bar: boolean };
          b: { foo: string; bar: boolean };
        }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{
          a: { foo: number | string; bar: boolean };
          b: { foo: string; bar: boolean | number };
        }>();
      }
    });
  });

  describe("data-last", () => {
    it("must have matching keys and values", () => {
      expectTypeOf(
        pipe({ a: 2 }, hasSubObject({ a: 1 })),
      ).toEqualTypeOf<boolean>();

      // @ts-expect-error [ts2353] - non-matching key
      hasSubObject({ a: 1 })({ b: 2 });
      // @ts-expect-error [ts2345] - non-matching key
      pipe({ b: 2 }, hasSubObject({ a: 1 }));

      // @ts-expect-error [ts2353] - non-matching key
      hasSubObject({ b: 2, a: 1 })({ b: 2 });
      // @ts-expect-error [ts2345] - non-matching key
      pipe({ b: 2 }, hasSubObject({ b: 2, a: 1 }));

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: 1 })({ a: "a" });
      // @ts-expect-error [ts2345] - different value type
      pipe({ a: "a" }, hasSubObject({ a: 1 }));

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: { b: 2 } })({ a: "a" });
      // @ts-expect-error [ts2345] - different value type
      pipe({ a: "a" }, hasSubObject({ a: { b: 2 } }));

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: "a" })({ a: { b: 2 } });
      // @ts-expect-error [ts2345] - different value type
      pipe({ a: { b: 2 } }, hasSubObject({ a: "a" }));

      // ok - wider value type
      hasSubObject({ a: 1 })({ a: "a" as number | string });
      pipe({ a: "a" as number | string }, hasSubObject({ a: 1 }));

      // ok - wider value type
      hasSubObject({ a: 1 as number | string })({ a: "a" });
      pipe({ a: "a" }, hasSubObject({ a: 1 as number | string }));

      // ok - wider value type
      hasSubObject({ a: 1 as boolean | number })({
        a: "a" as number | string,
      });
      pipe(
        { a: "a" as number | string },
        hasSubObject({ a: 1 as boolean | number }),
      );

      // @ts-expect-error [ts2345] - only allow valid objects to be passed
      hasSubObject({ a: 1 })({ a: 2 } as unknown);
      // @ts-expect-error [ts2345] - only allow valid objects to be passed
      pipe({ a: 2 } as unknown, hasSubObject({ a: 1 }));

      // ok - const value
      hasSubObject({ a: 1 } as const)({ a: 2, b: 2 });
      pipe({ a: 2, b: 2 }, hasSubObject({ a: 1 } as const));
    });

    it("allows nested objects", () => {
      // @ts-expect-error [ts2322] - nested sub-object has missing keys
      hasSubObject({ a: { b: 1 } })({ a: { b: 1, c: 2 } });
      // @ts-expect-error [ts2345] - nested sub-object has missing keys
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1 } }));

      hasSubObject({ a: { b: 1 } } as { a?: { b: number } })({
        // @ts-expect-error [ts2322] - nested sub-object has missing keys
        a: { b: 1, c: 2 },
      });
      pipe(
        { a: { b: 1, c: 2 } },
        // @ts-expect-error [ts2345] - nested sub-object has missing keys
        hasSubObject({ a: { b: 1 } } as { a?: { b: number } }),
      );

      // @ts-expect-error [ts2322] - nested sub-object has extra keys
      hasSubObject({ a: { b: 1, c: 2 } })({ a: { b: 1 } });
      // @ts-expect-error [ts2345] - nested sub-object has extra keys
      pipe({ a: { b: 1 } }, hasSubObject({ a: { b: 1, c: 2 } }));

      // @ts-expect-error [ts2379] - nested sub-object has extra keys
      hasSubObject({ a: { b: 1, c: 2 } })({ a: { b: 1 } } as {
        a?: { b: number };
      });
      pipe(
        { a: { b: 1 } } as { a?: { b: number } },
        // @ts-expect-error [ts2345] - nested sub-object has extra keys
        hasSubObject({ a: { b: 1, c: 2 } }),
      );

      // @ts-expect-error [ts2322] - nested sub-object has wrong value types
      hasSubObject({ a: { b: 1, c: 2 } })({ a: { b: 4, c: "c" } });
      // @ts-expect-error [ts2345] - nested sub-object has wrong value types
      pipe({ a: { b: 4, c: "c" } }, hasSubObject({ a: { b: 1, c: 2 } }));

      // @ts-expect-error [ts2322] - deep-nested sub-object has wrong value types
      hasSubObject({ a: { b: { c: "2" } } })({ a: { b: { c: 2 } } });
      // @ts-expect-error [ts2345] - deep-nested sub-object has wrong value types
      pipe({ a: { b: { c: 2 } } }, hasSubObject({ a: { b: { c: "2" } } }));

      // ok
      hasSubObject({ a: { b: 1, c: 2 } })({ a: { b: 1, c: 2 } });
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1, c: 2 } }));

      // ok - deep-nested sub-object
      hasSubObject({ a: { b: { c: 2 } } })({ a: { b: { c: 2 } } });
      pipe({ a: { b: { c: 2 } } }, hasSubObject({ a: { b: { c: 2 } } }));

      // ok
      hasSubObject({ a: { b: 1 } } as { a?: { b?: number } })({ a: { b: 1 } });
      pipe(
        { a: { b: 1 } },
        hasSubObject({ a: { b: 1 } } as { a?: { b?: number } }),
      );

      // ok
      hasSubObject({ a: { b: 1 } })({ a: { b: 1 } } as { a?: { b?: number } });
      pipe(
        { a: { b: 1 } } as { a?: { b?: number } },
        hasSubObject({ a: { b: 1 } }),
      );

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: { b: { c: 2 } } })({ a: { b: "a" } });
      // @ts-expect-error [ts2345] - different value type
      pipe({ a: { b: "a" } }, hasSubObject({ a: { b: { c: 2 } } }));

      // @ts-expect-error [ts2322] - different value type
      hasSubObject({ a: { b: "a" } })({ a: { b: { c: 2 } } });
      // @ts-expect-error [ts2345] - different value type
      pipe({ a: { b: { c: 2 } } }, hasSubObject({ a: { b: "a" } }));

      // ok - nested object wider value type
      hasSubObject({ a: { b: 1 } })({ a: { b: 1 as number | string } });
      pipe({ a: { b: 1 as number | string } }, hasSubObject({ a: { b: 1 } }));

      // ok - nested sub-object wider value type
      hasSubObject({ a: { b: 1 as number | string } })({ a: { b: 1 } });
      pipe({ a: { b: 1 } }, hasSubObject({ a: { b: 1 as number | string } }));

      // ok - nested object and sub-object wider value type
      hasSubObject({
        a: { b: 1 as number | string },
      })({
        a: { b: 1 as boolean | number },
      });
      pipe(
        { a: { b: 1 as boolean | number } },
        hasSubObject({ a: { b: 1 as number | string } }),
      );
    });

    it("narrows with empty object", () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject({})(obj)) {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it("narrows with same object", () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj)(obj)) {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it("narrows optional field to required", () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject({ a: "a" })(obj)) {
        expectTypeOf(obj).toMatchTypeOf<{ a: string; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it("narrows field to constant type", () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject({ a: "a" } as const)(obj)) {
        expectTypeOf(obj).toMatchTypeOf<{ a: "a"; b?: number }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{ a?: string; b?: number }>();
      }
    });

    it("narrows with sub-object union type field", () => {
      const obj: { a?: string; b?: number; c?: boolean } = {};

      if (hasSubObject({ c: true as boolean | number })(obj)) {
        expectTypeOf(obj).toMatchTypeOf<{
          a?: string;
          b?: number;
          c: boolean;
        }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{
          a?: string;
          b?: number;
          c?: boolean;
        }>();
      }
    });

    it("narrows union types", () => {
      const obj: { a?: string; b?: number; c?: number | string } = {};

      if (hasSubObject({ c: true } as { c?: boolean | number })(obj)) {
        expectTypeOf(obj).toMatchTypeOf<{
          a?: string;
          b?: number;
          c?: number;
        }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{
          a?: string;
          b?: number;
          c?: number | string;
        }>();
      }
    });

    it("narrows nested fields with sub-object union types", () => {
      const obj = {
        a: { foo: "test", bar: true },
        b: { foo: "test", bar: true },
      };

      if (
        hasSubObject({
          a: { foo: 12 as number | string, bar: true },
          b: { foo: "test", bar: true as boolean | number },
        })(obj)
      ) {
        expectTypeOf(obj).toMatchTypeOf<{
          a: { foo: string; bar: boolean };
          b: { foo: string; bar: boolean };
        }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{
          a: { foo: string; bar: boolean };
          b: { foo: string; bar: boolean };
        }>();
      }
    });

    it("narrows nested fields with union types", () => {
      const obj = {
        a: { foo: "test" as number | string, bar: true },
        b: { foo: "test", bar: true as boolean | number },
      };

      if (
        hasSubObject({
          a: { foo: 12, bar: true },
          b: { foo: "test", bar: true },
        })(obj)
      ) {
        expectTypeOf(obj).toMatchTypeOf<{
          a: { foo: number; bar: boolean };
          b: { foo: string; bar: boolean };
        }>();
      } else {
        expectTypeOf(obj).toMatchTypeOf<{
          a: { foo: number | string; bar: boolean };
          b: { foo: string; bar: boolean | number };
        }>();
      }
    });
  });
});
