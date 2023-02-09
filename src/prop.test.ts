import { pipe } from './pipe';
import { prop } from './prop';

test('prop', () => {
  const result = pipe({ foo: 'bar' }, prop('foo'));
  expect(result).toEqual('bar');
});
