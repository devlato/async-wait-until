# waitUntil

Waits for predicate to be truthy and resolves a Promise. The library provides TypeScript definitions. No dependencies needed. Please be sure that your environment has Promise support (or has a polyfill).


[![Build Status](https://travis-ci.org/devlato/waitUntil.svg?branch=master)](https://travis-ci.org/devlato/waitUntil)
[![Coverage Status](https://coveralls.io/repos/github/devlato/waitUntil/badge.svg?branch=master)](https://coveralls.io/github/devlato/waitUntil?branch=master)
[![Code Climate](https://codeclimate.com/github/devlato/waitUntil/badges/gpa.svg)](https://codeclimate.com/github/devlato/waitUntil)
[![Issue Count](https://codeclimate.com/github/devlato/waitUntil/badges/issue_count.svg)](https://codeclimate.com/github/devlato/waitUntil)
[![npm version](https://badge.fury.io/js/async-wait-until.svg)](https://badge.fury.io/js/async-wait-until)


## Installation

```sh
$ npm install async-wait-until
```


## Usage

The simple use case is described below:

```javascript
const waitUntil = require('async-wait-until');

const timeOfStart = Date.now();


// Wait for some async operation to end
waitUntil(() => {
  const timePassed = Date.now() - timeOfStart;

  return (timePassed < 500)
      && (timePassed % 2 === 0)  // Some random stuff
          ? true
          : throw new Error('Async operation failed');
}, 600)
.then((result) => {
  // Here are the operations to be done after predicate
  console.log('Async operation succeeded, predicate result = ', result);
})
.catch((error) => {
  // Here are the operations to be done if predicate didn't succeed in the timeout
  console.log('Async operation failed: ', error);
});
```


## async/await

The library is async/await compatible because it uses Promises/A+, so the example above could be rewritten:

```javascript
const waitUntil = require('async-wait-until');

const timeOfStart = Date.now();


// Wait for some async operation to end
try {
  const result = await waitUntil(() => {
    const timePassed = Date.now() - timeOfStart;

    return (timePassed < 500)
        && (timePassed % 2 === 0)  // Some random stuff
            ? true
            : throw new Error('Async operation failed');
  }, 600);

  // Here are the operations to be done after predicate
  console.log('Async operation succeeded, predicate result = ', result);
} catch (error) {
  // Here are the operations to be done if predicate didn't succeed in the timeout
  console.log('Async operation failed: ', error);
}
```


## Supported arguments

```javascript
/**
 * Waits for predicate to be truthy and resolves a Promise
 *
 * @param  predicate  Function  Predicate that checks the condition
 * @param  timeout  Number  Maximum wait interval, optional, 5000ms by default
 * @param  interval  Number  Wait interval, optional, 50ms by default
 * @return  Promise  Promise to return a callback result
 */
function waitUntil(
    predicate: Function,
    timeout: Number = 5000,
    interval: Number = 50
): Promise;
```


## TypeScript

The library exports type definitions for TypeScript. As far as the library ships the code with `commonJS` module support only, you have to use `import * as` syntax to use it:

```typescript
import * as waitUntil from 'async-wait-until';

const timeOfStart = Date.now();


// Wait for some async operation to end
try {
  const result = await waitUntil(() => {
    const timePassed = Date.now() - timeOfStart;

    return (timePassed < 500)
        && (timePassed % 2 === 0)  // Some random stuff
            ? true
            : throw new Error('Async operation failed');
  }, 600);

  // Here are the operations to be done after predicate
  console.log('Async operation succeeded, predicate result = ', result);
} catch (error) {
  // Here are the operations to be done if predicate didn't succeed in the timeout
  console.log('Async operation failed: ', error);
}
```


## Test coverage

Library has 100% test coverage:

```sh
$ npm run test:coverage

> async-wait-until@1.1.4 test:coverage ~/projects/waitUntil
> NODE_ENV=test jest --coverage --no-cache --config .jestrc

 PASS  test/waitUntil.js
  waitUntil
    ✓ Should apply callback and resolve result (219ms)
    ✓ Should apply callback and resolve non-boolean result (209ms)
    ✓ Should reject with timeout error if timed out (108ms)
    ✓ Should not do double reject on timeout (205ms)
    ✓ Should not do double reject on timeout if error in predicate (213ms)
    ✓ Should reject result if error in predicate (55ms)

--------------|----------|----------|----------|----------|----------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------|----------|----------|----------|----------|----------------|
All files     |      100 |      100 |      100 |      100 |                |
 waitUntil.js |      100 |      100 |      100 |      100 |                |
--------------|----------|----------|----------|----------|----------------|
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        1.984s
Ran all test suites.
```


## Code style

Library is 100% compatible with [airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) for ES5.


## Available commands

Library has the following commands available:

* Run the tests:

  ```
  $ npm test
  ```

* Run the tests and display test coverage:

  ```
  $ npm run test:coverage
  ```

* Run the linter:

  ```
  $ npm run lint
  ```

## Build

No building required, library is implemented with ES5 for better compatibility and shipped as is.


## License

Library is shipped "as is" under MIT License.


## Contributing

Feel free to contribute. Just raise ann issue, create a pull request covering it and don't forget to test everything properly.


[![NPM](https://nodei.co/npm/async-wait-until.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/async-wait-until/)
