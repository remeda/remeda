import { matches } from './matches';

test('basic', () => {
  expect(matches(1, 1)).toBeTruthy();
  expect(matches(1, 2)).not.toBeTruthy();
  expect(matches({ a: 1, b: 2 }, { a: 1 })).toBeTruthy();
  expect(matches({ a: 2, b: 2 }, { a: 1 })).not.toBeTruthy();
  expect(
    matches([1, 1, { a: 3 }], { 2: { a: (x: number) => x > 2 } })
  ).toBeTruthy();

  expect(matches({ a: 4, b: 5, c: 6 }, { a: 4, c: 6 })).toEqual(true);
});

test('data last', () => {
  const partial = matches(1);

  expect(partial(1)).toBeTruthy();
  expect(partial(2)).toBeFalsy();
  expect(matches({ a: 4, c: 6 })({ a: 4, b: 5, c: 6 })).toEqual(true);
});
