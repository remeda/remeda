import { iterPipe } from './iterPipe';
import { map } from './map';

test('pipes a single operation', () => {
  expect(
    Array.from(
      iterPipe(
        [1, 2, 3].values(),
        map.lazy(x => x + 1)
      )
    )
  ).toEqual([2, 3, 4]);
});
