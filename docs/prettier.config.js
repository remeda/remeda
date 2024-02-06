/** @type {import('prettier').Config} */
export default {
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'es5',
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
};
