import { pipe } from './pipe';
import { prop } from './prop';

test('prop', () => {
  const result = pipe({ foo: 'bar' }, prop('foo'));
  expect(result).toEqual('bar');
});

test('type for curried form', () => {
  const propFoo = prop('foo');

  const result = propFoo({ foo: 1, bar: 'potato' });

  expectTypeOf(result).toEqualTypeOf<number>();

  expect(result).toBe(1);

  // without the key
  const r2 = propFoo({ bar: 'potato' });
  expect(r2).toBe(undefined);

  // can specify the target object type at creation
  const propBar = prop('bar')<{ bar: number; baz: boolean }>;

  expectTypeOf(
    true as any as ReturnType<typeof propBar>
  ).toEqualTypeOf<number>();
});
