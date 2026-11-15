#### Typing

Values for `symbol` keys were never returned by the function in runtime, but the
typing didn't filter them out. This has been fixed.

Passing the function as a reference for dataLast calls is no longer supported,
call it with no arguments instead.

##### Examples

###### Symbol keys

```ts
const mySymbol = Symbol("a");
const result = values({ [mySymbol]: 123, a: "hello" });
//    ^? string[], Was: (string | number)[]
```

###### Function reference

```ts
// Was
pipe(DATA, values);

// Now
pipe(DATA, values());
```
