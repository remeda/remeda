import { once } from './once';

test('should call only once', () => {
  const mock = vi.fn(() => ({}));
  const wrapped = once(mock as () => object);
  const ret1 = wrapped();
  expect(mock).toHaveBeenCalledTimes(1);
  const ret2 = wrapped();
  expect(mock).toHaveBeenCalledTimes(1);
  expect(ret1).toBe(ret2);
});
