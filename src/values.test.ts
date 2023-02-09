import { values } from './values';

describe('Test for values as data first', () => {
  it('should return values of array', () => {
    expect(values(['x', 'y', 'z'])).toEqual(['x', 'y', 'z']);
  });

  it('should return values of object', () => {
    expect(values({ a: 'x', b: 'y', c: 'z' })).toEqual(['x', 'y', 'z']);
  });
});
