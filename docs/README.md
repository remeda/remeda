# [Remeda documentation site](https://remedajs.com)

## The Build

### 1. Typedoc

First, we generate the project documentation using Typedoc. This step parses jsdoc comments from the main project to create a JSON file that is written to `src/data`. It only needs to run once after any changes to the Remeda codebase.

```bash
npm run typedoc
```

### 2. Astro

The site itself is generated via Astro. To run the development server that provides hot-swapping code while you develop use:

```bash
npm run dev
```

The build step for deployment (`npm run build`) is automated via GitHub Actions and typically does not need to be run manually.

### Full Build Command

To run the entire build process end-to-end, ensuring everything is set up correctly.

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
