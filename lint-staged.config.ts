import { defineConfig } from "lint-staged/config";

export default defineConfig({
  "*": "prettier --write --ignore-unknown",
});
