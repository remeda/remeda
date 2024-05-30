# Removed

Replaced with [`filter`](/docs/#filter) with [`isNot`](/docs/#isNot) wrapping
the predicate. The result would now be narrowed if possible.

## Examples

### dataFirst

```ts
// Was
reject([1, "hello", 3], isString);

// Now
filter([1, "hello", 3], isNot(isString));
```

### dataLast

```ts
// Was
pipe([1, "hello", 3], reject(isString));

// Now
pipe([1, "hello", 3], filter(isNot(isString)));
```

### Narrowed result

```ts
// Was
const result = reject([1, "a"], isString);
//    ^? (number | string)[]

// Now
const result = filter([1, "a"], isNot(isString));
//    ^? number[]
```
