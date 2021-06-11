import { sortBy } from './sortBy';
import { pipe } from './pipe';

const items = [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }] as const;
const sorted = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }];

const objects = [
  { color: 'red', weight: 2 },
  { color: 'blue', weight: 3 },
  { color: 'green', weight: 1 },
  { color: 'purple', weight: 1 },
];

describe('data first', () => {
  test('sort correctly', () => {
    expect(sortBy(items, x => x.a)).toEqual(sorted);
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
  test('sort objects descending correctly', () => {
    expect(sortBy(objects, [x => x.weight, 'desc']).map(x => x.weight)).toEqual([
      3, 2, 1, 1,
    ]);
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
  test('sort objects correctly', () => {
    const sortFn = sortBy<{ weight: number; color: string }>(
        x => x.weight,
        x => x.color
    );
    expect(
      sortFn(objects).map(x => x.color)
    ).toEqual(['green', 'purple', 'red', 'blue']);
  });
  test('sort objects correctly by weight asc then color desc', () => {
    expect(
      sortBy<{ weight: number; color: string }>(
        [x => x.weight, 'asc'],
        [x => x.color, 'desc']
      )(objects).map(x => x.color)
    ).toEqual(['purple', 'green', 'red', 'blue']);
  });
});
