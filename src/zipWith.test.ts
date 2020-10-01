import { zipWith } from './zipWith';

const pred = (a: string, b: string) => a + b

const first = ['1', '2', '3'];
const second = ['a', 'b', 'c'];
const shorterFirst = ['1', '2'];
const shorterSecond = ['a', 'b']

describe('data first', () => {
  test('should zip with predicate', () => {
    expect(zipWith(first, second, pred)).toEqual(['1a', '2b', '3c']);
  })
  test('should truncate to shorter second', () => {
    expect(zipWith(first, shorterSecond, pred)).toEqual(['1a', '2b']);
  })
  test('should truncate to shorter first', () => {
    expect(zipWith(shorterFirst, second, pred)).toEqual(['1a', '2b'])
  })
})

describe('data second', () => {
  test('should zip with predicate', () => {
    expect(zipWith(pred)(first, second)).toEqual(['1a', '2b', '3c']);
  })
  test('should truncate to shorter second', () => {
    expect(zipWith(pred)(first, shorterSecond)).toEqual(['1a', '2b']);
  })
  test('should truncate to shorter first', () => {
    expect(zipWith(pred)(shorterFirst, second)).toEqual(['1a', '2b'])
  })
})

describe('data second with initial arg', () => {
  test('should zip with predicate', () => {
    expect(zipWith(pred, second)(first)).toEqual(['1a', '2b', '3c']);
  })
  test('should truncate to shorter second', () => {
    expect(zipWith(pred, shorterSecond)(first)).toEqual(['1a', '2b']);
  })
  test('should truncate to shorter first', () => {
    expect(zipWith(pred, second)(shorterFirst)).toEqual(['1a', '2b'])
  })
})
