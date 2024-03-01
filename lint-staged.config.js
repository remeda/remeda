module.exports = {
  // The Typescript compiler can't type-check a single file, it needs to run on
  // the whole project. To do that we use a function (instead of a string or
  // array) so that no matter what file or how many, we will always run the same
  // command.
  "*.ts?(x)": () => "tsc -p tsconfig.json --noEmit",

  // Javascript and Typescript (including commonJs and esm variants)
  "*.@(js|jsx|ts|tsx|cjs|mjs)": ["eslint --fix", "prettier --write"],

  // _try_ prettier on anything, it supports a lot of things! If this is touching a file
  // you don't want add it to .prettierignore.
  // lint-staged runs *all* matching rules and doesn't have an "anything else" rule, so
  // instead, we add all previous file extensions to the glob here so it doesn't run on
  // any of those files.
  "!(*.@(js|jsx|ts|tsx|cjs|mjs))": "prettier --ignore-unknown --write",
};
