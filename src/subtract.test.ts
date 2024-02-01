import { subtract } from './subtract';

test('data-first', () => {
  expect(subtract(10, 5)).toEqual(5);
  expect(subtract(10, -5)).toEqual(15);
});

test('data-last', () => {
  expect(subtract(5)(10)).toEqual(5);
  expect(subtract(-5)(10)).toEqual(15);
});
