---
title: Object Keys
category: Migrating to v2
slug: migration-keys
priority: 50
---

# Object Keys

Most of the functions that provided a way to traverse `object`s relied on the
built-in [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries).
This function has limitations on which properties it iterates upon (enumerates):

- `number` keys are cast as `string`.
- `symbol` keys are ignored.

To properly reflect this, we had to change the typing for both the callback
functions and the return types. Functions that returned an object would either
drop the symbol keys (if constructing a new object) or copy them as-is (if
cloning the original object).

It's important to note that only the **types** have changed here; the runtime
behavior remains the same. `number` keys are **always** cast as strings in
JavaScript; `myObj[0]` and `myObj["0"]` access the same property. This change
will not construct your objects differently than they used to be. To provide
more utility, the **implementations** of `omit` and `omitBy` have been changed
to _preserve_ symbol keys.

Read more about this on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).

### Migration

The biggest differences are due to the change in how we handle `symbol` keys.
`symbol` usage is rare, and if you don't know you use it in your project, you
most likely don't.

`number` keys require a little more attention, especially if you are checking or
using the keys by value (and not just passing them around). Because only types
have changed (and not the runtime behavior), you might run into new TypeScript
(or ESLint) warnings and errors due to surfacing _previously existing issues_.

The affected functions are: `entries`, `evolve`, `forEachObj`, `keys`,
`mapKeys`, `mapValues`, `omit`, `omitBy`, _and_ `pickBy`.
