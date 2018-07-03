import { compact } from './compact';

test('filter correctly', () => {
  const items = [false, null, 0, '', undefined, NaN, true, 1, 'a'];
  expect(compact(items)).toEqual([true, 1, 'a']);
});
