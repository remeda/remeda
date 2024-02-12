import { concat } from './concat';
import { pick } from './pick';
import { pipe } from './pipe';

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
      testProp() {
        return 'abc';
      }
    }
    class TestClass extends BaseClass {}
    const testClass = new TestClass();
    expect(pick(testClass, ['testProp'])).toEqual({
      testProp: expect.any(Function),
    });
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

describe('typing', () => {
  describe('data first', () => {
    test('non existing prop', () => {
      // @ts-expect-error [ts2322] -- should not allow non existing props
      pick({ a: 1, b: 2, c: 3, d: 4 }, ['not', 'in']);
    });

    test('complex type', () => {
      const obj = { a: 1 } as { a: number } | { a?: number; b: string };
      const result = pick(obj, ['a']);
      expectTypeOf(result).toEqualTypeOf<
        Pick<{ a: number } | { a?: number; b: string }, 'a'>
      >();
    });
  });

  describe('data last', () => {
    test('non existing prop', () => {
      pipe(
        { a: 1, b: 2, c: 3, d: 4 },
        // @ts-expect-error [ts2345] -- should not allow non existing props
        pick(['not', 'in'])
      );
    });

    test('complex type', () => {
      const obj = { a: 1 } as { a: number } | { a?: number; b: string };
      const result = pipe(obj, pick(['a']));
      expectTypeOf(result).toEqualTypeOf<
        Pick<{ a: number } | { a?: number; b: string }, 'a'>
      >();
    });
  });

  test('multiple type', () => {
    type Data = { aProp: string; bProp: string };

    const obj: Data = {
      aProp: 'p1',

      bProp: 'p2',
    };

    const result = pipe(obj, pick(['aProp', 'bProp']));

    expectTypeOf(result).toEqualTypeOf<Pick<Data, 'aProp' | 'bProp'>>();
  });
});
