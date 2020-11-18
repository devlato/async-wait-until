// Type definitions for async-wait-until
// Project: https://github.com/devlato/waitUntil
// Definitions by: devlato <https://github.com/devlato>
//                 Mike Coakley <mcoakley@acmeframework.com>

type Promisable<T> = T | Promise<T>;
type Falsy = false | 0 | '' | null | undefined

declare module 'async-wait-until' {
  type WaitPredicate<T> = () => Promisable<T>;
  function waitUntil<T extends any>(fn: WaitPredicate<T>, timeout?: number, interval?: number): Promise<Exclude<T, Falsy>>;

  export = waitUntil;
}
