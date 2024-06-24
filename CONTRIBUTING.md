# Contributing guide

We're always looking for new contributors and are happy to help you get started! Some ideas:

- Add a test to a function, testing something that we haven't tested yet.
- Improve a function's documentation.
- Fix a bug or an edge case.
- Work on [![issues labeled good first issue](https://img.shields.io/github/issues/remeda/remeda/good%20first%20issue?style=flat-square)](https://github.com/remeda/remeda/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)
- Work on [![issues labeled help wanted](https://img.shields.io/github/issues/remeda/remeda/help%20wanted?style=flat-square)](https://github.com/remeda/remeda/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)

## Getting started

We use `npm` as the package manager. We recommend using [`nvm`](https://github.com/nvm-sh/nvm) to manage `Node.js` and `npm` versions. If you're not using `nvm`, the `.nvmrc` has the recommended Node version.

Install dependencies:

```bash
git clone git@github.com:remeda/remeda.git
cd remeda
npm install
```

Run tests and watch for changes:

```bash
npm test # every test
npm test -i src/file.test.ts # specific test
```

We have a pre-commit script that will format and lint the project, but if you want to run it manually:

```bash
npm run prettier # format
npm run lint # lint
```

## Documentation

Most of the content in the documentation is generated from the JSDoc comments. If you want to work on the design of the docs website or the migration guides, see [`docs/README.md`](https://github.com/remeda/remeda/blob/main/docs/README.md).

## Guidelines

### Adding a new function

When adding a new function, remember to:

- Add a JSDoc comment with a description, parameters, signature, an example, and tags.
  - This will end up as the documentation on the website.
- Add tests for runtime, typing, data-first, and data-last forms.
  - See [Writing tests](#writing-tests) for guidelines on writing tests.
- Add exports to `src/index.ts`.
- Check for equivalent functions in [Lodash](https://lodash.com/docs/4.17.15) and [Ramda](https://ramdajs.com/docs/), and add them to `docs/src/content/mapping`.

### Writing types

We pay careful attention to types. Some tips for writing good types:

- We use [`type-fest`](https://github.com/sindresorhus/type-fest) as our type utility library. We also have type utilities in [`internal/types`](src/internal/types.ts).
- We use the [`Simplify`](https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts) type from `type-fest` for simplifying some output types.
- We generally use the `IterableContainer` type from `internal/types` for input arrays. Similarly, we generally use the `object` type for input objects.

<details>
<summary>Examples:</summary>

An example with an array:

```ts
const data = ["a", 1] as [string, number];

// ❌ `T` can be too wide:
function functionName<T>(data: ReadonlyArray<T>) {}

functionName(data); // inside functionName, data[0] has type string | number

// ✅ `T` is more specific:
function functionName<T extends IterableContainer>(data: T) {}

functionName(data); // inside functionName, data[0] has type string
```

An example with an object:

```ts
const data = { a: "a", b: 1 };

// ❌ `T` can be too wide:
function functionName<T>(data: Readonly<Record<PropertyKey, T>>) {}

functionName(data); // inside functionName, data.a has type string | number

// ✅ `T` is more specific:
function functionName<T extends object>(data: T) {}

functionName(data); // inside functionName, data.a has type string
```

</details>

### Writing tests

The tests for `fileName.ts` live in `fileName.test.ts`. Some guidelines:

- We have separate tests for runtime and typing, and within we have separate tests for data-first and data-last forms.

<details>
<summary>This typically looks like this:</summary>

```ts
describe("runtime", () => {
  describe("data-first", () => {
    test("test description", () => {
      expect(/* ... */).toBe(/* ... */);
    });
  });

  describe("data-last", () => {
    test("test description", () => {
      expect(/* ... */).toBe(/* ... */);
    });
  });
});

describe("typing", () => {
  describe("data-first", () => {
    test("test description", () => {
      expectTypeOf(/* ... */).toEqualTypeOf</* ... */>();
    });
  });

  describe("data-last", () => {
    test("test description", () => {
      expectTypeOf(/* ... */).toEqualTypeOf</* ... */>();
    });
  });
});
```

</details>

- For data-last tests, both runtime and typing, prefer tests using `pipe`. This better matches real-world usage.
- Each `test` block should test one thing. Most of the time this means having only one `expect` per `test`.
- Tests should provide 100% coverage; the Codecov bot will comment on your PR with a coverage report.
- We test for types using [`expectTypeOf`](https://vitest.dev/api/expect-typeof), rather than [`assertType`](https://vitest.dev/api/assert-type.html).
- We also test for _meaningful_ type errors. Prefer [`ts-expect-error`, rather than `@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-ignore-or-ts-expect-error):

```ts
test("doesn't accept non-literal depths", () => {
  // @ts-expect-error [ts2345] - non-literal numbers can't be used as depth.
  flat([], 1 as number);
});
```

- We don't test runtime behavior for type errors, as we can only guarantee behavior when the types are correct.
- When testing types, cover as many use-cases as possible.

<details>
<summary>Some types to consider:</summary>

- Numbers
  - Number type (`number`)
  - Single literal (`1`)
  - Union of literals (`1 | 2`)
  - Bigint type (`bigint`)
  - Single bigint literal (`1n`)
  - Union of bigint literals (`1n | 2n`)
  - Unions of numbers and bigints (`1 | 2n`)
- Strings
  - String type (`string`)
  - Single literal (`"cat"`)
  - Union of literals (`"cat" | "dog"`)
  - Template with a type slot (`` `id_${number}` ``)
  - Template with a literal slot (`` `id_${1 | 2}` ``)
  - Template with multiple slots (`` `id_${1 | 2}_${3 | 4}` ``)
- Arrays
  - Array of a single type (`Array<number>`)
  - Array of a union type (`Array<string | number>`)
  - Array of literal types (`Array<"cat" | "dog">`)
  - Union of similar arrays (`Array<1 | 2> | Array<2 | 3>`)
  - Nested arrays (`Array<Array<number>>`)
- Tuples
  - Tuple of a single type (`[number, number, number]`)
  - Tuple of different types (`[number, string, boolean]`)
  - Tuple with optional type (`[number, string?]`)
  - Tuple with spreads (`[...Array<number>, number, number]`)
  - Tuple with optional type and spread (`[number?, ...Array<string>]`)
  - Tuple with union values (`[number, string | undefined, boolean]`)
  - Tuple with literal values (`[number, "cat" | "dog", true]`)
- Records
  - Record with string keys (`Record<string, number>`)
  - Record with number keys (`Record<number, string>`)
  - Record with union keys (`Record<string | number, unknown>`)
  - Record with union values (`Record<string, string | number>`)
  - Record with undefined values (`Record<string, string | undefined>`)
  - Record with literal keys (`Record<"cat" | "dog", number>`)
  - Record with literal values (`Record<string, 1 | 2>`)
  - Record with template keys (``Record<`id_${number}`, string>``)
  - Union of records (`Record<string, unknown> | Record<number, unknown>`)
- Objects
  - Object with named keys (`{ a: number }`)
  - Object with union values (`{ a: string | number }`)
  - Object with literal union values (`{ a: "cat" | 1 }`)
  - Object with optional keys (`{ a?: number }`)
  - Object with symbol keys (`{ [Symbol("a")]: number }`)
  - Union of objects (`{ a: 1, b: 2 } | { b: 2, c: 3 }`)
  - Nested objects (`{ a: { b: { c: 1 } } }`)
- `readonly` versions of the above
- `null` and `undefined`

</details>

### Design philosophy

**No type annotations.** Functions shouldn't require type annotations to have good types. This gives the best developer experience.

**Have good output types.** One reason Remeda provide "one-liner" functions is if we can have better output types than the defaults. While `data.filter(item => typeof item === 'number')` works, `filter(data, isNumber)` gives a better output type. This is why we have type guards, `hasAtLeast`, `prop`, etc.

**Readability counts.** The other reason Remeda provides one-liner functions is if they make things more readable. Compare `map((item) => item + 3)` to `map(add(3))`, where we don't need to come up with a name for `item`. This is why we have `constant`, `doNothing`, `identity`, etc.

**Prefer composition.** We don't provide simple compositions of functions. Having a smaller surface area makes it easier for users to remember Remeda's functions, and easier for us to maintain. We don't have `reject` because it's the same as `filter(isNot)`, and we don't have `zipObject` because it's the same as `fromEntries(zip)`.

**Minimal implementations.** Implementations should be small and self-contained. Importing an individual function should add less than 500 B to the bundle size in most cases.
