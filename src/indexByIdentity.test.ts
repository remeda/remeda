import { indexByIdentity } from './indexByIdentity';

test('indexByIdentity', () => {
  expect(indexByIdentity([1, 2, 5])).toEqual({
    1: 1,
    2: 2,
    5: 5,
  });
});
