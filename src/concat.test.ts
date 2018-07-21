import { concat } from './concat';
import { pipe } from './pipe';

describe('data first', () => {
  test('concat', () => {
    const actual = concat([1, 2, 3], ['a']);
    expect(actual).toEqual([1, 2, 3, 'a']);
  });
});

describe('data last', () => {
  test('concat', () => {
    const actual = pipe(
      [1, 2, 3],
      concat(['a'])
    );
    expect(actual).toEqual([1, 2, 3, 'a']);
  });
});
