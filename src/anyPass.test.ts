import { anyPass } from './anyPass';

const fns = [(x: number) => x === 3, (x: number) => x === 4] as const;

describe('data first', () => {
  test('anyPass', () => {
    expect(anyPass(3, fns)).toEqual(true);
    expect(anyPass(4, fns)).toEqual(true);
    expect(anyPass(1, fns)).toEqual(false);
  });
});

describe('data last', () => {
  test('anyPass', () => {
    expect(anyPass(fns)(3)).toEqual(true);
    expect(anyPass(fns)(4)).toEqual(true);
    expect(anyPass(fns)(1)).toEqual(false);
  });
});
