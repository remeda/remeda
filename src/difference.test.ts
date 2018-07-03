import { difference } from './difference';

const source = [1, 2, 3, 4];
const other = [2, 5, 3];
const expected = [1, 4];

describe('data_first', () => {
  test('should return difference', () => {
    expect(difference(source, other)).toEqual(expected);
  });
});

describe('data_last', () => {
  test('should return difference', () => {
    expect(difference(other)(source)).toEqual(expected);
  });
});
