# waitUntil

Waits for predicate to be truthy and resolves a Promise


## Installation

```sh
$ npm install async-wait-until
```


## Usage

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

The library is async/await compatible because it uses Promises/A+ compatible Promises, so the example above could be rewritten:

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
  }, 600)

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
 * @param  timeout  Number  Maximum wait interval, 5000ms by default
 * @param  interval  Number  Wait interval, 50ms by default
 * @return  Promise  Promise to return a callback result
 */
function waitUntil(predicate: Function, timeout: Number = 5000, interval: Number = 50): Promise;
```


## Test coverage

Library has 100% test coverage:

```sh
$ npm run test:coverage
> async-wait-until@1.0.1 test:coverage /Users/denis.tokarev/git/experiments/apply-when
> NODE_ENV=test jest --coverage --no-cache --config .jestrc

 PASS  test/waitUntil.js
  waitUntil
    ✓ Should apply callback and resolve result (219ms)
    ✓ Should reject with timeout error if timed out (106ms)
    ✓ Should not do double reject on timeout (206ms)
    ✓ Should not do double reject on timeout if error in predicate (204ms)
    ✓ Should reject result if error in predicate (52ms)

--------------|----------|----------|----------|----------|----------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------|----------|----------|----------|----------|----------------|
All files     |      100 |      100 |      100 |      100 |                |
 waitUntil.js |      100 |      100 |      100 |      100 |                |
--------------|----------|----------|----------|----------|----------------|
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.954s
Ran all test suites.
```


## Test coverage

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


## Contributing

Feel free to contribute but don't forget to test everything properly.
