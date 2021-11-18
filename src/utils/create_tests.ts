import { Options, Predicate, PredicateReturnValue } from '../index';

const sleep = <T>(delayInMs: number): Promise<T> =>
  new Promise<T>((resolve) => {
    setTimeout(resolve, delayInMs);
  });

const DEFAULT_TEST_TIMEOUT = 10_000;

export const createTests = ({
  waitUntil,
  TimeoutError,
  WAIT_FOREVER,
  DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS,
  TEST_TIMEOUT = DEFAULT_TEST_TIMEOUT,
}: {
  /* eslint-disable no-unused-vars */
  waitUntil: <T extends PredicateReturnValue>(
    predicate: Predicate<T>,
    options?: number | Options,
    intervalBetweenAttempts?: number,
  ) => Promise<T>;
  TimeoutError: {
    new (timeoutInMs: number): Error;
  };
  WAIT_FOREVER: number;
  DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS: number;
  TEST_TIMEOUT?: number;
  /* eslint-enable no-unused-vars */
}) => {
  jest.setTimeout(TEST_TIMEOUT);

  describe('waitUntil', () => {
    describe('> New behaviour', () => {
      it('Calls the predicate and resolves with a truthy result', async () => {
        expect.assertions(1);

        const initialTime = Date.now();
        const result = await waitUntil(() => Date.now() - initialTime > 200);

        expect(result).toEqual(true);
      });

      it('Calls the predicate and resolves with a non-boolean truthy result', async () => {
        expect.assertions(1);

        const initialTime = Date.now();
        const result = await waitUntil(() => (Date.now() - initialTime > 200 ? { a: 10, b: 20 } : false));

        expect(result).toEqual({ a: 10, b: 20 });
      });

      it('Supports a custom retry interval', async () => {
        expect.assertions(3);

        const initialTime = Date.now();
        const predicate = jest.fn(() => (Date.now() - initialTime > 1000 ? { a: 10, b: 20 } : false));
        expect(predicate).not.toHaveBeenCalled();
        const result = await waitUntil(predicate, {
          timeout: 1500,
          intervalBetweenAttempts: 500,
        });

        expect(predicate.mock.calls.length < Math.floor(1500 / DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS) - 1).toBe(true);
        expect(result).toEqual({ a: 10, b: 20 });
      });

      it('Supports waiting forever', async () => {
        expect.assertions(3);

        const initialTime = Date.now();
        const predicate = jest.fn(() => (Date.now() - initialTime > 7000 ? { a: 10, b: 20 } : false));
        expect(predicate).not.toHaveBeenCalled();
        const result = await waitUntil(predicate, {
          timeout: WAIT_FOREVER,
        });

        expect(predicate).toHaveBeenCalled();
        expect(result).toEqual({ a: 10, b: 20 });
      });

      it('Stops executing the predicate after timing out', async () => {
        expect.assertions(5);

        const initialTime = Date.now();
        const predicate = jest.fn(() => Date.now() - initialTime > 200);
        expect(predicate).not.toHaveBeenCalled();
        try {
          await waitUntil(predicate, { timeout: 200 });
        } catch (e) {
          expect(predicate).toHaveBeenCalled();
          const callNumber = predicate.mock.calls.length;
          assertIsTimeoutError(e, 200);
          await sleep(400);
          expect(predicate).toHaveBeenCalledTimes(callNumber);
        }
      });

      it('Rejects with a timeout error when timed out', async () => {
        expect.assertions(2);

        try {
          const initialTime = Date.now();
          await waitUntil(() => Date.now() - initialTime > 500, {
            timeout: 100,
          });
        } catch (e) {
          assertIsTimeoutError(e, 100);
        }
      });

      it('Rejects on timeout only once', async () => {
        expect.assertions(2);

        try {
          const initialTime = Date.now();
          await waitUntil(() => Date.now() - initialTime > 200, {
            timeout: 200,
          });
        } catch (e) {
          assertIsTimeoutError(e, 200);
        }
      });

      it('Rejects on timeout once when the predicate throws an error', async () => {
        expect.assertions(2);

        try {
          const initialTime = Date.now();
          await waitUntil(
            () => {
              if (Date.now() - initialTime >= 190) {
                throw new TestError('Nooo!');
              }
            },
            {
              timeout: 200,
            },
          );
        } catch (e) {
          assertIsTimeoutError(e, 200);
        }
      });

      it('Rejects when the predicate throws an error', async () => {
        expect.assertions(3);

        try {
          await waitUntil(() => {
            throw new TestError('Crap!');
          });
        } catch (e) {
          assertIsError(e, 'Expected e to be an Error');
          expect(e).toBeInstanceOf(TestError);
          expect(e).not.toBeInstanceOf(TimeoutError);
          expect(e.toString()).toEqual('Error: Crap!');
        }
      });
    });

    describe('> Classic behaviour', () => {
      it('Calls the predicate and resolves with a truthy result', async () => {
        expect.assertions(1);

        const initialTime = Date.now();
        const result = await waitUntil(() => Date.now() - initialTime > 200);

        expect(result).toEqual(true);
      });

      it('Calls the predicate and resolves with a non-boolean truthy result', async () => {
        expect.assertions(1);

        const initialTime = Date.now();
        const result = await waitUntil(() => (Date.now() - initialTime > 200 ? { a: 10, b: 20 } : false));

        expect(result).toEqual({ a: 10, b: 20 });
      });

      it('Supports a custom retry interval', async () => {
        expect.assertions(3);

        const initialTime = Date.now();
        const predicate = jest.fn(() => (Date.now() - initialTime > 1000 ? { a: 10, b: 20 } : false));
        expect(predicate).not.toHaveBeenCalled();
        const result = await waitUntil(predicate, 1500, 500);

        expect(predicate.mock.calls.length < Math.floor(1500 / DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS) - 1).toBe(true);
        expect(result).toEqual({ a: 10, b: 20 });
      });

      it('Supports waiting forever', async () => {
        expect.assertions(3);

        const initialTime = Date.now();
        const predicate = jest.fn(() => (Date.now() - initialTime > 7000 ? { a: 10, b: 20 } : false));
        expect(predicate).not.toHaveBeenCalled();
        const result = await waitUntil(predicate, WAIT_FOREVER);

        expect(predicate).toHaveBeenCalled();
        expect(result).toEqual({ a: 10, b: 20 });
      });

      it('Rejects with a timeout error when timed out', async () => {
        expect.assertions(2);

        try {
          const initialTime = Date.now();
          await waitUntil(() => Date.now() - initialTime > 500, 100);
        } catch (e) {
          assertIsTimeoutError(e, 100);
        }
      });

      it('Rejects on timeout only once', async () => {
        expect.assertions(2);

        try {
          const initialTime = Date.now();
          await waitUntil(() => Date.now() - initialTime > 200, 200);
        } catch (e) {
          assertIsTimeoutError(e, 200);
        }
      });

      it('Stops executing the predicate after timing out', async () => {
        expect.assertions(5);

        const initialTime = Date.now();
        const predicate = jest.fn(() => Date.now() - initialTime > 200);
        expect(predicate).not.toHaveBeenCalled();
        try {
          await waitUntil(predicate, 200);
        } catch (e) {
          expect(predicate).toHaveBeenCalled();
          const callNumber = predicate.mock.calls.length;
          assertIsTimeoutError(e, 200);
          await sleep(400);
          expect(predicate).toHaveBeenCalledTimes(callNumber);
        }
      });

      it('Rejects on timeout once when the predicate throws an error', async () => {
        expect.assertions(2);

        try {
          const initialTime = Date.now();
          await waitUntil(() => {
            if (Date.now() - initialTime >= 190) {
              throw new TestError('Nooo!');
            }
          }, 200);
        } catch (e) {
          assertIsTimeoutError(e, 200);
        }
      });

      it('Rejects when the predicate throws an error', async () => {
        expect.assertions(3);

        try {
          await waitUntil(() => {
            throw new TestError('Crap!');
          });
        } catch (e) {
          assertIsError(e, 'Expected e to be an Error');
          expect(e).toBeInstanceOf(TestError);
          expect(e).not.toBeInstanceOf(TimeoutError);
          expect(e.toString()).toEqual('Error: Crap!');
        }
      });
    });
  });

  class TestError extends Error {
    constructor(message: string) {
      super(message);

      Object.setPrototypeOf(this, TestError.prototype);
    }
  }

  // eslint-disable-next-line no-unused-vars
  const assertIsError: (e: unknown, message: string) => asserts e is Error = (e, message) => {
    if (!(e instanceof Error)) {
      throw new Error(message);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const assertIsTimeoutError: (e: unknown, timeoutInMs: number) => asserts e is typeof TimeoutError = (
    e,
    timeoutInMs,
  ) => {
    assertIsError(e, 'Expected e to be an Error');
    expect(e).toBeInstanceOf(TimeoutError);
    expect(e.toString()).toEqual(`Error: Timed out after waiting for ${timeoutInMs} ms`);
  };
};
