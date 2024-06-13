> Replace this quote with a description of your changes

---

Make sure that you:

- [ ] Typedoc added for new methods and updated for changed
- [ ] Tests added for new methods and updated for changed
- [ ] New methods added to `src/index.ts`
- [ ] New methods added to `docs/src/content/mapping` for both Lodash and Ramda.

---

<details><summary>We use semantic PR titles to automate the release process!</summary>

https://conventionalcommits.org

PRs should be titled following using the format: `< TYPE >(< scope >)?: description`

### Available Types:

- `feat`: new functions, and changes to a function's type that would impact users.
- `fix`: changes to the runtime behavior of an existing function, or refinements to it's type that shouldn't impact most users.
- `perf`: changes to function implementations that improve a functions _runtime_ performance.
- `refactor`: changes to function implementations that are neither `fix` nor `perf`
- `test`: tests-only changes (transparent to users of the function).
- `docs`: changes to the documentation of a function **or the documentation site**.
- `build`, `ci`, `style`, `chore`, and `revert`: are only relevant for the internals of the library.

For scope put the name of the function you are working on (either new or
existing).

</details>
