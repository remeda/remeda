import { pipe } from './pipe';
import { evolve } from './evolve';
import { omit } from './omit';
import { set } from './set';
import { map } from './map';
import { add } from './add';
import { reduce } from './reduce';

const sum = reduce((a, b: number) => add(a, b), 0);

describe('data first', () => {
  it('creates a new object by evolving the `data` according to the `transformation` functions', function () {
    const transf = {
      id: add(1),
      quartile: sum,
      time: { elapsed: add(1), remaining: add(-1) },
    };
    const data = {
      id: 1,
      quartile: [1, 2, 3, 4],
      time: { elapsed: 100, remaining: 1400 },
    };
    const expected = {
      id: 2,
      quartile: 10,
      time: { elapsed: 101, remaining: 1399 },
    };
    const result = evolve(data, transf);
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('does not invoke function if `data` does not contain the key', function () {
    const transf = { n: add(1), m: add(1) };
    const data = { m: 3 };
    const expected = { m: 4 };
    const result = evolve(data, transf);
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('is not destructive and is immutable', function () {
    const transf = { n: add(1) };
    const data = { n: 100 };
    const expected = { n: 101 };
    const result = evolve(data, transf);
    expect(data).toEqual({ n: 100 });
    expect(result).toEqual(expected);
    expect(result).not.toBe(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('is recursive', function () {
    const transf = { nested: { second: add(-1), third: add(1) } };
    const data = { first: 1, nested: { second: 2, third: 3 } };
    const expected = { first: 1, nested: { second: 1, third: 4 } };
    const result = evolve(data, transf);
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('ignores undefined transformations', function () {
    const transf = { n: undefined };
    const data: { n: number } = { n: 0 };
    const expected = { n: 0 };
    const result = evolve(data, transf);
    expect(result).toEqual(expected);
  });

  it('can handle data that is complex nested objects', function () {
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
  it('creates a new object by evolving the `data` according to the `transformation` functions', function () {
    const transf = {
      id: add(1),
      quartile: sum,
      time: { elapsed: add(1), remaining: add(-1) },
    };
    const data = {
      id: 1,
      quartile: [1, 2, 3, 4],
      time: { elapsed: 100, remaining: 1400 },
    };
    const expected = {
      id: 2,
      quartile: 10,
      time: { elapsed: 101, remaining: 1399 },
    };
    const result = pipe(data, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('does not invoke function if `data` does not contain the key', function () {
    const transf = { n: add(1), m: add(1) };
    const data = { m: 3 };
    const expected = { m: 4 };
    const result = pipe(data, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('is not destructive and is immutable', function () {
    const transf = { n: add(1) };
    const data = { n: 100 };
    const expected = { n: 101 };
    const result = pipe(data, evolve(transf));
    expect(data).toEqual({ n: 100 });
    expect(result).toEqual(expected);
    expect(result).not.toBe(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('is recursive', function () {
    const transf = { nested: { second: add(-1), third: add(1) } };
    const data = { first: 1, nested: { second: 2, third: 3 } };
    const expected = { first: 1, nested: { second: 1, third: 4 } };
    const result = pipe(data, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('ignores undefined transformations', function () {
    const transf = { n: undefined };
    const data = { n: 0 };
    const expected = { n: 0 };
    const result = pipe(data, evolve(transf));
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
  });

  it('can handle data that is complex nested objects', function () {
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
    describe('type reflection', (): void => {
      interface Data {
        id: number;
        quartile: Array<number>;
        time?: { elapsed: number; remaining?: number };
      }
      const data: Data = {
        id: 1,
        quartile: [1, 2, 3, 4],
        time: { elapsed: 100, remaining: 1400 },
      };
      const expected = data;

      it('can reflect type of data to function of evolver object', function () {
        const result = evolve(data, {
          count: (x: number) => x, // type of parameter is required because `count` property is not defined in data
          quartile: x => x,
          time: x => x,
        });
        expect(result).toEqual(expected);
        expectTypeOf(result).toEqualTypeOf<typeof expected>();
      });

      it('can reflect type of data to function of nested evolver object', function () {
        const result = evolve(data, {
          count: (x: number) => x, // type of parameter is required because `count` property is not defined in data
          quartile: x => x,
          time: { elapsed: x => x, remaining: x => x },
        });
        expect(result).toEqual(expected);
        expectTypeOf(result).toEqualTypeOf<typeof expected>();
      });
    });

    it('can detect mismatch of parameters and arguments', function () {
      evolve(
        {
          number: '1',
          array: ['1', '2', '3'],
          nestedObj: { a: { b: 'c' } },
          objAry: [
            { a: '0', b: 0 },
            { a: 1, b: 1 },
          ],
        },
        {
          // @ts-expect-error -- Type 'string' is not assignable to type 'number'.ts(2322)
          number: add(1),
          // @ts-expect-error -- Type 'string' is not assignable to type 'number'.ts(2322)
          array: (array: ReadonlyArray<number>) => array.length,
          // @ts-expect-error -- Type 'string' is not assignable to type 'number'.ts(2322)
          nestedObj: { a: set<{ b: number }, 'b'>('b', 0) },
          // @ts-expect-error -- Type 'string' is not assignable to type 'number'.ts(2322)
          objAry: map(omit<{ a: number; b: number }, 'b'>(['b'])),
        }
      );
    });

    it('does not accept the input value that is not Array and Object', function () {
      const transf = { a: add(1) };
      // @ts-expect-error -- Type '{ a: (value: number) => number; }' provides no match for the signature '(data: undefined): any'.ts(2345)
      const result = evolve(0, transf);
      expect(result).toEqual(0); // ignores transformations if the input value is not Array and Object

      // @ts-expect-error -- Type '{ a: (value: number) => number; }' provides no match for the signature '(data: undefined): any'.ts(2345)
      evolve(undefined, transf);
      // @ts-expect-error -- Type '{ a: (value: number) => number; }' provides no match for the signature '(data: null): any'.ts(2345)
      evolve(null, transf);
      // @ts-expect-error -- Type '{ a: (value: number) => number; }' provides no match for the signature '(data: ""): any'.ts(2345)
      evolve('', transf);
    });

    it('does not accept function that require multiple arguments', function () {
      evolve(
        {
          requiring2Args: 1,
          requiring3Args: 1,
        },
        {
          // @ts-expect-error -- Target signature provides too few arguments. Expected 2 or more, but got 1.ts(2322)
          requiring2Args: (a: number, b: number) => a + b,
          // @ts-expect-error -- Target signature provides too few arguments. Expected 3 or more, but got 1.ts(2322)
          requiring3Args: (a: number, b: number | undefined, c: number) =>
            a + (b ?? 0) + c,
        }
      );
    });

    it('accept function whose second and subsequent arguments are optional', function () {
      const result = evolve(
        {
          arg2Optional: 1,
          arg2arg3Optional: 1,
        },
        {
          arg2Optional: (arg1: number, arg2?: number) => arg2 === undefined,
          arg2arg3Optional: (arg1: number, arg2?: number, arg3?: number) =>
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
  });

  describe('data last', () => {
    describe('it can detect mismatch of parameters and arguments', function () {
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
      // @ts-expect-error -- Type 'number' has no properties in common with type '{ a?: number | undefined; }'.ts(2345)
      const result = pipe(0, evolve(transf));
      expect(result).toEqual(0); // ignores transformations if the input value is not Array and Object

      // @ts-expect-error -- Type 'undefined' is not assignable to type '{ a?: number | undefined; }'.ts(2345)
      pipe(undefined, evolve(transf));
      // @ts-expect-error -- Type 'null' is not assignable to type '{ a?: number | undefined; }'.ts(2345)
      pipe(null, evolve(transf));
      // @ts-expect-error -- Type 'string' has no properties in common with type '{ a?: number | undefined; }'.ts(2345)
      pipe('', evolve(transf));
    });

    it('does not accept function that require multiple arguments', function () {
      pipe(
        {
          requiring2Args: 1,
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
          arg2Optional: 1,
          arg2arg3Optional: 1,
        },
        evolve({
          arg2Optional: (arg1: number, arg2?: number) => arg2 === undefined,
          arg2arg3Optional: (arg1: number, arg2?: number, arg3?: string) =>
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
  });
});
