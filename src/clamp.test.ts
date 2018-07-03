import { clamp } from './clamp';

it('min value', () => {
  expect(clamp(10, { min: 20 })).toEqual(20);
});

it('max value', () => {
  expect(clamp(10, { max: 5 })).toEqual(5);
});

it('ok value', () => {
  expect(clamp(10, { max: 20, min: 5 })).toEqual(10);
});
