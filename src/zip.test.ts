import { zip } from './zip';

const first = [1, 2, 3];
const second = ['a', 'b', 'c'];
const shorterFirst = [1, 2];
const shorterSecond = ['a', 'b']

describe('data first', () => {
  test('should zip', () => {
    expect(zip(first, second)).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  })
  test('should truncate to shorter second', () => {
    expect(zip(first, shorterSecond)).toEqual([[1, 'a'], [2, 'b']]);
  })
  test('should truncate to shorter first', () => {
    expect(zip(shorterFirst, second)).toEqual([[1, 'a'], [2, 'b']])
  })
})

describe('data second', () => {
  test('should zip', () => {
    expect(zip(second)(first)).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  })
  test('should truncate to shorter second', () => {
    expect(zip(shorterSecond)(first)).toEqual([[1, 'a'], [2, 'b']]);
  })
  test('should truncate to shorter first', () => {
    expect(zip(second)(shorterFirst)).toEqual([[1, 'a'], [2, 'b']])
  })
})
