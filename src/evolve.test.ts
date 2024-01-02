import { pipe } from './pipe';
import { evolve } from './evolve';
import { omit } from './omit';
import { set } from './set';
import { identity } from './identity';
import { map } from './map';
import { add } from './add';

describe('data first', () => {
  it('creates a new object by evolving the `object` according to the `transformation` functions', function () {
    const transf = {
      count: add(1),
      data: { elapsed: add(1), remaining: add(-1) },
    };
    const object = {
      id: 10,
      count: 10,
      data: { elapsed: 100, remaining: 1400 },
    };
    const expected = {
      id: 10,
      count: 11,
      data: { elapsed: 101, remaining: 1399 },
    };
    const result = evolve(object, transf);
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('does not invoke function if object does not contain the key', function () {
    const transf = { n: add(1), m: add(1) };
    const object = { m: 3 };
    const expected = { m: 4 };
    const result = evolve(object, transf);
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('is not destructive and is immutable', function () {
    const transf = { n: add(1) };
    const object = { n: 100 };
    const expected = { n: 101 };
    const result = evolve(object, transf);
    expect(object).toEqual({ n: 100 });
    expect(result).toEqual(expected);
    expect(result).not.toBe(expected);
  });

  it('is recursive', function () {
    const transf = { nested: { second: add(-1), third: add(1) } };
    const object = { first: 1, nested: { second: 2, third: 3 } };
    const expected = { first: 1, nested: { second: 1, third: 4 } };
    const result = evolve(object, transf);
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('ignores primitive value transformations', function () {
    const transf = { n: 2, m: 'foo' };
    const object = { n: 0, m: 1 };
    const expected = { n: 0, m: 1 };
    const result = evolve(object, transf);
    expect(result).toEqual(expected);
  });

  it('ignores null transformations', function () {
    const transf = { n: null };
    const object = { n: 0 };
    const expected = { n: 0 };
    const result = evolve(object, transf);
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('creates a new array by evolving the `array` according to the `transformation` functions', function () {
    // NOTE:
    // If we use tuple in `transformations` parameter,
    // use `as const` or `evolve` can't handle typing.
    const transf = [
      add(-1),
      null,
      add(1),
      [null, (x: string) => x + '!!'],
    ] as const;
    const object = [2, 2, 2, ['...', 'Go']] as const;
    const expected = [1, 2, 3, ['...', 'Go!!']] as const;
    let result = evolve(object, transf);
    expect(result).toEqual(expected);
    // FIXME: Because of limitations of working with tuple types in TypeScript.
    expectTypeOf(result).toEqualTypeOf<{
      0: number;
      1: 2;
      2: number;
      3: { 0: '...'; 1: string };
    }>();
    result = expected; // Assignment is possible
  });

  it('can handle complex nested objects', function () {
    const transf = {
      array: (array: ReadonlyArray<string>) => array.length,
      nestedObj: { a: set<{ b: string }, 'b'>('b', 'Set') },
      objAry: map(omit<{ a: number; b: number }, 'b'>(['b'])),
    };
    const result = evolve(
      {
        array: ['1', '2', '3'],
        nestedObj: { a: { b: 'c' } },
        objAry: [
          { a: 0, b: 0 },
          { a: 1, b: 1 },
        ],
      },
      transf
    );
    const expected = {
      array: 3,
      nestedObj: { a: { b: 'Set' } },
      objAry: [{ a: 0 }, { a: 1 }],
    };
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });
});

describe('data last', () => {
  const add = (x: number) => (y: number) => x + y;

  it('creates a new object by evolving the `object` according to the `transformation` functions', function () {
    const transf = {
      count: add(1),
      data: { elapsed: add(1), remaining: add(-1) },
    };
    const object = {
      id: 10,
      count: 10,
      data: { elapsed: 100, remaining: 1400 },
    };
    const expected = {
      id: 10,
      count: 11,
      data: { elapsed: 101, remaining: 1399 },
    };
    const result = pipe(object, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('does not invoke function if object does not contain the key', function () {
    const transf = { n: add(1), m: add(1), l: [add(1)] as const };
    const object = { m: 3, l: [2, 1] as const };
    const expected = { m: 4, l: [3, 1] as { 0: number; 1: 1 } };
    const result = pipe(object, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('is not destructive and is immutable', function () {
    const transf = { n: add(1) };
    const object = { n: 100 };
    const expected = { n: 101 };
    const result = pipe(object, evolve(transf));
    expect(object).toEqual({ n: 100 });
    expect(result).toEqual(expected);
    expect(result).not.toBe(expected);
  });

  it('is recursive', function () {
    const transf = { nested: { second: add(-1), third: add(1) } };
    const object = { first: 1, nested: { second: 2, third: 3 } };
    const expected = { first: 1, nested: { second: 1, third: 4 } };
    const result = pipe(object, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('ignores primitive value transformations', function () {
    const transf = { n: 2, m: 'foo' };
    const object = { n: 0, m: 1 };
    const expected = { n: 0, m: 1 };
    const result = pipe(object, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('ignores null transformations', function () {
    const transf = { n: null };
    const object = { n: 0 };
    const expected = { n: 0 };
    const result = pipe(object, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('creates a new array by evolving the `array` according to the `transformation` functions', function () {
    // NOTE:
    // If we use tuple in `transformations` parameter,
    // use `as const` or `evolve` can't handle typing.
    const transf = [
      add(-1),
      identity<number>,
      add(1),
      [null, (x: string) => x + '!!'],
    ] as const;
    const object = [2, 2, 2, ['...', 'Go']] as const;
    const expected = [1, 2, 3, ['...', 'Go!!']] as const;
    let result = pipe(object, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<{
      0: number;
      1: number;
      2: number;
      3: { 0: '...'; 1: string };
    }>();
    result = expected; // Assignment is possible
  });

  it('can handle complex nested objects', function () {
    const result = pipe(
      {
        array: ['1', '2', '3'],
        nestedObj: { a: { b: 'c' } },
        objAry: [
          { a: 0, b: 0 },
          { a: 1, b: 1 },
        ],
      },
      evolve({
        array: (array: Array<string>) => array.length,
        nestedObj: { a: set<{ b: string }, 'b'>('b', 'Set') },
        objAry: map(omit<{ a: number; b: number }, 'b'>(['b'])),
      })
    );
    const expected = {
      array: 3,
      nestedObj: { a: { b: 'Set' } },
      objAry: [{ a: 0 }, { a: 1 }],
    };
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });
});

describe('typing', () => {
  describe('data first', () => {
    it('can detect mismatch of parameters and arguments', function () {
      const transf = {
        number: add(1),
        array: (array: ReadonlyArray<number>) => array.length,
        nestedObj: { a: set<{ b: number }, 'b'>('b', 0) },
        objAry: map(omit<{ a: number; b: number }, 'b'>(['b'])),
        tupleParam: (arg1: [number, number]) => arg1.length,
        functionTuple: [add(1), add(2)] as const,
      };
      evolve(
        {
          // @ts-expect-error -- [ts2322]: Type 'string' is not assignable to type 'number | undefined'
          number: '1',
          // @ts-expect-error -- [ts2322]: Type 'string' is not assignable to type 'number'
          array: ['1', '2', '3'],
          // @ts-expect-error -- [ts2322]: Type 'string' is not assignable to type 'number'
          nestedObj: { a: { b: 'c' } },
          objAry: [
            // @ts-expect-error -- [ts2322]: Type 'string' is not assignable to type 'number'
            { a: '0', b: 0 },
            { a: 1, b: 1 },
          ],
          // @ts-expect-error -- [ts2322]: Type 'string' is not assignable to type 'number'
          tupleParam: ['1', 2],
          // @ts-expect-error -- [ts2322]: Type 'string' is not assignable to type 'number | undefined'
          functionTuple: ['1', 2],
        },
        transf
      );
    });

    it('does not accept the input value that is not Array and Object', function () {
      const transf = { a: add(1) };
      // @ts-expect-error -- [ts2559]: Type '0' has no properties in common with type '{ a?: number | undefined; }'
      const result = evolve(0, transf);
      expect(result).toEqual(0); // ignores transformations if the input value is not Array and Object

      // @ts-expect-error -- [ts2345]: Argument of type 'undefined' is not assignable to parameter of type '{ a?: number | undefined; }'.
      evolve(undefined, transf);
      // @ts-expect-error -- [ts2345]: Argument of type 'null' is not assignable to parameter of type '{ a?: number | undefined; }'.
      evolve(null, transf);
      // @ts-expect-error -- [ts2559]: Type '""' has no properties in common with type '{ a?: number | undefined; }'.
      evolve('', transf);
    });

    it('does not accept function that require multiple arguments', function () {
      evolve(
        {
          // @ts-expect-error -- [ts2322]: Type 'number[]' is not assignable to type 'undefined'.
          requiring2Args: [1, 2],
          // @ts-expect-error -- [ts2322]: Type 'number' is not assignable to type 'undefined'..
          requiring3Args: 1,
        },
        {
          requiring2Args: (a: number, b: number) => a + b,
          requiring3Args: (a: number, b: number | undefined, c: number) =>
            a + (b ?? 0) + c,
        }
      );
    });

    it('accept function whose second and subsequent arguments are optional', function () {
      const result = evolve(
        {
          arg2Optional: ['1', 2],
          arg2arg3Optional: '1',
        },
        {
          arg2Optional: (arg1: [string, number], arg2?: string) =>
            arg2 === undefined,
          arg2arg3Optional: (arg1: string, arg2?: string, arg3?: string) =>
            arg2 === undefined && arg3 === undefined,
        }
      );
      expect(result).toEqual({
        arg2Optional: true,
        arg2arg3Optional: true,
      });
      expectTypeOf(result).toEqualTypeOf<{
        arg2Optional: boolean;
        arg2arg3Optional: boolean;
      }>();
    });

    it('accept function whose second and subsequent arguments accept undefined', function () {
      const result = evolve(
        {
          arg2Undefinable: ['1', 2],
          arg2arg3Undefinable: '1',
        },
        {
          arg2Undefinable: (arg1: [string, number], arg2: string | undefined) =>
            arg2 === undefined,
          arg2arg3Undefinable: (
            arg1: string,
            arg2: string | undefined,
            arg3: string | undefined
          ) => arg2 === undefined && arg3 === undefined,
        }
      );
      expect(result).toEqual({
        arg2Undefinable: true,
        arg2arg3Undefinable: true,
      });
      expectTypeOf(result).toEqualTypeOf<{
        arg2Undefinable: boolean;
        arg2arg3Undefinable: boolean;
      }>();
    });
  });

  describe('data last', () => {
    describe('can detect mismatch of parameters and arguments', function () {
      it('detect property "number" are incompatible', function () {
        const transf = {
          number: add(1),
          array: (array: ReadonlyArray<number>) => array.length,
        };
        pipe(
          {
            number: '1',
            array: ['1', '2', '3'],
          },
          // @ts-expect-error -- [ts2345]: Type 'string' is not assignable to type 'number | undefined'.
          evolve(transf)
        );
      });
      it('detect property "array" are incompatible', function () {
        const transf = {
          number: add(1),
          array: (array: ReadonlyArray<number>) => array.length,
        };
        pipe(
          {
            number: 1,
            array: ['1', '2', '3'],
          },
          // @ts-expect-error -- [ts2345]: Type 'string[]' is not assignable to type 'readonly number[]'.
          evolve(transf)
        );
      });
    });

    it('does not accept the input value that is not Array and Object', function () {
      const transf = { a: add(1) };
      // @ts-expect-error -- [ts2345]: Argument of type '~' is not assignable to parameter of type '(input: number) => { a: number; }'.
      const result = pipe(0, evolve(transf));
      expect(result).toEqual(0); // ignores transformations if the input value is not Array and Object

      // @ts-expect-error -- [ts2345]: Argument of type '~' is not assignable to parameter of type '(input: undefined) => { a: number; }'.
      pipe(undefined, evolve(transf));
      // @ts-expect-error -- [ts2345]: Argument of type '~' is not assignable to parameter of type '(input: null) => { a: number; }'.
      pipe(null, evolve(transf));
      // @ts-expect-error -- [ts2345]: Argument of type '~' is not assignable to parameter of type '(input: string) => { a: number; }'.
      pipe('', evolve(transf));
    });

    it('does not accept function that require multiple arguments', function () {
      pipe(
        {
          requiring2Args: [1, 2],
        },
        // @ts-expect-error -- [ts2345]: Types of property 'requiring2Args' are incompatible.Type 'number[]' is not assignable to type 'undefined'.
        evolve({
          requiring2Args: (a: number, b: number) => a + b,
        })
      );
    });

    it('accept function whose second and subsequent arguments are optional', function () {
      const result = pipe(
        {
          arg2Optional: ['1', 2],
          arg2arg3Optional: '1',
        } as const,
        evolve({
          arg2Optional: (arg1: readonly [string, number], arg2?: string) =>
            arg2 === undefined,
          arg2arg3Optional: (arg1: string, arg2?: string, arg3?: string) =>
            arg2 === undefined && arg3 === undefined,
        })
      );
      expect(result).toEqual({
        arg2Optional: true,
        arg2arg3Optional: true,
      });
      expectTypeOf(result).toEqualTypeOf<{
        arg2Optional: boolean;
        arg2arg3Optional: boolean;
      }>();
    });

    it('accept function whose second and subsequent arguments accept undefined', function () {
      const result = pipe(
        {
          arg2Undefinable: ['1', 2],
          arg2arg3Undefinable: '1',
        } as const,
        evolve({
          arg2Undefinable: (
            arg1: readonly [string, number],
            arg2: string | undefined
          ) => arg2 === undefined,
          arg2arg3Undefinable: (
            arg1: string,
            arg2: string | undefined,
            arg3: string | undefined
          ) => arg2 === undefined && arg3 === undefined,
        })
      );
      expect(result).toEqual({
        arg2Undefinable: true,
        arg2arg3Undefinable: true,
      });
      expectTypeOf(result).toEqualTypeOf<{
        arg2Undefinable: boolean;
        arg2arg3Undefinable: boolean;
      }>();
    });
  });
});
