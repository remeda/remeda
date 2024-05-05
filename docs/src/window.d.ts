import * as R from "remeda";

declare global {
  interface Window {
    R: readonly typeof R;
  }
}
