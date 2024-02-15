import { filter } from './filter';
import { hasProp } from './hasProp';
import { pipe } from './pipe';

const obj = { a: 1, b: undefined, 1: 'hi' } as
  | { a: number; b?: number | undefined }
  | { c: number; 1: string };

test('data-first', () => {
  expect(hasProp(obj, 'a')).toBe(true);
  expect(hasProp(obj, 'b')).toBe(false);
  expect(hasProp(obj, 'c')).toBe(false);
  expect(hasProp(obj, 1)).toBe(true);
  expect(hasProp([0], 0)).toBe(true);
  expect(hasProp([0], 1)).toBe(false);
  expect(hasProp([0], 'concat')).toBe(true);

  // @ts-expect-error this property does not exist
  expect(hasProp(obj, 'd')).toBe(false);
  // @ts-expect-error this property does not exist
  expect(hasProp(obj, 2)).toBe(false);
});

test('data-last', () => {
  expect(pipe(obj, hasProp('a'))).toBe(true);
  expect(pipe(obj, hasProp('b'))).toBe(false);
  expect(pipe(obj, hasProp('c'))).toBe(false);
  expect(pipe(obj, hasProp(1))).toBe(true);
  expect(pipe([0], hasProp(0))).toBe(true);
  expect(pipe([0], hasProp(1))).toBe(false);
  expect(pipe([0], hasProp('concat'))).toBe(true);

  // @ts-expect-error this property does not exist
  expect(pipe(obj, hasProp('d'))).toBe(false);
  // @ts-expect-error this property does not exist
  expect(pipe(obj, hasProp(2))).toBe(false);
});

test('conditional type narrowing', () => {
  if (hasProp(obj, 'a')) {
    expectTypeOf(obj).toEqualTypeOf<{ a: number; b?: number | undefined }>();
  }

  if (hasProp(obj, 'b')) {
    expectTypeOf(obj).toEqualTypeOf<{ a: number; b: number }>();
  }

  if (hasProp(obj, 'c')) {
    expectTypeOf(obj).toEqualTypeOf<{ c: number; 1: string }>();
  }

  if (hasProp(obj, 1)) {
    expectTypeOf(obj).toEqualTypeOf<{ c: number; 1: string }>();
  }

  const tuple = [0] as [0] | [1, 2];
  if (hasProp(tuple, 1)) {
    expectTypeOf(tuple).toEqualTypeOf<[1, 2]>();
  }

  const arr = [0];
  if (hasProp(arr, 0)) {
    expectTypeOf(arr).toEqualTypeOf<Array<number>>();
  }

  if (hasProp(arr, 'concat')) {
    expectTypeOf(arr).toEqualTypeOf<Array<number>>();
  }
});

test('array filter type narrowing', () => {
  type CompletedTodo = { type: 'completed'; completedReason: string };
  type CancelledTodo = { type: 'cancelled'; cancelledReason: string };
  type TodoItem = CompletedTodo | CancelledTodo;
  const todos = [
    { type: 'completed', completedReason: 'done' },
  ] as Array<TodoItem>;

  const completedItems = todos.filter(hasProp('completedReason'));
  const completedItem = completedItems[0];
  expectTypeOf(completedItem).toEqualTypeOf<CompletedTodo>();

  const cancelledItems = pipe(todos, filter(hasProp('cancelledReason')));
  const cancelledItem = cancelledItems[0];
  expectTypeOf(cancelledItem).toEqualTypeOf<CancelledTodo>();
});
