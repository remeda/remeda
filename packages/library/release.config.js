/** @type {Partial<import('semantic-release').GlobalConfig>} */
export default {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/npm", { pkgName: "remeda" }],
    "@semantic-release/github",
  ],
};
