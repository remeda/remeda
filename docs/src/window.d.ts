import * as R from "remeda";

declare global {
  interface Window {
    R: typeof R;
  }
}
