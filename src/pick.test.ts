import { pick } from './pick';
import { pipe } from './pipe';
import { concat } from './concat';

describe('data first', () => {
  test('it should pick props', () => {
    const result = pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']);
    expect(result).toStrictEqual({ a: 1, d: 4 });
  });
  test('allow undefined or null', () => {
    expect(pick(undefined as any, ['foo'])).toEqual({});
    expect(pick(null as any, ['foo'])).toEqual({});
  });
  test('support inherited properties', () => {
    class BaseClass {
      testProp() {return 'abc'};
    }
    class TestClass extends BaseClass { }
    const testClass = new TestClass();
    expect(pick(testClass, ['testProp'])).toEqual({ testProp: expect.any(Function) })
  });
});

describe('data last', () => {
  test('it should pick props', () => {
    const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, pick(['a', 'd']));
    expect(result).toEqual({ a: 1, d: 4 });
  });
});

test('read only', () => {
  concat([1, 2], [3, 4] as const);
  // or similar:
  // const props: ReadonlyArray<string> = ["prop1", "prop2"];
  // const getProps = <T extends string>(props: readonly T[]) => props;
  const someObject = { prop1: 'a', prop2: 2, a: 'b' };
  const props = ['prop1', 'prop2'] as const;
  pick(someObject, props); // TS2345 compilation error
});
