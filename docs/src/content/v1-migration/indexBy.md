# Typing

## Strict

If you weren't using the `strict` variant, the return type is now stricter by
using the type returned from the mapper as the type for the keys of the result.
To maintain the previous return value make sure your function returns `string`
instead of a narrower type. If you are already using `strict` simply remove the
`.strict` suffix.

## Indexed

The `indexed` variant was removed; the base implementation takes the same
parameters. If you are using `indexed` you can simply remove it without any
other changes.

# Runtime

The grouping function now takes 2 additional parameters: `index` - The index of
the current element being processed in array, and `data` - the array the
function was called upon (the same signature the callbacks the built-in
`Array.prototype` functions have).

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Strict variant removed

```ts
// Was
indexBy.strict(array, mapper);

// Now
indexBy(array, mapper);
```

### Indexed variant removed

```ts
// Was
indexBy.indexed(array, groupingFunc);

// Now
indexBy(array, groupingFunc);
```

### Better typing

```ts
type Pet = { type: "cat" | "dog"; name: string };

const indexed = indexBy(
  //  ^? Partial<Record<"cat" | "dog", Pet>> Was: Record<string, Pet>
  [] as Pet[],
  prop("type"),
);
```

### Legacy typing

```ts
type Pet = { type: "cat" | "dog"; name: string };

const grouped = indexBy([] as Pet[], ({ type }) => type as string);
//    ^? Record<string, Pet>
```

### Potential bug

```ts
type Pet = { type: "cat" | "dog"; name: string };
const DATA = { type: "cat", name: "a" } as Pet;

function callback(item: Pet, index?: number): boolean {
  return `${item.type}${index ?? ""}`;
}

// Bug
indexBy([DATA], callback); // => { cat0: DATA }, Was: { cat: DATA }

// Fix
indexBy([DATA], (item) => callback(item)); // => { cat: DATA }
```
