// Type definitions for async-wait-until
// Project: async-await-until
// Definitions by: Mike Coakley <mcoakley@acmeframework.com>

export = waitUntil;

declare function waitUntil(
    predicate: Function,
    timeout: number,
    interval: number
): Promise<any>;