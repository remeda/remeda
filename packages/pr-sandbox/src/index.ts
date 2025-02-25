import "./styles.css";
import * as R from "remeda";

const DATA = ["a", "b", "c"];

const result = R.map(DATA, (x) => x.toUpperCase());

document.querySelector("#app")!.innerHTML = `
<h1>Hello Remeda 👋</h1>
<code>
  ${JSON.stringify(result)}
</code>`;
