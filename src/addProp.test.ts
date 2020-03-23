import { addProp } from './addProp';
import { pipe } from './pipe';

describe('data first', () => {
  test('addProp', () => {
    const actual = addProp({ a: 1 }, 'b', 2);
    expect(actual).toEqual({ a: 1, b: 2 });
  });
});

describe('data last', () => {
  test('addProp', () => {
    const actual = pipe({ a: 1 }, addProp('b', 2));
    expect(actual).toEqual({ a: 1, b: 2 });
  });
});
