# Runtime

The mapper function now takes 2 additional parameters: `index` - The index of
the current element being processed in array, and `data` - the array the
function was called upon (the same signature as the built-in
[`Array.prototype.flatMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)).

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### New Params

```ts
// This was previously unavailable
flatMap([1, 2, 3], (item, index) => [item + index]);
```

### Potential bug

```ts
function callback(value: number, index = 0): boolean {
  return [value + index];
}

// Bug
flatMap([1, 2, 3], callback); // => [1, 3, 5], Was: [1, 2, 3]

// Fix
flatMap([1, 2, 3], (item) => callback(item)); // => [1, 2, 3]
```
