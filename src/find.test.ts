import { find } from './find';
import { pipe } from './pipe';
import { createCounter } from './_counter';

const array = [
  { a: 1, b: 1 },
  { a: 1, b: 2 },
  { a: 2, b: 1 },
  { a: 1, b: 3 },
] as const;
const expected = { a: 1, b: 2 };

describe('data first', () => {
  test('find', () => {
    expect(find(array, x => x.b === 2)).toEqual(expected);
  });
  test('find.indexed', () => {
    expect(find.indexed(array, (x, idx) => x.b === 2 && idx === 1)).toEqual(
      expected
    );
  });
});

describe('data last', () => {
  test('find', () => {
    const counter = createCounter();
    const actual = pipe(
      array,
      counter.fn(),
      find(x => x.b === 2)
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(expected);
  });

  test('find.indexed', () => {
    const counter = createCounter();
    const actual = pipe(
      array,
      counter.fn(),
      find.indexed((x, idx) => x.b === 2 && idx === 1)
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(expected);
  });
});
