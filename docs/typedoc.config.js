import { OptionDefaults } from "typedoc";

/** @type {Partial<import('typedoc').TypeDocOptions>} */
export default {
  json: "src/data/data.json",

  tsconfig: "../tsconfig.json",
  entryPoints: ["../src/index.ts"],
  exclude: ["**/*.test.ts", "**/*.test-d.ts"],

  jsDocCompatibility: {
    exampleTag: false,
  },

  blockTags: [
    ...OptionDefaults.blockTags,
    "@dataFirst",
    "@dataLast",
    "@lazy",
    "@signature",
  ],

  excludeNotDocumented: true,
  sourceLinkTemplate: "https://github.com/remeda/remeda/blob/main/{path}",
};
