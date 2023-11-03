import { identity } from './identity';
import { pipe } from './pipe';
import { sortBy } from './sortBy';

const items = [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }] as const;
const sorted = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }];

function assertType<T>(data: T): T {
  return data;
}

const objects = [
  { id: 1, color: 'red', weight: 2, active: true, date: new Date(2021, 1, 1) },
  {
    id: 2,
    color: 'blue',
    weight: 3,
    active: false,
    date: new Date(2021, 1, 2),
  },
  {
    id: 3,
    color: 'green',
    weight: 1,
    active: false,
    date: new Date(2021, 1, 3),
  },
  {
    id: 4,
    color: 'purple',
    weight: 1,
    active: true,
    date: new Date(2021, 1, 4),
  },
];

describe('data first', () => {
  test('sort correctly', () => {
    expect(sortBy(items, x => x.a)).toEqual(sorted);
  });
  test('sort booleans correctly', () => {
    expect(sortBy(objects, [x => x.active, 'desc']).map(x => x.active)).toEqual(
      [true, true, false, false]
    );
  });
  test('sort dates correctly', () => {
    expect(sortBy(objects, [x => x.date, 'desc']).map(x => x.id)).toEqual([
      4, 3, 2, 1,
    ]);
  });
  test('sort objects correctly', () => {
    expect(
      sortBy(
        objects,
        x => x.weight,
        x => x.color
      ).map(x => x.weight)
    ).toEqual([1, 1, 2, 3]);
  });
  test('sort objects correctly mixing sort pair and sort projection', () => {
    expect(
      sortBy(objects, x => x.weight, [x => x.color, 'asc']).map(x => x.weight)
    ).toEqual([1, 1, 2, 3]);
  });
  test('sort objects descending correctly', () => {
    expect(sortBy(objects, [x => x.weight, 'desc']).map(x => x.weight)).toEqual(
      [3, 2, 1, 1]
    );
  });

  describe('sortBy typings', () => {
    test('SortProjection', () => {
      const actual = sortBy(items, x => x.a);
      type T = (typeof items)[number];
      assertType<Array<T>>(actual);
    });
    test('SortPair', () => {
      const actual = sortBy(objects, [x => x.active, 'desc']);
      type T = (typeof objects)[number];
      assertType<Array<T>>(actual);
    });
  });
});

describe('data last', () => {
  test('sort correctly', () => {
    expect(
      pipe(
        items,
        sortBy(x => x.a)
      )
    ).toEqual(sorted);
  });
  test('sort correctly using pipe and "desc"', () => {
    expect(pipe(items, sortBy([x => x.a, 'desc']))).toEqual(
      [...sorted].reverse()
    );
  });
  test('sort objects correctly', () => {
    const sortFn = sortBy<{ weight: number; color: string }>(
      x => x.weight,
      x => x.color
    );
    expect(sortFn(objects).map(x => x.color)).toEqual([
      'green',
      'purple',
      'red',
      'blue',
    ]);
  });
  test('sort objects correctly by weight asc then color desc', () => {
    expect(
      sortBy<{ weight: number; color: string }>(
        [x => x.weight, 'asc'],
        [x => x.color, 'desc']
      )(objects).map(x => x.color)
    ).toEqual(['purple', 'green', 'red', 'blue']);
  });

  describe('sortBy typings', () => {
    test('SortProjection', () => {
      const actual = pipe(
        items,
        sortBy(x => x.a)
      );
      type T = (typeof items)[number];
      assertType<Array<T>>(actual);
    });
    test('SortPair', () => {
      const actual = pipe(
        objects,
        sortBy([x => x.weight, 'asc'], [x => x.color, 'desc'])
      );
      type T = (typeof objects)[number];
      assertType<Array<T>>(actual);
    });
  });
});

describe('strict', () => {
  it('on empty tuple', () => {
    const array: [] = [];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on empty readonly tuple', () => {
    const array: readonly [] = [];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on array', () => {
    const array: Array<number> = [];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('on readonly array', () => {
    const array: ReadonlyArray<number> = [];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('on tuple', () => {
    const array: [1, 2, 3] = [1, 2, 3];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
  });

  it('on readonly tuple', () => {
    const array: readonly [1, 2, 3] = [1, 2, 3];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
  });

  it('on tuple with rest tail', () => {
    const array: [number, ...Array<number>] = [1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it('on readonly tuple with rest tail', () => {
    const array: readonly [number, ...Array<number>] = [1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  test('on tuple with rest middle', () => {
    const array: [number, ...Array<number>, number] = [3, 2, 1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>, number]>();
  });

  test('on readonly tuple with rest middle', () => {
    const array: readonly [number, ...Array<number>, number] = [3, 2, 1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>, number]>();
  });

  it('on tuple with rest head', () => {
    const array: [...Array<number>, number] = [1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  it('on readonly tuple with rest head', () => {
    const array: readonly [...Array<number>, number] = [1];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  test('on tuple with optional values', () => {
    const array: [number?, number?, number?] = [];
    const result = sortBy.strict(array, () => 0);
    expectTypeOf(result).toEqualTypeOf<[number?, number?, number?]>();
  });

  test('on readonly tuple with optional values', () => {
    const array: readonly [number?, number?, number?] = [];
    const result = sortBy.strict(array, () => 0);
    expectTypeOf(result).toEqualTypeOf<[number?, number?, number?]>();
  });

  it('on mixed types tuple', () => {
    const array: [number, string, boolean] = [1, 'hello', true];
    const result = sortBy.strict(array, identity);
    expectTypeOf(result).toEqualTypeOf<
      [
        number | string | boolean,
        number | string | boolean,
        number | string | boolean,
      ]
    >();
  });
});
