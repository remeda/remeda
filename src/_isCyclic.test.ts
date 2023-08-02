import { isCyclic } from './_isCyclic'; // replace 'yourFilePath' with the actual file path

describe('hasCycle', () => {
  test('should return false for non-objects', () => {
    expect(isCyclic(123)).toBe(false);
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
});
