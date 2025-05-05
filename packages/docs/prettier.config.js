/** @type {import('prettier').Config} */
export default {
  plugins: [
    "prettier-plugin-astro",
    //! The tailwind plugin must come last! @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss?tab=readme-ov-file#compatibility-with-other-prettier-plugins
    "prettier-plugin-tailwindcss",
  ],

  // @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss?tab=readme-ov-file#specifying-your-tailwind-stylesheet-path
  tailwindStylesheet: "./src/styles/global.css",
  // @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss?tab=readme-ov-file#sorting-classes-in-function-calls
  tailwindFunctions: ["cn"],
};
