import { reduce } from './reduce';
import { pipe } from './pipe';

const array = [1, 2, 3, 4, 5] as const;

describe('data first', () => {
  test('reduce', () => {
    expect(reduce(array, (acc, x) => acc + x, 100)).toEqual(115);
  });
  test('reduce.indexed', () => {
    let i = 0;
    expect(
      reduce.indexed(
        array,
        (acc, x, index, items) => {
          expect(index).toBe(i);
          expect(items).toBe(array);
          i++;
          return acc + x;
        },
        100
      )
    ).toEqual(115);
  });
});

describe('data last', () => {
  test('reduce', () => {
    expect(
      pipe(
        array,
        reduce((acc, x) => acc + x, 100)
      )
    ).toEqual(115);
  });

  test('reduce.indexed', () => {
    expect(
      pipe(
        array,
        reduce.indexed((acc, x) => acc + x, 100)
      )
    ).toEqual(115);
  });
});
