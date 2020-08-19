// Type definitions for async-wait-until
// Project: https://github.com/devlato/waitUntil
// Definitions by: devlato <https://github.com/devlato>
//                 Mike Coakley <mcoakley@acmeframework.com>

declare module 'async-wait-until' {
  type WaitPredicate<T> = () => T | null | undefined | false | '' | 0;
  type WaitUntil = <T>(fn: WaitPredicate<T>, timeout?: number, interval?: number) => Promise<T>;

  const waitUntil: WaitUntil;

  export = waitUntil;
}
