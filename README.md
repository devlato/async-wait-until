# async-wait-until

Waits for predicate to be truthy and resolves a Promise. The library provides TypeScript definitions. No dependencies needed. Please be sure that your environment ships with Promise support (or has a Promises/A+ polyfill).

[![Build Status](https://travis-ci.org/devlato/async-wait-until.svg?branch=master)](https://travis-ci.org/devlato/async-wait-until)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2a967399786c0d306247/test_coverage)](https://codeclimate.com/github/devlato/async-wait-until/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/2a967399786c0d306247/maintainability)](https://codeclimate.com/github/devlato/async-wait-until/maintainability)
[![npm version](https://badge.fury.io/js/async-wait-until.svg)](https://badge.fury.io/js/async-wait-until)

[<img alt="Download Stats" src="https://nodei.co/npm/async-wait-until.png?downloads=true&downloadRank=true&stars=true" width="196" />](https://nodei.co/npm/async-wait-until/)

## Installation

```sh
$ npm install --save async-wait-until
```

## Usage

```javascript
/**
 * Waits for predicate to be truthy and resolves a Promise
 *
 * @param  predicate  Function  Predicate that checks the condition
 * @param  timeout  number  Maximum wait interval, optional, 5000ms by default
 * @param  cooldownInterval  number  Interval to wait for between attempts, optional, 50ms by default
 * @return  Promise  Promise to return a callback result
 */
function waitUntil(predicate: Function, timeout: number = 5000, cooldownInterval: number = 50): Promise {}
```

The simplest use case is illustrated below:

```javascript
const waitUntil = require('async-wait-until');

const timeOfStart = Date.now();

// Wait for some async operation to end
waitUntil(
  () => {
    const timePassed = Date.now() - timeOfStart;

    return timePassed < 500 && timePassed % 2 === 0 // Some random stuff
      ? true
      : throw new Error('Async operation failed');
  },
  600,
  100,
)
  .then((result) => {
    // Here are the operations to be done after predicate
    console.log('Async operation succeeded, predicate result = ', result);
  })
  .catch((error) => {
    // Here are the operations to be done if predicate didn't succeed in the timeout
    console.log('Async operation failed: ', error);
  });
```

Here, the predicate function provided as a callback, gets called every 100 ms (while a default cooldown interval is 50 ms). Depending on the outcome of the predicate, the following can happen:

1. _The predicate returns any truthy value_. In this case, the returned Promise will resolve with the value last returned from the predicate.
2. _The predicate returns any falsy value_. If there's been no more than 600 ms (while the default timeout is 5000 ms), another attempt will happen after the cooldown interval. Otherwise, the Promise will reject withh a timeout error.
3. _The predicate throws an exception_. In this scenario, the Promise will reject with the thrown exception.

At any time, if the specified timeout has passed and no truthy value has been ever returned from the predicate, the Promise will reject with a timeout error.

The Predicate can also be an async function.

## async/await

The library is async/await compatible because it uses Promises/A+, so the example above could be rewritten:

```javascript
const waitUntil = require('async-wait-until');

const timeOfStart = Date.now();

// Wait for some async operation to end
try {
  const result = await waitUntil(() => {
    const timePassed = Date.now() - timeOfStart;

    return timePassed < 500 && timePassed % 2 === 0 // Some random stuff
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

## License

Library is shipped "as is" under the MIT License.

## Contributing

Contributions (issues, bug and feature requests, and PRs) are welcome! Please follow the contribution guidelines.

### Development dependencies

1. The library is written in [TypeScript](http://typescriptlang.org) and is bundled with [Parcel](https://parceljs.org).
2. Code style is powered by [ESlint](https://eslint.org) and [Prettier](https://prettier.io) with a custom config.
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
$ npm run lint
```

#### Generate docs

```sh
$ npm run doc
```
