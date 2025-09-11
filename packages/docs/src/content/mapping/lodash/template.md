---
category: String
---

_Not provided by Remeda._

Lodash's `template` is a full templating system. Use a dedicated templating library like [`handlebars`](https://www.npmjs.com/package/handlebars), [`mustache`](https://www.npmjs.com/package/mustache), or [`ejs`](https://www.npmjs.com/package/ejs) instead.

```ts
// Lodash
const compiled = template("hello <%= user %>!");
compiled({ user: "fred" }); // "hello fred!"

const compiled2 = template("<b><%- value %></b>");
compiled2({ value: "<script>" }); // "<b>&lt;script&gt;</b>"

// Using handlebars
import Handlebars from "handlebars";

const template1 = Handlebars.compile("hello {{user}}!");
template1({ user: "fred" }); // "hello fred!"

const template2 = Handlebars.compile("<b>{{value}}</b>");
template2({ value: "<script>" }); // "<b>&lt;script&gt;</b>"

// For simple string interpolation, use template literals
const user = "fred";
`hello ${user}!`; // "hello fred!"
```

For production applications, dedicated templating libraries offer better performance, security, and features than Lodash's basic templating.
