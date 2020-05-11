import { groupBy } from './groupBy';
import { pipe } from './pipe';

const array = [
  { a: 1, b: 1 },
  { a: 1, b: 2 },
  { a: 2, b: 1 },
  { a: 1, b: 3 },
] as const;
const expected = {
  1: [
    { a: 1, b: 1 },
    { a: 1, b: 2 },
    { a: 1, b: 3 },
  ],
  2: [{ a: 2, b: 1 }],
};

const employees = [
  {
    name: 'John',
    skills: ["Printing", 'Painting', 'Writing']
  },
  {
    name: 'Britney',
    skills: ["Printing", 'Managing', 'Acting']
  }
]
const expectedEmployees = {
  "Printing": [
    {
      name: 'John',
      skills: ["Printing", 'Painting', 'Writing']
    },
    {
      name: 'Britney',
      skills: ["Printing", 'Managing', 'Acting']
    }
  ],
  "Painting": [
    {
      name: 'John',
      skills: ["Printing", 'Painting', 'Writing'] 
    }
  ],
  "Managing": [
    {
      name: 'Britney',
      skills: ["Printing", 'Managing', 'Acting']
    }
  ],
  "Acting": [
    {
      name: 'Britney',
      skills: ["Printing", 'Managing', 'Acting']
    }
  ],
  "Writing": [
    {
      name: 'John',
      skills: ["Printing", 'Painting', 'Writing']
    },
  ]
}

describe('data first', () => {
  test('groupBy', () => {
    expect(groupBy(array, x => x.a)).toEqual(expected);
  });
  test('groupBy multi keys', () => {
    expect(groupBy(employees, (x) => x.skills)).toEqual(expectedEmployees)
  })
  test('groupBy.indexed', () => {
    expect(groupBy.indexed(array, x => x.a)).toEqual(expected);
  });
  test('groupBy.indexed multi keys', () => {
    expect(groupBy.indexed(employees, x => x.skills)).toEqual(expectedEmployees);
  })
});

describe('data last', () => {
  test('groupBy', () => {
    expect(
      pipe(
        array,
        groupBy(x => x.a)
      )
    ).toEqual(expected);
  });
  test('groupBy multi keys', () => {
    expect(
      pipe(
        employees,
        groupBy(x => x.skills)
      )
    ).toEqual(expectedEmployees);
  });
  test('groupBy.indexed', () => {
    expect(
      pipe(
        array,
        groupBy.indexed(x => x.a)
      )
    ).toEqual(expected);
  });

  test('groupBy.indexed multi keys', () => {
    expect(
      pipe(
        employees,
        groupBy.indexed(x => x.skills)
      )
    ).toEqual(expectedEmployees);
  });
});
