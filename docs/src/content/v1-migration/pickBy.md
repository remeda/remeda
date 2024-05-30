# Typing

The predicate function is typed to no longer accept `symbol` keys or their
corresponding values, and `number` keys will be cast as `string`, Aligning with
the result of [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
on the input object). In the vast majority of cases this should not cause any
breakages.

Using a type-guard as the predicate will now narrow the resulting type (similar
to how `filter` narrows the result).

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
pickBy({ [mySymbol]: "hello", a: 123, 456: true }, (key, value) => {
  // key: "a" | "456", Was symbol | "a" | 456;
  // value: number | boolean, Was string | number | boolean;
});
```

### Narrowed return

```ts
const DATA = { a: 123, b: 456 } as {
  a: number;
  b: number | string;
  c?: number;
  d: string;
};
const result = pickBy(DATA, isNumber);
//    ^? { a: number, b?: number, c?: number }, Was: typeof DATA
```

### Potential bug

```ts
const DATA = { hello: "world", helloworld: 123 };

function callback(
  value: string,
  key: string,
  obj: Record<string, string> = {},
): boolean {
  return `${key}${value}` in obj;
}

// Bug
pickBy(DATA, callback); // => { hello: "world" }, Was: DATA

// Fix
pickBy(DATA, (value, key) => callback(key, value)); // => DATA
```
