# Runtime

The mapper functions now takes 2 additional parameters: `index` - The index of
the current element being processed in array, and `data` - the array the
function was called upon (this is similar to how the built-in `Array.prototype`
functions take a third param with the input array)

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### New Params

```ts
pullObject(
  [1, 2, 3],
  // This was previously unavailable
  (item, index) => item + index,
  (item, index) => index + item,
);
```

### Potential bug

```ts
function callback(item: string, index?: number): string {
  return `${item}${index ?? ""}`;
}

// Bug
pullObject(["1", "2", "3"], callback, parseInt); // => { 10: 1, 21: NaN, 32: NaN }, Was: { 1: 1, 2: 2, 3: 3 }

// Fix
pullObject(
  ["1", "2", "3"],
  (item) => callback(item),
  (item) => parseInt(item),
); // => { 1: 1, 2: 2, 3: 3 }
```
