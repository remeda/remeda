# Warning!

The scripts in this folder are not bundled into our main project! Instead, they
are built in a pre-processing step **before** astro builds the project. They are
then used in our project as static imports so they can run **before** the page
is loaded.

The scripts are built via vite (see `vite.scripts.config.ts`) into the
`public/dist/scripts` folder.

### Example

```html
<script is:inline src="/dist/scripts/<__SCRIPT_NAME__>.js"></script>
```

**This mechanism is rarely needed!**
