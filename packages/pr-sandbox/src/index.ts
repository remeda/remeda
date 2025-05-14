import { doSomething } from "./do-something";
import "./styles.css";

document.querySelector("#app")!.innerHTML = `
  <h1>Hello Remeda 👋</h1>
  <code>${JSON.stringify(doSomething())}</code>
`;
