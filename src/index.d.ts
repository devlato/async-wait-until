// Type definitions for async-wait-until
// Project: https://github.com/devlato/waitUntil
// Definitions by: devlato <https://github.com/devlato>
//                 Mike Coakley <mcoakley@acmeframework.com>

declare module 'async-wait-until' {
  type WaitPredicateResult = any;
  type WaitPredicate = () => WaitPredicateResult;
  type WaitUntil = (fn: WaitPredicate, timeout?: number, interval?: number) => Promise<WaitPredicateResult>;

  const waitUntil: WaitUntil;

  export = waitUntil;
}
