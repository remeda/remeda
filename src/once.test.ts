import { once } from './once';

test('should call only once', () => {
  const mock = jest.fn();
  const wrapped = once(mock);
  wrapped();
  expect(mock).toHaveBeenCalledTimes(1);
  wrapped();
  expect(mock).toHaveBeenCalledTimes(1);
});
