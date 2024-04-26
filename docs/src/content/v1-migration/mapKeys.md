# Typing

The mapping function is no longer typed to accept symbol keys, it casts `number`
keys as strings, and the values of `symbol` keys are also not part of the typing
of the value parameter. Additionally, a third parameter was added with the whole
input object (this is similar to how the built-in `Array.prototype` functions
take a third param with the whole input array). In the vast majority of cases
this should not cause any changes.

The return type would now be `Partial` when the mapped key is a literal union.
This would fix a common bug where the return type could cause accessing non-
existent properties (see example).

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
