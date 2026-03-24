# Renamed

Called [`isDeepEqual`](/docs/#isDeepEqual) instead. isDeepEqual has a slightly
different return type (in some cases) allowing it to narrow the result.

## Examples

### Simple

```ts
// Was
equals({ a: { b: 123 } }, { a: { b: 456 } });

// Now
isDeepEqual({ a: { b: 123 } }, { a: { b: 456 } });
```

### Type Predicate

```ts
// Was
const result = filter([] as ("cat" | "dog")[], equals("cat"));
//    ^? ("cat" | "dog")[]

// Now
const result = filter([] as ("cat" | "dog")[], isDeepEqual("cat"));
//    ^? "dog"[]
```
