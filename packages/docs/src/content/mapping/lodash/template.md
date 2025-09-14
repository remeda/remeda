---
category: String
---

_Not provided by Remeda._

Lodash's `template` is a complex templating engine that compiles templates into
executable JavaScript functions. Due to its complexity and security implications
it is outside the scope that Remeda offers.

- In most cases it can be substituted by native [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).
- In many other cases it is redundant with the templating capabilities of
  frameworks such as React, Express, Vue, Fastify, and many others.
- For the most complex cases there are dedicated libraries that offer robust
  templating features (e.g., [Handlebars](https://handlebarsjs.com/)).

### Template Literals

```ts
// Lodash
const greet = _.template("Hello <%= firstName %> <%= lastName %>!");

// Template literals
const greet = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => `Hello ${firstName} ${lastName}!`;
```

### HTML

```tsx
// Lodash
const bold = _.template("<b><%- value %></b>");
bold({ value: "<script>" });

// React
function Bold({ value }: { value: string }) {
  return <b>{value}</b>;
}

<Bold value="<script>" />;
```

### With complex logic

```tsx
// Lodash
const list = _.template(
  "<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>",
);
list({ users: ["fred", "barney"] });

// React
function List({ users }: { users: string[] }) {
  return users.map((user) => <li key={user}>{user}</li>);
}

<List users={["fred", "barney"]} />;
```
