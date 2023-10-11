import { pipe } from './pipe';
import { unset } from './unset';

describe('data first', () => {
  test('unset', () => {
    expect(unset({ a: 1 }, 'a')).toEqual({});
    expect(unset({ a: { b: 1 } }, 'a')).toEqual({});
    expect(unset({ a: 1, b: 2 }, 'a')).toEqual({ b: 2 });
  });

  test("prop that doesn't exist", () => {
    const data = { a: 1 };
    const actual = unset(data, 'b');
    expect(actual).toEqual(data);
    assert.notStrictEqual(actual, data);
  });

  test('abstract type', () => {
    const obj: object = { a: 1 };
    expect(unset(obj, 'a')).toEqual({});
  });

  it('should handle nil', () => {
    expect(unset(null, 'a')).toEqual(null);
  });
});

describe('data last', () => {
  test('unset', () => {
    expect(pipe({ a: 1 }, unset('a'))).toEqual({});
  });

  test('abstract type', () => {
    const obj: object = { a: 1 };
    expect(pipe(obj, unset('a'))).toEqual({});
  });
});

describe('strict', () => {
  describe('data first', () => {
    test('unset', () => {
      expect(pipe({ a: 1 }, unset.strict('a'))).toEqual({});
    });

    test("prop that doesn't exist", () => {
      // @ts-expect-error -- we can't pass a prop that doesn't exist
      expect(pipe({ a: 1 }, unset.strict('b'))).toEqual({ a: 1 });
    });

    test('abstract type', () => {
      const obj: object = { a: 1 };
      // @ts-expect-error -- we can't use abstract type in strict mode
      expect(unset.strict(obj, 'a')).toEqual({});
    });
  });

  describe('data last', () => {
    test('unset', () => {
      expect(pipe({ a: 1 }, unset.strict('a'))).toEqual({});
    });

    test("prop that doesn't exist", () => {
      // @ts-expect-error -- we can't pass a prop that doesn't exist
      expect(pipe({ a: 1 }, unset.strict('b'))).toEqual({ a: 1 });
    });

    test('abstract type', () => {
      const obj: object = { a: 1 };
      // @ts-expect-error -- we can't use abstract type in strict mode
      expect(pipe(obj, unset.strict('a'))).toEqual({});
    });
  });
});
