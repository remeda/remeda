import "./styles.css";
import * as R from "remeda";

const result = R.map([1, 2, 3], (x) => x * 2);

document.getElementById("app")!.innerHTML = `
<h1>Hello Remeda 👋</h1>
<code>
  ${JSON.stringify(result)}
</code>`;
