import { zip } from './zip';

const first = [1, 2, 3];
const last = ['a', 'b', 'c'];
const shorterFirst = [1, 2];
const shorterLast = ['a', 'b']

describe('data first', () => {
  test('should zip', () => {
    expect(zip(first, last)).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  })
  test('should truncate to shorter last', () => {
    expect(zip(first, shorterLast)).toEqual([[1, 'a'], [2, 'b']]);
  })
  test('should truncate to shorter first', () => {
    expect(zip(shorterFirst, last)).toEqual([[1, 'a'], [2, 'b']])
  })
})

describe('data last', () => {
  test('should zip', () => {
    expect(zip(last)(first)).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  })
  test('should truncate to shorter last', () => {
    expect(zip(shorterLast)(first)).toEqual([[1, 'a'], [2, 'b']]);
  })
  test('should truncate to shorter first', () => {
    expect(zip(last)(shorterFirst)).toEqual([[1, 'a'], [2, 'b']])
  })
})
