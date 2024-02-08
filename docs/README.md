# [Remeda documentation site](https://remedajs.com)

## Setting Up for Development

The documentation site is built in a few steps, outlined below. Note that some steps are only required after updates to the main Remeda project.

### 1. Typedoc

First, we generate the project documentation using Typedoc. This step parses jsdoc comments from the main project to create a JSON file in the `build` directory. It's typically run once after changes to the Remeda codebase.

```bash
npm run typedoc
```

### 2. Transform

Next, we post-process the Typedoc output to restructure the data into a format suitable for our site. This processed data is saved as JSON in the `src` directory for easy access by the site.

```bash
npm run transform
```

This step, like Typedoc, is not required during routine docs site development.

### 3. Astro

The site itself is generated via Astro. To run the development server that provides hot-swapping code while you develop use:

```bash
npm run dev
```

The build step for deployment (`npm run build`) is automated via GitHub Actions and typically does not need to be run manually.

### Full Build Command

To run the entire build process end-to-end, ensuring everything is set up correctly

```bash
npm run build:all
```

## VSCode Integration

For a seamless development experience, open the `docs` directory as a top-level project in VSCode:

```bash
code docs
```

This setup ensures that all VSCode tooling and extensions (typescript, prettier, eslint) work correctly within the documentation project context.

**Important!**: When running under the root repository folder, vscode will not run prettier or eslint on the files of the docs site as they are disabled in the main project for the `docs` folder; but `lint-staged` will still run them, so you will still see the auto-fixes and auto-formatting run, and the commit would still fail on errors.
