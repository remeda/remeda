# Typing

If you weren't using the `strict` variant, The returned type is now stricter and
more reflective of the input type. The returned entries are typed according to
to the keys in the input, with the values typed per-key. If you are already
using `entries.strict` simply remove the `.strict` suffix.

Also, the return type now filters `symbol` keys, and casts `number` keys as
strings.

## Examples

### Strict

```ts
// Was
entries.strict(obj);

// Now
entries(obj);
```

### Better typing

```ts
const result = entries({ a: 123 } as const);
//    ^? ['a', 123][], Was: [string, number][]
```

### Symbol keys

```ts
const mySymbol = Symbol("a");

// Was
const result = entries.strict({ [mySymbol]: 123, a: 456 } as const);
//    ^? ([typeof mySymbol, 123] | [a, 456])[]

// Now
const result = entries({ [mySymbol]: 123, a: 456 } as const);
//    ^? ['a', 456][]
```

### Number keys

```ts
// Was
const result = entries.strict({ 123: "hello" } as const);
//    ^? [123, "hello"][]

// Now
const result = entries({ 123: "hello" } as const);
//    ^? ['123', "hello"][]
```
