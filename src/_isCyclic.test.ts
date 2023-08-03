import { isCyclic } from './_isCyclic';
import { expect, test } from 'vitest';

describe('hasCycle', () => {
  test('should return false for non-objects', () => {
    expect(isCyclic(123)).toBeFalsy();
    expect(isCyclic('string')).toBeFalsy();
    expect(isCyclic(null)).toBeFalsy();
    expect(isCyclic(undefined)).toBeFalsy();
  });

  test('should return false for non-cyclic objects', () => {
    const nonCyclicObject = { a: 1, b: 2, c: 3 };
    expect(isCyclic(nonCyclicObject)).toBeFalsy();

    const nonCyclicArray = [1, 2, 3, 4, 5];
    expect(isCyclic(nonCyclicArray)).toBeFalsy();

    const complexNonCyclicObject = { a: 1, b: { ba: 1, bb: 2 }, c: [1, 2, 3] };
    expect(isCyclic(complexNonCyclicObject)).toBeFalsy();
  });

  test('should return true for cyclic objects', () => {
    const cyclicObject: any = {};
    cyclicObject.a = cyclicObject;
    expect(isCyclic(cyclicObject)).toBeTruthy();

    const cyclicArray: Array<any> = [1, 2, 3];
    cyclicArray.push(cyclicArray);
    expect(isCyclic(cyclicArray)).toBeTruthy();

    const complexCyclicObject: any = {
      a: 1,
      b: { ba: 1, bb: 2 },
      c: [1, 2, 3],
    };
    complexCyclicObject.c.push(complexCyclicObject);
    expect(isCyclic(complexCyclicObject)).toBeTruthy();
  });

  test('should return false for non-cyclic Map and Set', () => {
    const nonCyclicMap = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    expect(isCyclic(nonCyclicMap)).toBeFalsy();

    const nonCyclicSet = new Set(['a', 1, 'b', 2, 'c', 3]);
    expect(isCyclic(nonCyclicSet)).toBeFalsy();
  });

  test('should return true for cyclic Map and Set', () => {
    const cyclicMap: any = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    cyclicMap.set('a', cyclicMap);
    expect(isCyclic(cyclicMap)).toBeTruthy();

    const cyclicSet: any = new Set(['a', 1, 'b', 2, 'c', 3]);
    cyclicSet.add(cyclicSet);
    expect(isCyclic(cyclicSet)).toBeTruthy();
  });

  test('should handle extremely nested objects', () => {
    const nestedObj = createNestedObject(100000);
    // Expect to not throw error "RangeError: Maximum call stack size exceeded"
    expect(isCyclic(nestedObj)).toBeFalsy();
  });

  test('should handle cycles across multiple objects', () => {
    const objA: any = {};
    const objB: any = {};
    const objC: any = {};

    objA.b = objB;
    objB.c = objC;
    objC.a = objA;

    expect(isCyclic(objA)).toBeTruthy();
  });
});

function createNestedObject(depth: number) {
  const nestedObject: any = {};
  let current = nestedObject;

  for (let i = 0; i < depth; i++) {
    current[i] = {};
    current = current[i];
  }

  return nestedObject;
}
