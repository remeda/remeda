import * as React from 'react';

export function Readme() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<h1 id="remeda">Remeda</h1>
  <p>The first &quot;data-first&quot; and &quot;data-last&quot; utility library designed especially for TypeScript.</p>
  <p><a href="https://travis-ci.org/remeda/remeda"><img src="https://travis-ci.org/remeda/remeda.svg?branch=master" alt="Build Status"></a>
  <a href="https://www.npmjs.org/package/remeda"><img src="https://badge.fury.io/js/remeda.svg" alt="npm module"></a>
  <a href="https://david-dm.org/remeda/remeda"><img src="https://david-dm.org/remeda/remeda.svg" alt="dependencies"></a></p>
  <h2 id="why-remeda-">Why Remeda?</h2>
  <p>There are no good utility libraries that work well with TypeScript. When working with Lodash or Ramda you must sometimes annotate types manually.<br>Remeda is written and tested in TypeScript and that means there won&#39;t be any problems with custom typings.</p>
  <h2 id="what-s-data-first-and-data-last-">What&#39;s &quot;data-first&quot; and &quot;data-last&quot;?</h2>
  <p>Functional programming is nice, and it makes the code more readable. However there are situations where you don&#39;t need &quot;pipes&quot;, and you want to call just a single function.  </p>
  <pre><code class="language-js">// Remeda
  R.pick(obj, [&#39;firstName&#39;, &#39;lastName&#39;]);
  
  // Ramda
  R.pick([&#39;firstName&#39;, &#39;lastName&#39;], obj);
  
  // Lodash
  _.pick(obj, [&#39;firstName&#39;, &#39;lastName&#39;]);</code></pre>
  <p>In the above example, &quot;data-first&quot; approach is more natural and more programmer friendly because when you type the second argument, you get the auto-complete from IDE. It&#39;s not possible to get the auto-complete in Ramda because the data argument is not provided.</p>
  <p>&quot;data-last&quot; approach is helpful when writing data transformations aka pipes.</p>
  <pre><code class="language-js">const users = [
    {name: &#39;john&#39;, age: 20, gender: &#39;m&#39;},
    {name: &#39;marry&#39;, age: 22, gender: &#39;f&#39;},
    {name: &#39;samara&#39;, age: 24, gender: &#39;f&#39;},
    {name: &#39;paula&#39;, age: 24, gender: &#39;f&#39;},
    {name: &#39;bill&#39;, age: 33, gender: &#39;m&#39;},
  ]
  
  // Remeda
  R.pipe(
    users,
    R.filter(x =&gt; x.gender === &#39;f&#39;),
    R.groupBy(x =&gt; x.age),
  );
  
  // Ramda
  R.pipe(
    R.filter(x =&gt; x.gender === &#39;f&#39;),
    R.groupBy(x =&gt; x.age),
  )(users) // broken typings in TS :(
  
  // Lodash
  _(users)
    .filter(x =&gt; x.gender === &#39;f&#39;)
    .groupBy(x =&gt; x.age)
    .value()
  
  // Lodash-fp
  _.flow(
    _.filter(x =&gt; x.gender === &#39;f&#39;),
    _.groupBy(x =&gt; x.age),
  )(users)// broken typings in TS :(</code></pre>
  <p>Mixing paradigms can be cumbersome in Lodash because it requires importing two different methods.<br>Remeda implements all methods in two versions, and the correct overload is picked based on the number of provided arguments.<br>The &quot;data-last&quot; version must always have one argument less than the &quot;data-first&quot; version.</p>
  <pre><code class="language-js">// Remeda
  R.pick(obj, [&#39;firstName&#39;, &#39;lastName&#39;]); // data-first
  R.pipe(obj, R.pick([&#39;firstName&#39;, &#39;lastName&#39;])); // data-last
  
  R.pick([&#39;firstName&#39;, &#39;lastName&#39;], obj); // error, this won&#39;t work!
  R.pick([&#39;firstName&#39;, &#39;lastName&#39;])(obj); // this will work but the types cannot be inferred
  </code></pre>
  <h2 id="lazy-evaluation">Lazy evaluation</h2>
  <p>Many functions support lazy evaluation when using <code>pipe</code> or <code>createPipe</code>. These functions have a <code>pipeable</code> tag in the documentation.<br>Lazy evaluation is not supported in Ramda and only partially supported in lodash.</p>
  <pre><code class="language-js">// Get first 3 unique values
  const arr = [1, 2, 2, 3, 3, 4, 5, 6];
  
  const result = R.pipe(
    arr,
    R.map(x =&gt; {
      console.log(&#39;iterate&#39;, x);
      return x;
    }),
    R.uniq(),
    R.take(3)
  ); // =&gt; [1, 2, 3]
  
  /**
   * Console output:
   * iterate 1
   * iterate 2
   * iterate 2
   * iterate 3
   * /
  </code></pre>
  <h2 id="indexed-version">Indexed version</h2>
  <p>Iterable functions have an extra property <code>indexed</code> which is the same function with iterator <code>(element, index, array)</code>.</p>
  <pre><code class="language-js">const arr = [10, 12, 13, 3];
  
  // filter even values
  R.filter(arr, x =&gt; x % 2 === 0); // =&gt; [10, 12]
  
  // filter even indexes
  R.filter.indexed(arr, (x, i) =&gt; i % 2 === 0); // =&gt; [10, 13]</code></pre>
  <h2 id="remeda-design-goals">Remeda Design Goals</h2>
  <ol>
  <li>The usage must be programmer friendly, and that&#39;s more important than following XYZ paradigm strictly.</li>
  <li>Manual annotation should never be required, and proper typings should infer everything. The only exception is the first function in <code>createPipe</code>.</li>
  <li>E6 polyfill is required. Core methods are reused, and data structure (like Map/Set) are not re-implemented.</li>
  <li>The implementation of each function should be as minimal as possible. Tree-shaking is supported by default. (Do you know that <code>lodash.keyBy</code> has 14KB after minification?)</li>
  <li>All functions are immutable, and there are no side-effects.</li>
  <li>Fixed number of arguments.</li>
  </ol>
  <p>MIT</p>
  
  `,
      }}
    />
  );
}
