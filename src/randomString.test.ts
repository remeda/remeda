import { randomString } from './randomString';

test('randomString', () => {
  expect(randomString(10).length).toBe(10);
});
