# async-wait-until

Waits for predicate to be truthy and resolves a Promise. The library provides TypeScript definitions. No dependencies needed. Please be sure that your environment has Promise support (or has a polyfill).


[![Build Status](https://travis-ci.org/devlato/async-wait-until.svg?branch=master)](https://travis-ci.org/devlato/async-wait-until)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2a967399786c0d306247/test_coverage)](https://codeclimate.com/github/devlato/async-wait-until/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/2a967399786c0d306247/maintainability)](https://codeclimate.com/github/devlato/async-wait-until/maintainability)
[![npm version](https://badge.fury.io/js/async-wait-until.svg)](https://badge.fury.io/js/async-wait-until)


## Installation

```sh
$ npm install --save async-wait-until
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

```typescript
/**
 * Waits for predicate to be truthy and resolves a Promise
 *
 * @param  predicate  Function  Predicate that checks the condition
 * @param  timeout  Number  Maximum wait interval, optional, 5000ms by default
 * @param  interval  Number  Wait interval, optional, 50ms by default
 * @return  Promise  Promise to return a callback result
 */
function waitUntil<T>(
    predicate: () => T | Promise<T>,
    timeout: number = 5000,
    interval: number = 50,
): Promise<Exclude<T, Falsy>>;
```


## TypeScript

The library exports type definitions for TypeScript. As far as the library ships the code with `commonJS` module support only, you have to use `import waitUntil = require()` syntax to use it:

```typescript
import waitUntil = require('async-wait-until');

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
    ✓ Should apply callback and resolve result (216ms)
    ✓ Should apply async callback and resolve result (208ms)
    ✓ Should apply callback and resolve non-boolean result (207ms)
    ✓ Should reject with timeout error if timed out (103ms)
    ✓ Should not do double reject on timeout (206ms)
    ✓ Should not do double reject on timeout if error in predicate (201ms)
    ✓ Should reject result if error in predicate (51ms)
    ✓ Should reject result if error in async predicate (103ms)

--------------|----------|----------|----------|----------|-------------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
--------------|----------|----------|----------|----------|-------------------|
All files     |      100 |      100 |      100 |      100 |                   |
 waitUntil.js |      100 |      100 |      100 |      100 |                   |
--------------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        2.217s
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
