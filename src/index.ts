/**
 * Timeout error
 * @public
 * @param  message  string  Error message
 */
export class TimeoutError extends Error {
  constructor(timeout?: number) {
    super(timeout != null ? `Timed out after waiting for ${timeout} ms` : 'Timed out');

    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Unsupported platform error
 * @public
 * @param  message  string  Error message
 */
export class UnsupportedPlatformError extends Error {
  constructor() {
    super('Unsupported platform');

    Object.setPrototypeOf(this, UnsupportedPlatformError.prototype);
  }
}

/**
 * A utility function for cross-platform type-safe scheduling
 * @private
 * @returns Scheduler
 * @throws UnsupportedPlatformError
 */
const getScheduler = (): Scheduler => {
  if (
    // Not a web browser
    window == null ||
    // Not Node.js
    module == null ||
    global == null
  ) {
    throw new UnsupportedPlatformError();
  }

  return {
    schedule: (fn, interval) => {
      let scheduledTimer: number | NodeJS.Timeout | undefined = undefined;

      const cleanUp = (timer: number | NodeJS.Timeout | undefined) => {
        if (timer != null) {
          typeof timer === 'number' ? window.clearTimeout(timer) : global.clearTimeout(timer);
        }

        scheduledTimer = undefined;
      };

      const iteration = () => {
        cleanUp(scheduledTimer);
        fn();
      };

      scheduledTimer = (window != null ? window : global).setTimeout(iteration, interval);

      return {
        cancel: () => cleanUp(scheduledTimer),
      };
    },
  };
};

/**
 * Delays the execution by interval ms
 * @private
 * @param  scheduler  Scheduler  Scheduler
 * @param  interval  number  Interval to wait for, in milliseconds
 * @return Promise
 * @throws Error
 */
const delay = (scheduler: Scheduler, interval: number) =>
  new Promise((resolve, reject) => {
    try {
      scheduler.schedule(resolve, interval);
    } catch (e) {
      reject(e);
    }
  });

/**
 * Default interval between attempts, in milliseconds
 * @private
 */
const DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS = 50;
/**
 * Default timeout, in milliseconds
 * @private
 */
const DEFAULT_TIMEOUT_IN_MS = 5000;
/**
 * Platform-specific scheduler
 * @private
 */
const scheduler: Scheduler = getScheduler();

/**
 * Waits for predicate to be truthy and resolves a Promise
 * @public
 * @param  predicate  WaitPredicate<T>  Predicate that checks the condition
 * @param  options  WaitOptions|number|undefined  Maximum wait interval, 5000ms by default
 * @param  intervalBetweenAttempts  number|undefined  Deprecated (use options property instead). Interval to wait for between attempts, optional, 50ms by default
 * @return  Promise<T>  A promise to return a callback result
 * @throws  TimeoutError|Error
 */
export const waitUntil = <T>(
  predicate: WaitPredicate<T>,
  options?: number | WaitOptions,
  intervalBetweenAttempts?: number,
): Promise<T> => {
  const timerTimeout = (typeof options === 'number' ? options : options?.timeout) ?? DEFAULT_TIMEOUT_IN_MS;
  const timerIntervalBetweenAttempts =
    (typeof options === 'number' ? intervalBetweenAttempts : options?.intervalBetweenAttempts) ??
    DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS;

  const runPredicate = (): Promise<ReturnType<WaitPredicate<T>>> =>
    new Promise((resolve, reject) => {
      try {
        resolve(predicate());
      } catch (e) {
        reject(e);
      }
    });

  const predicatePromise = (): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const iteration = () => {
        runPredicate()
          .then((result) => {
            if (result) {
              resolve(result);
              return;
            }

            delay(scheduler, timerIntervalBetweenAttempts).then(iteration).catch(reject);
          })
          .catch(reject);
      };

      iteration();
    });

  const timeoutPromise = () =>
    delay(scheduler, timerTimeout).then(() => {
      throw new TimeoutError(timerTimeout);
    });

  return Promise.race([predicatePromise(), timeoutPromise()]);
};

/**
 * The predicate callback type
 */
type WaitPredicate<T> = () => T | Promise<T> | null | undefined | false | '' | 0 | void;
/**
 * Options for the wait algorithm
 */
export type WaitOptions = {
  /**
   * @property  timeout  WaitOptions|number|undefined  Maximum wait interval, 5000ms by default
   */
  timeout?: number;
  /**
   * @property  intervalBetweenAttempts  number|undefined  Interval to wait for between attempts, optional, 50ms by default
   */
  intervalBetweenAttempts?: number;
};
/**
 * Scheduler types
 */
type ScheduleFn = <T>(fn: (...args: T[]) => void, interval: number) => CancelScheduledFn;
type CancelScheduledFn = {
  cancel: () => void;
};
type Scheduler = {
  schedule: ScheduleFn;
};

export default waitUntil;
