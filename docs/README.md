# [Remeda documentation site](https://remedajs.com)

## Development

The docs site is built with Astro. Development is done via the integrated dev
server:

```bash
npm run dev
```

While the server is running any changes to the docs site would be reloaded
dynamically. Additionally, the library source code is also watched, so that any
changes to the documentation of functions would also be reloaded dynamically.

To check and lint your project, including both `.astro` files and `.ts` and
`.tsx` files use _check_ and _lint_, This is also run automatically on each
commit via a git hook.

```bash
npm run check
npm run lint
```

In rare cases where changes are being made to the content loaders or their
schemas you will need to run sync which would regenerate types for these
changes.

```bash
npm run sync
```

The production site also relies on some scripts residing in [`src/scripts`](src/scripts/README.md)
(mainly the dark mode theme switcher) which need ot be built "outside" of the
regular astro flow. When making changes to these scripts you need to run the
build script manually:

```bash
npm run build:scripts
```

Finally, to check a production build flow end-to-end you can use astro's preview
feature. This would run the same build flow that is used in CI/CD.

```bash
npm run build:all
npm run preview
```

## Documentation Site Structure

Content for the function documentation comes from Typedoc.

Content for the guides in front of the function documentation is in [`src/content/docs-articles`](src/content/docs-articles).

Content for the migration guides is in [`src/content/mapping`](src/content/mapping).

## VSCode Integration

For a seamless development experience, open the `docs` directory as a top-level project in VSCode:

```bash
code docs
```

This setup ensures that all VSCode tooling and extensions (typescript, prettier, eslint) work correctly within the documentation project context.

**Important!**: When running under the root repository folder, vscode will not run prettier or eslint on the files of the docs site as they are disabled in the main project for the `docs` folder; but `lint-staged` will still run them, so you will still see the auto-fixes and auto-formatting run, and the commit would still fail on errors.
