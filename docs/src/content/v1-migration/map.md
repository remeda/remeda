# Typing

## Strict

If you weren't using the `strict` variant, the return type now maintains the
shape of the input array (e.g. if the input was non-empty, the result would also
be non-empty). For regular arrays this would result in the same return type. To
get the previous return type cast the input tuple as an array of the item type.
If you are already using `strict` simply remove the `.strict` suffix.

## Indexed

The `indexed` variant was removed; the base implementation takes the same
parameters. If you are using `indexed` you can simply remove it without any
other changes.

# Runtime

The mapper now takes 2 additional parameters: `index` - The index of the current
element being processed in array, and `data` - the array the function was called
upon (the same signature as the built-in [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)).

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Strict variant removed

```ts
// Was
map.strict(array, mapper);

// Now
map(array, mapper);
```

### Indexed variant removed

```ts
// Was
map.indexed(array, mapper);

// Now
map(array, mapper);
```

### Better typing

```ts
const DATA = ["hello"] as [string, ...string[]];

const mapped = map(DATA, (item) => item.length);
//    ^? [number, ...number[]], Was: number[]
```

### Legacy typing

```ts
const DATA = ["hello"] as [string, ...string[]];

const mapped = map(DATA as string[], (item) => item.length);
//    ^? number[]
```

### Potential bug

```ts
const DATA = ["1", "2", "3"];

// Bug
map(DATA, Number.parseInt); // => [1, NaN, NaN], Was: [1, 2, 3]

// Fix
map(DATA, (raw) => Number.parseInt(raw)); // => [1, 2, 3]
```
