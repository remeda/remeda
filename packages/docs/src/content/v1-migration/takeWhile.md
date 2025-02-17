# Runtime

The predicate function now takes 2 additional parameters: `index` - The index of
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
takeWhile([1, 2, 3], (item, index) => item > index);
```

### Potential bug

```ts
function callback(item: number, index = 0): string {
  return item > index;
}

// Bug
takeWhile([1, 1, 1], callback); // => [1, 1, 1], Was: [1]

// Fix
takeWhile([1, 1, 1], (item) => callback(item)); // => [1]
```
