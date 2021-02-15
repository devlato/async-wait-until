# async-wait-until

A tiny yet convenient and fast zero-dependency library that makes it possible to write an asynchronous code that awaits some event to happen. It works on any JavaScript runtime that supports [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) either natively or with a polyfill (i.e. [this one](https://www.npmjs.com/package/promise-polyfill)).

![npm version](https://img.shields.io/npm/v/async-wait-until)
[![npm downloads, weekly](https://img.shields.io/npm/dw/async-wait-until)](https://npmjs.org/package/async-wait-until)
[![online documentation](https://img.shields.io/badge/📖-Documentation-informational)](https://devlato.github.io/async-wait-until/)
![build status](https://github.com/devlato/async-wait-until/workflows/CI/badge.svg)
![maintainability](https://img.shields.io/codeclimate/maintainability/devlato/async-wait-until)
![code coverage](https://img.shields.io/codeclimate/coverage/devlato/async-wait-until)
![minzipped bundle size](https://img.shields.io/bundlephobia/minzip/async-wait-until)
![license](https://img.shields.io/npm/l/async-wait-until)


## ⚙️ Installation

The package is available on [npm](https://npmjs.org/package/async-wait-until):

```sh
$ npm install --save async-wait-until
```

It ships with a [UMD](https://github.com/umdjs/umd) bundle by default (which works well as-is on Node.js and web browsers), but other bundles are also available in the package's `dist/` folder:

* [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1):
  ```js
  const { waitUntil } = require('async-wait-until/dist/commonjs');
  // ...
  ```
* [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#introducing_an_example):
  ```js
  import { waitUntil } from 'async-wait-until/dist/es.js';
  // ...
  ```
* [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD):
  ```html
  <script type="text/javascript" src="scripts/require.js"></script>
  <script type="text/javascript">
    requirejs.config({
      baseUrl: 'scripts/node_modules',
      paths: {
        'async-wait-until': 'async-wait-until/dist/amd.js',
      },
    });
    define(['async-wait-until'], ({ waitUntil }) => {
      // ...
    });
  </script>
  ```
* [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE):
  ```html
  <script type="text/javascript" src="async-wait-until/dist/iife.js"></script>
  <script type="text/javascript">
    const { waitUntil } = asyncWaitUntil;
    // ...    
  </script>
  ```
* [SystemJS](https://github.com/systemjs/systemjs):
  ```html
  <script src="scripts/system.js"></script>
  <script type="systemjs-importmap">
    {
      imports: {
        'async-wait-until': './scripts/node_modules/async-wait-until/dist/systemjs.js',
      }
    }
  </script>
  <script type="systemjs-module">
    System
        .import('async-wait-until')
        .then(({ waitUntil }) => {
          // ...
        });
  </script>
  ```


## 👨‍💻👩‍💻 Use

Let's assume we have a piece of code that asynchronously appends a new `<div />` node to the page body, and we want to wait for it to happen and then do something with that node.
Let's also assume that for some unknown reason, we can neither use [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) nor modify the code that adds the node 🤷‍♂️. How bizarre!

However, we know that optimistically, on a fast enough computer, this will happen within let's say 10 seconds (but it's not guaranteed). The following code snippet mimics this behaviour:

```js
// @file a-sneaky-module.js

// Aha! Sometimes, it can take more than 10 seconds, and this is how we emulate it
const MAX_IDLE_INTERVAL_MILLISECONDS_BEFORE_ADDING_A_DIV_IN = 11 * 1000;

// Some utility functions, it's safe to ignore them 
const randomIntegerInRange = ({ min = 0, max }) => 
  min + Math.floor(Math.random() * (max - min));
const randomTimeInterval = () => randomIntegerInRange({ 
  max: MAX_IDLE_INTERVAL_MILLISECONDS_BEFORE_ADDING_A_DIV_IN,
});

// Adds a <div /> to the document body
const appendADivToTheDocumentBody = () => {
  const node = document.createElement('div');
  node.className = 'spooky-spooky-skeleton';
  window.document.body.appendChild(node);
};

// A sneaky function that schedules adding a <div /> to the document body 
// at some time within 11 seconds
const appendADivToTheDocumentBodySomeAtTimeWithinAGivenTimeInterval = () => 
  setTimeout(
    appendADivToTheDocumentBody,
    randomTimeInterval(),
  );

export const doTheDivThing = appendADivToTheDocumentBodySomeAtTimeWithinAGivenTimeInterval;
```

Let's call the above code `a-sneaky-module.js`.

So how do we the consumers of the `a-sneaky-module.js` know when exactly the `<div />` node gets added?

```js
import { doTheDivThing } from './a-sneaky-module.js';

const doOutThing = async () => {
  // ...

  doTheDivThing();
  // Hmmmm... so what? How do we work with that <div />. Is it already in the DOM?
};
```

`async-wait-until` to the rescue, we can easily detect when it happens (and react to it):

```js
import { doTheDivThing } from './a-sneaky-module.js';
import { waitUntil } from './async-wait-until';

const doOutThing = async () => {
  // ...
  
  doTheDivThing();

  // Yup! Easy right?
  const divNode = await waitUntil(
    // Here, we specify a function that will be repeatedly called from time to time
    // Let's call this kind of functions a `predicate`
    () => window.document.body.querySelector('div.spooky-spooky-skeleton'),
    // Here, we can specify a timeout in milliseconds. Once it passes, 
    // we'll stop waiting and throw an exception
    { timeout: 10000 },
  );
  // A colour of triumph
  divNode.style.backgroundColor = 'rgba(ff, 0, 0, 0.5)';
};
```

However, we aren't 100% sure that the `<div />` will be added within 10 seconds. What will happen if 10 seconds have passed and the `<div />` node still isn't there?

From the above code, it's clear that our `'predicate'` function (or simply `'preddcate'`) won't return the DOM node. So what `waitUntil` will do in that case is it will throw a `TimeoutException` (also exported from the library so you can handle it).

```js
import { doTheDivThing } from './a-sneaky-module.js';
import { waitUntil, TimeoutError } from './async-wait-until';

const doOutThing = async () => {
  // ...
  
  doTheDivThing();

  try {
    const predicate = () => window.document.body.querySelector('div.spooky-spooky-skeleton');
    const divNode = await waitUntil(predicate, { timeout: 10000 });
    
    divNode.style.backgroundColor = 'rgba(ff, 0, 0, 0.5)';
  } catch (e) {
    if (e instanceof TimeoutError) {
      // Unfortunately, 10 seconds have passed but we haven't detected the `<div />`
      // If we had a UI, we could show an error there or allow user to retry
      alert('No <div /> have been detected unfortunately');
    } else {
      // Some another error, most likely thrown from the predicate function.
      alert('Unknown error occurred');
      console.error(e);
    }    
  }
};
```

So, summing up the above, the predicate will run again and again within the given timeout, until it first returns a non-[falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value. If this doesn't happen, a `TimeoutError` is thrown.

### API

Lets' start with the `waitUntil` function. It takes up to three parameters, and returns a Promise that will be resolved with the first non-falsy value returned by the predicate.

Parameter | Type | Required | Description
------------ | -------------
`predicate` | Function | Yes | A function that is expected to return a non-falsy (aka a `'truthy'`) value, or a Promise to return such a value. Hence, *both sync and async functions are supported*.
`options` | Options object | No; default = 500 ms | Options for the wait algorithm implemented by `waitUntil`, see its properties on the below table. *Deprecated*: timeout in milliseconds.
`intervalBetweenAttempts` | number | No; default = 50 ms | Deprecated: number of milliseconds between retry attempts. Please use options instead. 

Above, you could see the options param. Here are the available options:

Parameter | Type | Required | Description
------------ | -------------
`timeout` | number | No; default = 500 ms | Timeout in milliseconds.
`intervalBetweenAttempts` | number | No; default = 50 ms | Number of milliseconds between retry attempts.


## 👨‍⚖️👩‍⚖️ License

Library is shipped "as is" under the MIT License.


## 👷‍♂️👷‍♀️ Contributing

Contributions (issues, bug and feature requests, and PRs) are welcome! Please follow the contribution guidelines.

### Development dependencies

1. The library is written in [TypeScript](http://typescriptlang.org) and is bundled with [Parcel](https://parceljs.org).
2. Code style is powered by [ESLint](https://eslint.org) and [Prettier](https://prettier.io) with a custom config.
3. We use [jest](http://jestjs.io/) for running unit tests.

### Available commands

#### Test:

```sh
$ npm test
```

#### Lint:

```sh
$ npm run lint
```

#### Reformat:

```sh
$ npm run format
```

#### Build

```sh
$ npm run build
```

#### Generate docs

```sh
$ npm run doc
```
