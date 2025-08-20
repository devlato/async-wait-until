# async-wait-until

A lightweight, zero-dependency library for waiting asynchronously until a specific condition is met. Works in any JavaScript environment that supports [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), including older Node.js versions and browsers (with polyfills if necessary).

![npm version](https://img.shields.io/npm/v/async-wait-until)
[![npm downloads](https://img.shields.io/npm/dw/async-wait-until)](https://npmjs.org/package/async-wait-until)
![MIT License](https://img.shields.io/npm/l/async-wait-until)
[![Maintainability](https://api.codeclimate.com/v1/badges/2a967399786c0d306247/maintainability)](https://codeclimate.com/github/devlato/async-wait-until/maintainability)

## ✨ Features

- 🚀 **Zero dependencies** - Lightweight and fast
- 🔧 **TypeScript support** - Full TypeScript definitions included
- 🌐 **Universal compatibility** - Works in Node.js and browsers
- ⚡ **Flexible configuration** - Customizable timeouts and intervals
- 🎯 **Promise-based** - Clean async/await syntax
- 📦 **Multiple formats** - UMD, ESM, and additional format bundles
- 🛡️ **Error handling** - Built-in timeout error handling

## 📚 Table of Contents

- [Installation](#-installation)
- [How to Use](#️-how-to-use)
- [API Reference](#-api)
- [TypeScript Usage](#-typescript-usage)
- [Recipes](#-recipes)
- [Browser Compatibility](#-browser-compatibility)
- [Troubleshooting](#-troubleshooting)
- [Development and Testing](#-development-and-testing)
- [Links](#-links)

## 📖 Detailed Documentation

For detailed documentation, visit [https://devlato.github.io/async-wait-until/](https://devlato.github.io/async-wait-until/)

---

## 🚀 Installation

Install using npm:

```sh
npm install async-wait-until
```

The library includes UMD and ESM bundles (plus additional formats), so you can use it in any environment.

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

## 📚 API Reference

### `waitUntil(predicate, options)`

Waits for the `predicate` function to return a truthy value and resolves with that value.

**Parameters:**

| Name                              | Type       | Required | Default   | Description                                                                          |
| --------------------------------- | ---------- | -------- | --------- | ------------------------------------------------------------------------------------ |
| `predicate`                       | `Function` | ✅ Yes   | -         | A function that returns a truthy value (or a Promise for one).                       |
| `options.timeout`                 | `number`   | 🚫 No    | `5000` ms | Maximum wait time before throwing `TimeoutError`. Use `WAIT_FOREVER` for no timeout. |
| `options.intervalBetweenAttempts` | `number`   | 🚫 No    | `50` ms   | Interval between predicate evaluations.                                              |

### Exported Constants

| Name                                    | Value | Description                                    |
| --------------------------------------- | ----- | ---------------------------------------------- |
| `WAIT_FOREVER`                          | `∞`   | Use for infinite timeout (no time limit).     |
| `DEFAULT_TIMEOUT_IN_MS`                 | `5000`| Default timeout duration in milliseconds.     |
| `DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS`| `50`  | Default interval between attempts in milliseconds. |

### Exported Classes

- **`TimeoutError`** - Error thrown when timeout is reached before condition is met.

---

## 🔧 TypeScript Usage

This library is written in TypeScript and includes full type definitions. Here are some TypeScript-specific examples:

### Basic TypeScript Usage

```typescript
import { waitUntil, TimeoutError, WAIT_FOREVER } from 'async-wait-until';

// The return type is automatically inferred
const element = await waitUntil(() => document.querySelector('#target'));
// element is typed as Element | null

// With custom timeout and interval
const result = await waitUntil(
  () => someAsyncCondition(),
  { 
    timeout: 10000, 
    intervalBetweenAttempts: 100 
  }
);
```

### Using with Async Predicates

```typescript
// Async predicate example
const checkApiStatus = async (): Promise<boolean> => {
  const response = await fetch('/api/health');
  return response.ok;
};

try {
  await waitUntil(checkApiStatus, { timeout: 30000 });
  console.log('API is ready!');
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('API failed to become ready within 30 seconds');
  }
}
```

### Type-Safe Options

```typescript
import { Options } from 'async-wait-until';

const customOptions: Options = {
  timeout: 15000,
  intervalBetweenAttempts: 200
};

await waitUntil(() => someCondition(), customOptions);
```

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

### Wait for API Response

```javascript
const waitForApi = async () => {
  const response = await waitUntil(async () => {
    try {
      const res = await fetch('/api/status');
      return res.ok ? res : null;
    } catch {
      return null; // Keep trying on network errors
    }
  }, { timeout: 30000, intervalBetweenAttempts: 1000 });
  
  return response.json();
};
```

### Wait for File System Changes (Node.js)

```javascript
import fs from 'fs';
import { waitUntil } from 'async-wait-until';

// Wait for a file to be created
const filePath = './important-file.txt';
await waitUntil(() => fs.existsSync(filePath), { timeout: 10000 });

// Wait for file to have content
await waitUntil(() => {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8').trim().length > 0;
  }
  return false;
});
```

### Wait for Database Connection

```javascript
const waitForDatabase = async (db) => {
  await waitUntil(async () => {
    try {
      await db.ping();
      return true;
    } catch {
      return false;
    }
  }, { timeout: 60000, intervalBetweenAttempts: 2000 });
  
  console.log('Database is ready!');
};
```

### Wait with Custom Conditions

```javascript
// Wait for multiple conditions
const waitForComplexCondition = async () => {
  return waitUntil(() => {
    const user = getCurrentUser();
    const permissions = getPermissions();
    const apiReady = isApiReady();
    
    // All conditions must be true
    return user && permissions.length > 0 && apiReady;
  });
};

// Wait for specific value ranges
const waitForTemperature = async () => {
  return waitUntil(async () => {
    const temp = await getSensorTemperature();
    return temp >= 20 && temp <= 25 ? temp : null;
  });
};
```

---

## 🌐 Browser Compatibility

This library works in any JavaScript environment that supports Promises:

**Node.js:** ✅ Version 0.14.0 and above  
**Modern Browsers:** ✅ Chrome 32+, Firefox 29+, Safari 8+, Edge 12+  
**Legacy Browsers:** ✅ With Promise polyfill (e.g., es6-promise)

### CDN Usage

```html
<!-- UMD bundle via CDN -->
<script src="https://unpkg.com/async-wait-until@latest/dist/index.js"></script>
<script>
  // Available as global variable
  asyncWaitUntil.waitUntil(() => document.querySelector('#target'))
    .then(element => console.log('Found:', element));
</script>
```

### ES Modules in Browser

```html
<script type="module">
  import { waitUntil } from 'https://unpkg.com/async-wait-until@latest/dist/index.esm.js';
  
  const element = await waitUntil(() => document.querySelector('#target'));
  console.log('Found:', element);
</script>
```

---

## 🔍 Troubleshooting

### Common Issues

**Q: My predicate never resolves, what's wrong?**  
A: Make sure your predicate function returns a truthy value when the condition is met. Common mistakes:
- Forgetting to return a value: `() => { someCheck(); }` ❌
- Correct: `() => { return someCheck(); }` ✅ or `() => someCheck()` ✅

**Q: I'm getting unexpected timeout errors**  
A: Check that:
- Your timeout is long enough for the condition to be met
- Your predicate function doesn't throw unhandled errors
- Network requests in predicates have proper error handling

**Q: The function seems to run forever**  
A: This happens when:
- Using `WAIT_FOREVER` without proper condition logic
- Predicate always returns falsy values
- Add logging to debug: `() => { const result = myCheck(); console.log(result); return result; }`

**Q: TypeScript compilation errors**  
A: Ensure you're importing types correctly:
```typescript
import { waitUntil, Options, TimeoutError } from 'async-wait-until';
```

### Performance Tips

- Use reasonable intervals (50-1000ms) to balance responsiveness and CPU usage
- For expensive operations, increase the interval: `{ intervalBetweenAttempts: 1000 }`
- Implement proper error handling in async predicates to avoid unnecessary retries
- Consider using `WAIT_FOREVER` with external cancellation for long-running waits

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

## 📝 Links

- [License](./LICENSE)
- [Detailed Documentation](https://devlato.github.io/async-wait-until/)
- [Changelog](./CHANGELOG.md) - Track version updates and changes
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute to the project
- [Code of Conduct](./CODE_OF_CONDUCT.md) - Community standards and expectations
