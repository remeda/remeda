# Runtime

The predicate function now takes 2 additional parameters: `index` - The index of
the current element being processed in array, and `data` - the array the
function was called upon (the same signature the callbacks the built-in
`Array.prototype` functions have).

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### New Params

```ts
// This was previously unavailable
fromKeys(["a", "b", "c"], (item, index) => `${item}${index}`);
```

### Potential bug

```ts
function callback(item: string, index?: number): boolean {
  return `${item}${index ?? ""}`;
}

// Bug
fromKeys(["a", "b", "c"], callback); // => { a: "a0", b: "b1", c: "c2" }, Was { a: "a", b: "b", c: "c" }

// Fix
fromKeys(["a", "b", "c"], (item) => callback(item)); // => { a: "a", b: "b", c: "c" }
```
