# waitUntil

Waits for predicate to be truthy and resolves a Promise


## Installation

```sh
$ npm install waitUntil
```


## Usage

```javascript
const waitUntil = require('waitUntil');
const timeOfStart = Date.now();


// Wait for some async operation to end
waitUntil(() => {
  const timePassed = Date.now() - timeOfStart;

  return (timePassed < 500) 
      && (timePassed % 2 === 0)  // Some random stuff
          ? true
          : throw new Error('Async operation failed');
}, 600)
.then(() => {
  console.log('Async operation succeeded');
})
.catch((error) => {
  console.log('Async operation failed: ', error);
});

```


## async/await

The library is async/await compatible because it uses Promises/A+ compatible Promises, so the example above could be rewritten:

```javascript
const waitUntil = require('waitUntil');
const timeOfStart = Date.now();


// Wait for some async operation to end
try {
  await waitUntil(() => {
    const timePassed = Date.now() - timeOfStart;

    return (timePassed < 500) 
        && (timePassed % 2 === 0)  // Some random stuff
            ? true
            : throw new Error('Async operation failed');
  }, 600)
  console.log('Async operation succeeded');
} catch (error) {
  console.log('Async operation failed: ', error);
}
```

## Test coverage


