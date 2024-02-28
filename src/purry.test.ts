import { purry } from './purry';

function sub(a: number, b: number) {
  return a - b;
}

test('all arguments', () => {
  function fn(...args: ReadonlyArray<unknown>) {
    return purry(sub, args);
  }
  expect(fn(10, 5)).toEqual(5);
});

test('1 missing', () => {
  function fn(...args: ReadonlyArray<unknown>) {
    return purry(sub, args);
  }
  const purried = fn(5) as (...args: ReadonlyArray<unknown>) => unknown;
  expect(purried(10)).toEqual(5);
});

test('wrong number of arguments', () => {
  function fn(...args: ReadonlyArray<unknown>) {
    return purry(sub, args);
  }
  expect(() => fn(5, 10, 40)).toThrowError('Wrong number of arguments');
});
