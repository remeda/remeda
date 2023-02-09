import { pipe } from './pipe';
import { set } from './set';

describe('data first', () => {
  test('set', () => {
    expect(set({ a: 1 }, 'a', 2)).toEqual({ a: 2 });
  });
});

describe('data last', () => {
  test('set', () => {
    expect(pipe({ a: 1 }, set('a', 2))).toEqual({ a: 2 });
  });
});
