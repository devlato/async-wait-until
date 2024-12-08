# async-wait-until

A lightweight, zero-dependency library for waiting asynchronously until a specific condition is met. Works in any JavaScript environment that supports [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), including older Node.js versions and browsers (with polyfills if necessary).

![npm version](https://img.shields.io/npm/v/async-wait-until)
[![npm downloads](https://img.shields.io/npm/dw/async-wait-until)](https://npmjs.org/package/async-wait-until)
![MIT License](https://img.shields.io/npm/l/async-wait-until)
[![Maintainability](https://api.codeclimate.com/v1/badges/2a967399786c0d306247/maintainability)](https://codeclimate.com/github/devlato/async-wait-until/maintainability)

---

## 🚀 Installation

Install using npm:

```sh
npm install async-wait-until
```

The library includes UMD, CommonJS, and ESM bundles, so you can use it in any environment.

```javascript
import { waitUntil } from 'async-wait-until';

// Example: Wait for an element to appear
await waitUntil(() => document.querySelector('#target') !== null);
```

---

## 🛠️ How to Use

### Basic Example: Wait for a DOM Element

```javascript
import { waitUntil } from 'async-wait-until';

const waitForElement = async () => {
  // Wait for an element with the ID "target" to appear
  const element = await waitUntil(() => document.querySelector('#target'), { timeout: 5000 });
  console.log('Element found:', element);
};

waitForElement();
```

### Handling Timeouts

If the condition is not met within the timeout, a `TimeoutError` is thrown.

```javascript
import { waitUntil, TimeoutError } from 'async-wait-until';

const waitForElement = async () => {
  try {
    const element = await waitUntil(() => document.querySelector('#target'), { timeout: 5000 });
    console.log('Element found:', element);
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.error('Timeout: Element not found');
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

waitForElement();
```

---

## 📚 API

### `waitUntil(predicate, options)`

Waits for the `predicate` function to return a truthy value and resolves with that value.

**Parameters:**

| Name                              | Type       | Required | Default   | Description                                                                          |
| --------------------------------- | ---------- | -------- | --------- | ------------------------------------------------------------------------------------ |
| `predicate`                       | `Function` | ✅ Yes   | -         | A function that returns a truthy value (or a Promise for one).                       |
| `options.timeout`                 | `number`   | 🚫 No    | `5000` ms | Maximum wait time before throwing `TimeoutError`. Use `WAIT_FOREVER` for no timeout. |
| `options.intervalBetweenAttempts` | `number`   | 🚫 No    | `50` ms   | Interval between predicate evaluations.                                              |

---

## 💡 Recipes

### Wait Indefinitely

Use `WAIT_FOREVER` to wait without a timeout:

```javascript
import { waitUntil, WAIT_FOREVER } from 'async-wait-until';

await waitUntil(() => someCondition, { timeout: WAIT_FOREVER });
```

### Adjust Retry Interval

Change how often the predicate is evaluated:

```javascript
await waitUntil(() => someCondition, { intervalBetweenAttempts: 1000 }); // Check every 1 second
```

---

## 🧪 Development and Testing

Contributions are welcome! To contribute:

1. Fork and clone the repository.
2. Install dependencies: `npm install`.
3. Use the following commands:

- **Run Tests:** `npm test`
- **Lint Code:** `npm run lint`
- **Format Code:** `npm run format`
- **Build Library:** `npm run build`
- **Generate Docs:** `npm run docs`

---
