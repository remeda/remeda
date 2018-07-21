import { merge } from './merge';

const a = {
  x: 1,
  y: 2,
};

const b = {
  y: 10,
  z: 2,
};

describe('data first', () => {
  test('should merge', () => {
    expect(merge(a, b)).toEqual({ x: 1, y: 10, z: 2 });
  });
});

describe('data last', () => {
  test('should merge', () => {
    expect(merge(b)(a)).toEqual({ x: 1, y: 10, z: 2 });
  });
});
