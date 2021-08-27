import { pickBy } from './pickBy';
import { pipe } from './pipe';
import { identity } from './identity';

describe('data first', () => {
  test('it should pick props', () => {
    const result = pickBy(
      { a: 1, b: 2, c: 3, d: 4 },
      value => value === 1 || value === 4
    );
    expect(result).toStrictEqual({ a: 1, d: 4 });
  });

  test('it should pick props using keys', () => {
    const result = pickBy(
      { a: 1, b: 2, c: 3, d: 4 },
      (value, key) => key === 'a' || key === 'd'
    );
    expect(result).toStrictEqual({ a: 1, d: 4 });
  });

  test('allow undefined or null', () => {
    expect(pickBy(undefined as any, identity)).toEqual({});
    expect(pickBy(null as any, identity)).toEqual({});
  });

  test('support inherited properties', () => {
    class BaseClass {
      testProp() {
        return 'abc';
      }
    }
    class TestClass extends BaseClass {}
    const testClass = new TestClass();
    expect(pickBy(testClass, (value, key) => key === 'testProp')).toEqual({
      testProp: expect.any(Function),
    });
  });
});

describe('data last', () => {
  test('it should pick props', () => {
    const result = pipe(
      { a: 1, b: 2, c: 3, d: 4 },
      pickBy(value => value === 1 || value === 4)
    );
    expect(result).toEqual({ a: 1, d: 4 });
  });
});
