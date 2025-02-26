# Typing

Values for `symbol` keys were never returned by the function in runtime, but the
typing didn't filter them out. This has been fixed.

The "headless" dataLast form is no longer supported, use the functional style
instead.

## Examples

### Symbol keys

```ts
const mySymbol = Symbol("a");
const result = values({ [mySymbol]: 123, a: "hello" });
//    ^? string[], Was: (string | number)[]
```

### No headless version

```ts
// Was
pipe(DATA, values);

// Now
pipe(DATA, values());
```
