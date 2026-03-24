/** @type {Partial<import('semantic-release').GlobalConfig>} */
export default {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",

    "@semantic-release/release-notes-generator",

    [
      "@semantic-release/npm",
      {
        // We want to also sign the tarball which semantic-release can't help
        // us with, so instead we just keep a local copy of the release tarball
        // during the release process, and then we do the extra signing steps
        // in a separate job after the release is done.
        tarballDir: ".",
      },
    ],

    "@semantic-release/github",
  ],
};
