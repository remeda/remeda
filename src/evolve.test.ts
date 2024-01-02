import { pipe } from './pipe';
import { evolve } from './evolve';
import { omit } from './omit';
import { set } from './set';
import { identity } from './identity';
import { map } from './map';

const add = (x: number) => (y: number) => x + y;

describe('data first', () => {
  it('creates a new object by evolving the `object` according to the `transformation` functions', function () {
    const transf = { elapsed: add(1), remaining: add(-1) };
    const object = { name: 'Tomato', elapsed: 100, remaining: 1400 };
    const expected = { name: 'Tomato', elapsed: 101, remaining: 1399 };
    const result = evolve(object, transf);
    expect(result).toEqual(expected);
    expect(result).not.toBe(expected);
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

  it('is not destructive', function () {
    const transf = { elapsed: add(1), remaining: add(-1) };
    const object = { name: 'Tomato', elapsed: 100, remaining: 1400 };
    const expected = { name: 'Tomato', elapsed: 100, remaining: 1400 };
    evolve(transf, object);
    expect(object).toEqual(expected);
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
    expectTypeOf(result).toEqualTypeOf<typeof expected>();
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

  describe('ignores transformations if the input value is not Array and Object', function () {
    it('handle number', function () {
      const transf = { a: add(1) };
      const result = evolve(0, transf);
      const expected = 0;
      expect(result).toEqual(expected);
      expectTypeOf(result).toEqualTypeOf<typeof expected>();
    });
    it('handle undefined', function () {
      const transf = { a: add(1) };
      const result = evolve(undefined, transf);
      const expected = undefined;
      expect(result).toEqual(expected);
      expectTypeOf(result).toEqualTypeOf<typeof expected>();
    });
    it('handle null', function () {
      const transf = { a: add(1) };
      const result = evolve(null, transf);
      const expected = null;
      expect(result).toEqual(expected);
      expectTypeOf(result).toEqualTypeOf<typeof expected>();
    });
    it('handle string', function () {
      const transf = { a: add(1) };
      const result = evolve('', transf);
      const expected = '';
      expect(result).toEqual(expected);
      expectTypeOf(result).toEqualTypeOf<typeof expected>();
    });
  });

  it('can handle complex nested objects', function () {
    const result = evolve(
      {
        array: ['1', '2', '3'],
        nestedObj: { a: { b: 'c' } },
        objAry: [
          { a: 0, b: 0 },
          { a: 1, b: 1 },
        ],
      },
      {
        array: (array: Array<string>) => array.length,
        nestedObj: { a: set<{ b: string }, 'b'>('b', 'Set') },
        objAry: map(omit<{ a: number; b: number }, 'b'>(['b'])),
      }
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
    const transf = { elapsed: add(1), remaining: add(-1) };
    const object = { name: 'Tomato', elapsed: 100, remaining: 1400 };
    const expected = { name: 'Tomato', elapsed: 101, remaining: 1399 };
    const result = pipe(object, evolve(transf));
    expect(result).toEqual(expected);
    expect(result).not.toBe(expected);
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

  it('is not destructive', function () {
    const transf = { elapsed: add(1), remaining: add(-1) };
    const object = { name: 'Tomato', elapsed: 100, remaining: 1400 };
    const expected = { name: 'Tomato', elapsed: 100, remaining: 1400 };
    pipe(object, evolve(transf));
    expect(object).toEqual(expected);
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

  describe('ignores transformations if the input value is not Array and Object', function () {
    it('handle number', function () {
      const transf = { a: add(1) };
      const result = pipe(0, evolve(transf));
      const expected = 0 as number;
      expect(result).toEqual(expected);
      expectTypeOf(result).toMatchTypeOf<typeof expected>();
    });
    it('handle undefined', function () {
      const transf = { a: add(1) };
      const result = pipe(undefined, evolve(transf));
      const expected = undefined;
      expect(result).toEqual(expected);
      expectTypeOf(result).toEqualTypeOf<typeof expected>();
    });
    it('handle null', function () {
      const transf = { a: add(1) };
      const result = pipe(null, evolve(transf));
      const expected = null;
      expect(result).toEqual(expected);
      expectTypeOf(result).toEqualTypeOf<typeof expected>();
    });
    it('handle string', function () {
      const transf = { a: add(1) };
      const result = pipe('', evolve(transf));
      const expected = '' as string;
      expect(result).toEqual(expected);
      expectTypeOf(result).toEqualTypeOf<typeof expected>();
    });
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
