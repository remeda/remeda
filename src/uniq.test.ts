import { uniq } from './uniq';

it('uniq', () => {
  expect(uniq([1, 2, 2, 5, 1, 6, 7])).toEqual([1, 2, 5, 6, 7]);
});
