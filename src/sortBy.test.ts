import { sortBy } from './sortBy';
import { pipe } from './pipe';

const items = [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }] as const;
const sorted = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }];


const multiPropSortItems = [
  { favorite: false, category: "A" },
  { favorite: true, category: "C" },
  { favorite: true, category: "B" },
  { favorite: false, category: "B" }
]

// Expect favorites sorted alphabetically
const multiPropSortItemsSorted = [
  { favorite: true, category: "B" },
  { favorite: true, category: "C" },
  { favorite: false, category: "A" },
  { favorite: false, category: "B" },
]

const withLocaleComparison = [
  { category: "Garden" },
  { category: "cleaning" },
  { category: "books" },
  { category: "books" },
  { category: "Tech" },
  { category: "Cooking" },
]

const sortedWithLocaleComparison = [{ "category": "books" }, { "category": "books" }, { "category": "cleaning" }, { "category": "Cooking" }, { "category": "Garden" }, { "category": "Tech" }]

describe('data first', () => {
  test('sort correctly', () => {
    expect(sortBy(items, x => x.a)).toEqual(sorted);
  });
  test('sort with multi keys', () => {
    expect(sortBy(multiPropSortItems, x => [{ value: x.favorite, order: 'desc' }, x.category])).toEqual(multiPropSortItemsSorted);
  });
  test('sort with multi keys', () => {
    expect(sortBy(withLocaleComparison, x => [{ value: x.category, compare: (a, b) => a.toString().localeCompare(b.toString()) }, x.category])).toEqual(sortedWithLocaleComparison);
  });
});



xdescribe('data last', () => {
  test('sort correctly', () => {
    expect(
      pipe(
        items,
        sortBy(x => x.a)
      )
    ).toEqual(sorted);
  });

  test('sort multi objects correctly', () => {
    expect(
      pipe(
        items,
        sortBy(x => x.a)
      )
    ).toEqual(sorted);
  });
});
