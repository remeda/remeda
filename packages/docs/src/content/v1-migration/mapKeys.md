# Typing

The mapping function is typed to no longer accept `symbol` keys or their
corresponding values, and `number` keys will be cast as `string`, Aligning with
the result of [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
on the input object). In the vast majority of cases this should not cause any
breakages.

The return type would now be `Partial` when the mapped key is a literal union.
This would fix a common bug where the return type could cause accessing non-
existent properties (see example).

# Runtime

A third parameter was added to the predicate with the input object that was
passed into the function (this is similar to how the built-in `Array.prototype`
functions take a third param with the input array).

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Mapper typing

```ts
const mySymbol = Symbol("a");
mapKeys({ [mySymbol]: "hello", a: 123, 456: true }, (key, value) => {
  // key: "a" | "456", Was symbol | "a" | 456;
  // value: number | boolean, Was string | number | boolean;
});
```

### Partial result

```ts
const result = mapKeys(
  //  ^? Partial<Record<"yes" | "no", string>>, Was: Record<"yes" | "no", string>
  { a: "hello" } as Record<string, string>,
  (key) => (key.length > 3 ? "yes" : "no"),
);

// It's possible none of the keys mapped to "yes", so the type here is
// `string | undefined`:
console.log(result.yes);
//                 ^? string | undefined, Was: string
```

### Potential bug

```ts
function callback(
  key: string,
  value: string,
  obj: Record<string, string> = {},
): boolean {
  return `${key}${value}${Object.keys(obj).length}`;
}

// Bug
mapKeys({ a: "hello" }, callback); // => { ahello1: "hello" }, Was: { ahello: "hello" }

// Fix
mapKeys({ a: "hello" }, (key, value) => callback(key, value)); // => { ahello: "hello" }
```
