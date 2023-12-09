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

describe('curried form', () => {
  test('it should pick props', () => {
    const pickFoo = pick(['foo']);

    expectTypeOf(true as unknown as ReturnType<typeof pickFoo>).toEqualTypeOf<{
      foo: unknown;
    }>();

    const result = pickFoo({ foo: 1, bar: 'potato' });

    expectTypeOf(result).toEqualTypeOf<{ foo: number }>();
    expect(result).toEqual({ foo: 1 });
  });
});

describe('typing', () => {
  describe('data first', () => {
    test('non existing prop', () => {
      // @ts-expect-error [ts2322] -- should not allow non existing props
      pick({ a: 1, b: 2, c: 3, d: 4 }, ['not', 'in']);
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
  });

  describe('curried form', () => {
    test('non existing prop', () => {
      const pickFoo = pick(['foo']);

      // @ts-expect-error [ts2353] -- should not allow non existing props
      pickFoo({ bar: 'potato', baz: 123 });
    });
  });
});
