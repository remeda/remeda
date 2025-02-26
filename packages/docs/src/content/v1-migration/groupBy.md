# Typing

## Strict

If you weren't using the `strict` variant, the return type is now stricter by
using the type returned from the grouping function as the type for the keys of
the result (this is the same as the built-in [`Object.groupBy`](https://github.com/microsoft/TypeScript/blob/main/src/lib/esnext.object.d.ts#L7-L10)). To maintain the
previous return value make sure your function returns `PropertyKey` instead of
a narrower type.
If you are already using `strict` simply remove the `.strict` suffix.

## Indexed

The `indexed` variant was removed; the base implementation takes the same
parameters. If you are using `indexed` you can simply remove it without any
other changes.

# Runtime

The grouping function now takes 2 additional parameters: `index` - The index of
the current element being processed in array, and `data` - the array the
function was called upon (_unlike_ the signature of the built-in
[`Object.groupBy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy), which does't take the 3rd param).

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Strict variant removed

```ts
// Was
groupBy.strict(array, groupingFunc);

// Now
groupBy(array, groupingFunc);
```

### Indexed variant removed

```ts
// Was
groupBy.indexed(array, groupingFunc);

// Now
groupBy(array, groupingFunc);
```

### Better typing

```ts
type Pet = { type: "cat" | "dog"; name: string };

const grouped = groupBy(
  //  ^? Partial<Record<"cat" | "dog", NonEmptyArray<Pet>>>
  // Was: Record<PropertyKey, NonEmptyArray<Pet>>
  [] as Pet[],
  prop("type"),
);
```

### Legacy typing

```ts
type Pet = { type: "cat" | "dog"; name: string };

const grouped = groupBy([] as Pet[], ({ type }) => type as PropertyKey);
//    ^? Record<PropertyKey, NonEmptyArray<Pet>>
```

### Potential bug

```ts
type Pet = { type: "cat" | "dog"; name: string };
const DATA = { type: "cat", name: "a" } as Pet;

function callback(item: Pet, index?: number): boolean {
  return `${item.type}${index ?? ""}`;
}

// Bug
groupBy([DATA], callback); // => { cat0: [DATA] }, Was: { cat: [DATA] }

// Fix
groupBy([DATA], (item) => callback(item)); // => { cat: [DATA] }
```
