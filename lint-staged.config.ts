import type { Configuration } from "lint-staged";

export default {
  "*": "prettier --write --ignore-unknown",
} satisfies Configuration;
