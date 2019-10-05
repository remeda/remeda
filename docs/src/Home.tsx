import * as React from 'react';
import { Readme } from './Readme';
import { CodeBlock } from './CodeBlock';

export function Home() {
  return (
    <div className="home-wrapper">
      <div className="container">
        <div className="home  p-3 bg-white rounded ">
          <h1 id="remeda">Remeda</h1>
          <p>
            The first &quot;data-first&quot; and &quot;data-last&quot; utility
            library designed especially for TypeScript.
          </p>
          <p>
            <a href="https://travis-ci.org/remeda/remeda">
              <img
                src="https://travis-ci.org/remeda/remeda.svg?branch=master"
                alt="Build Status"
              />
            </a>{' '}
            <a href="https://www.npmjs.org/package/remeda">
              <img src="https://badge.fury.io/js/remeda.svg" alt="npm module" />
            </a>{' '}
            <a href="https://david-dm.org/remeda/remeda">
              <img
                src="https://david-dm.org/remeda/remeda.svg"
                alt="dependencies"
              />
            </a>
          </p>
          <h2 id="installation">Installation</h2>
          <div className="code-wrapper">
            <pre
              style={{
                padding: 'padding: 0.5em',
                background: 'rgb(43, 43, 43)',
                color: 'rgb(186, 186, 186)',
              }}
            >
              <code>
                npm i remeda<br />yarn add remeda
              </code>
            </pre>
          </div>
          <p>
            Then in <code>.js</code> or <code>.ts</code>
          </p>
          <CodeBlock
            type="dark"
            code={`import * as R from 'remeda'; // tree-shaking supported!`}
          />
          <h2 id="why-remeda-">Why Remeda?</h2>
          <p>
            There are no good utility libraries that work well with TypeScript.
            When working with Lodash or Ramda you must sometimes annotate types
            manually.<br />Remeda is written and tested in TypeScript and that
            means there won't be any problems with custom typings.
          </p>
          <h2 id="what-s-data-first-and-data-last-">
            What's &quot;data-first&quot; and &quot;data-last&quot;?
          </h2>
          <p>
            Functional programming is nice, and it makes the code more readable.
            However there are situations where you don't need &quot;pipes&quot;,
            and you want to call just a single function.{' '}
          </p>
          <CodeBlock
            type="dark"
            code={`// Remeda
R.pick(obj, ['firstName', 'lastName']);

// Ramda
R.pick(['firstName', 'lastName'], obj);

// Lodash
_.pick(obj, ['firstName', 'lastName']);`}
          />
          <p>
            In the above example, &quot;data-first&quot; approach is more
            natural and more programmer friendly because when you type the
            second argument, you get the auto-complete from IDE. It's not
            possible to get the auto-complete in Ramda because the data argument
            is not provided.
          </p>
          <p>
            &quot;data-last&quot; approach is helpful when writing data
            transformations aka pipes.
          </p>
          <CodeBlock
            type="dark"
            code={`const users = [
  {name: 'john', age: 20, gender: 'm'},
  {name: 'marry', age: 22, gender: 'f'},
  {name: 'samara', age: 24, gender: 'f'},
  {name: 'paula', age: 24, gender: 'f'},
  {name: 'bill', age: 33, gender: 'm'},
]

// Remeda
R.pipe(
  users,
  R.filter(x => x.gender === 'f'),
  R.groupBy(x => x.age),
);

// Ramda
R.pipe(
  R.filter(x => x.gender === 'f'),
  R.groupBy(x => x.age),
)(users) // broken typings in TS :(
  
// Lodash
_(users)
  .filter(x => x.gender === 'f')
  .groupBy(x => x.age)
  .value()

// Lodash-fp
_.flow(
  _.filter(x => x.gender === 'f'),
  _.groupBy(x => x.age),
)(users)// broken typings in TS :(`}
          />
          <p>
            Mixing paradigms can be cumbersome in Lodash because it requires
            importing two different methods.<br />Remeda implements all methods
            in two versions, and the correct overload is picked based on the
            number of provided arguments.<br />The &quot;data-last&quot; version
            must always have one argument less than the &quot;data-first&quot;
            version.
          </p>
          <CodeBlock
            type="dark"
            code={`// Remeda
R.pick(obj, ['firstName', 'lastName']); // data-first
R.pipe(obj, R.pick(['firstName', 'lastName'])); // data-last

R.pick(['firstName', 'lastName'], obj); // error, this won't work!
R.pick(['firstName', 'lastName'])(obj); // this will work but the types cannot be inferred
  `}
          />
          <h2 id="lazy-evaluation">Lazy evaluation</h2>
          <p>
            Many functions support lazy evaluation when using <code>pipe</code>{' '}
            or <code>createPipe</code>. These functions have a{' '}
            <code>pipeable</code> tag in the documentation.<br />Lazy evaluation
            is not supported in Ramda and only partially supported in lodash.
          </p>
          <CodeBlock
            type="dark"
            code={`// Get first 3 unique values
const arr = [1, 2, 2, 3, 3, 4, 5, 6];

const result = R.pipe(
  arr,
  R.map(x => {
    console.log('iterate', x);
    return x;
  }),
  R.uniq(),
  R.take(3)
); // => [1, 2, 3]
  
/**
 * Console output:
 * iterate 1
 * iterate 2
 * iterate 2
 * iterate 3
 * /
 `}
          />
          <h2 id="indexed-version">Indexed version</h2>
          <p>
            Iterable functions have an extra property <code>indexed</code> which
            is the same function with iterator{' '}
            <code>(element, index, array)</code>.
          </p>
          <CodeBlock
            type="dark"
            code={`const arr = [10, 12, 13, 3];
  
// filter even values
R.filter(arr, x => x % 2 === 0); // => [10, 12]

// filter even indexes
R.filter.indexed(arr, (x, i) => i % 2 === 0); // => [10, 13] `}
          />
          <h2 id="remeda-design-goals">Remeda Design Goals</h2>
          <ol>
            <li>
              The usage must be programmer friendly, and that's more important
              than following XYZ paradigm strictly.
            </li>
            <li>
              Manual annotation should never be required, and proper typings
              should infer everything. The only exception is the first function
              in <code>createPipe</code>.
            </li>
            <li>
              E6 polyfill is required. Core methods are reused, and data
              structure (like Map/Set) are not re-implemented.
            </li>
            <li>
              The implementation of each function should be as minimal as
              possible. Tree-shaking is supported by default. (Do you know that{' '}
              <code>lodash.keyBy</code> has 14KB after minification?)
            </li>
            <li>All functions are immutable, and there are no side-effects.</li>
            <li>Fixed number of arguments.</li>
          </ol>
          <p>MIT</p>
        </div>
      </div>
    </div>
  );
}
