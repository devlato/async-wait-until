/**
 * @packageDocumentation
 * @module async-wait-until
 *
 * Provides utility functions for waiting asynchronously until a specified condition is met.
 */

/**
 * Error thrown when a timeout occurs while waiting for a condition.
 */
export class TimeoutError extends Error {
  /**
   * Creates a new `TimeoutError` instance.
   * @param timeoutInMs - The timeout duration in milliseconds, if provided.
   *
   * @example
   * ```typescript
   * throw new TimeoutError(5000);
   * // Throws: Timed out after waiting for 5000 ms
   * ```
   */
  constructor(timeoutInMs?: number) {
    super(timeoutInMs != null ? `Timed out after waiting for ${timeoutInMs} ms` : 'Timed out');
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Default interval (in milliseconds) between attempts to evaluate the predicate.
 */
export const DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS = 50;

/**
 * Default timeout duration (in milliseconds) for the `waitUntil` function.
 */
export const DEFAULT_TIMEOUT_IN_MS = 5000;

/**
 * Special constant representing an infinite timeout.
 */
export const WAIT_FOREVER = Number.POSITIVE_INFINITY;

/**
 * Represents values considered falsy in JavaScript.
 */
export type FalsyValue = null | undefined | false | '' | 0 | void;

/**
 * Represents values considered truthy in JavaScript.
 */
export type TruthyValue =
  | Record<string, unknown>
  | unknown[]
  | symbol
  // eslint-disable-next-line no-unused-vars
  | ((..._args: unknown[]) => unknown)
  | Exclude<number, 0>
  | Exclude<string, ''>
  | true;

/**
 * Represents the possible return values of a predicate.
 */
export type PredicateReturnValue = TruthyValue | FalsyValue;

/**
 * Represents a predicate function that evaluates a condition.
 *
 * @typeParam T - The type of value the predicate returns.
 */
export type Predicate<T extends PredicateReturnValue> = () => T | Promise<T>;

/**
 * Options for configuring the behavior of the `waitUntil` function.
 */
export type Options = {
  /**
   * The maximum duration (in milliseconds) to wait before timing out.
   */
  timeout?: number;

  /**
   * The interval (in milliseconds) between attempts to evaluate the predicate.
   */
  intervalBetweenAttempts?: number;
};

/**
 * Waits until a predicate evaluates to a truthy value or the specified timeout is reached.
 *
 * @typeParam T - The type of value the predicate returns.
 *
 * @param predicate - The function to evaluate repeatedly until it returns a truthy value.
 * @param options - Either the timeout duration in milliseconds, or an options object for configuring the wait behavior.
 * @param intervalBetweenAttempts - The interval (in milliseconds) between predicate evaluations. Ignored if `options` is an object.
 *
 * @returns A promise that resolves to the truthy value returned by the predicate, or rejects with a `TimeoutError` if the timeout is reached.
 *
 * @example
 * Basic usage with a simple condition:
 * ```typescript
 * import waitUntil from 'async-wait-until';
 *
 * const isConditionMet = () => Math.random() > 0.9;
 *
 * try {
 *   const result = await waitUntil(isConditionMet, { timeout: 5000 });
 *   console.log('Condition met:', result);
 * } catch (error) {
 *   console.error('Timed out:', error);
 * }
 * ```
 *
 * @example
 * Usage with custom interval between attempts:
 * ```typescript
 * import waitUntil from 'async-wait-until';
 *
 * const isReady = async () => {
 *   const value = await checkAsyncCondition();
 *   return value > 10;
 * };
 *
 * try {
 *   const result = await waitUntil(isReady, { timeout: 10000, intervalBetweenAttempts: 100 });
 *   console.log('Ready:', result);
 * } catch (error) {
 *   console.error('Timeout reached:', error);
 * }
 * ```
 *
 * @example
 * Infinite wait with manual timeout handling:
 * ```typescript
 * import waitUntil, { WAIT_FOREVER } from 'async-wait-until';
 *
 * const someCondition = () => Boolean(getConditionValue());
 *
 * const controller = new AbortController();
 * setTimeout(() => controller.abort(), 20000); // Cancel after 20 seconds
 *
 * try {
 *   const result = await waitUntil(someCondition, { timeout: WAIT_FOREVER });
 *   console.log('Condition met:', result);
 * } catch (error) {
 *   if (controller.signal.aborted) {
 *     console.error('Aborted by the user');
 *   } else {
 *     console.error('Error:', error);
 *   }
 * }
 * ```
 */
export const waitUntil = <T extends PredicateReturnValue>(
  predicate: Predicate<T>,
  options?: number | Options,
  intervalBetweenAttempts?: number,
): Promise<T> => {
  const timeoutMs = (typeof options === 'number' ? options : options?.timeout) ?? DEFAULT_TIMEOUT_IN_MS;
  const intervalMs =
    (typeof options === 'number' ? intervalBetweenAttempts : options?.intervalBetweenAttempts) ??
    DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS;

  let timeoutHandle: NodeJS.Timeout | undefined;
  let intervalHandle: NodeJS.Timeout | undefined;

  return Promise.race([
    ...(timeoutMs !== WAIT_FOREVER
      ? [
          new Promise<never>((_, reject) => {
            timeoutHandle = setTimeout(() => {
              reject(new TimeoutError(timeoutMs));
            }, timeoutMs);
          }),
        ]
      : []),
    new Promise<T>((resolve, reject) => {
      const check = async () => {
        try {
          const value = await predicate();
          if (value) {
            resolve(value);
            return;
          }
          intervalHandle = setTimeout(check, intervalMs);
        } catch (err) {
          reject(err);
        }
      };
      void check();
    }),
  ]).finally(() => {
    timeoutHandle && clearTimeout(timeoutHandle);
    intervalHandle && clearTimeout(intervalHandle);
  });
};

export default waitUntil;
