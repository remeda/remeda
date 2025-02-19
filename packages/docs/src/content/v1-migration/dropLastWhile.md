# Runtime

The predicate function now takes 2 additional parameters: `index` - The index of
the current element being processed in array, and `data` - the array the
function was called upon (the same signature the callbacks the built-in
`Array.prototype` functions have).

If you are using a function _reference_ for the predicate (and not an inline
arrow function), and that function accepts more than one param you might run
into compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### New Params

```ts
// This was previously unavailable
dropLastWhile([1, 2, 3], (item, index) => item + (index % 2) === 0);
```

### Potential bug

```ts
function callback(value: number, index = 0): boolean {
  return (value + index) % 2 === 0;
}

dropLastWhile([1, 2], callback); // => [1, 2], Was: [1]
```
