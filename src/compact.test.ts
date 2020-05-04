import { compact } from './compact';
// import { pipe } from './pipe';
// import { map } from './map';
// import { map } from './first';

test('filter correctly', () => {
  const items = [false, null, 0, '', undefined, NaN, true, 1, 'a'] as const;
  const results: (boolean | number | 'a')[] = compact(items);
  expect(results).toEqual([true, 1, 'a']);
});

// test('lazy', () => {

// })
