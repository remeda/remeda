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

  // @ts-expect-error this property does not exist
  expect(pipe(obj, hasProp('d'))).toBe(false);
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
