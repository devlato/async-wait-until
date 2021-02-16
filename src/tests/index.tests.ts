import { waitUntil, TimeoutError, DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS, WAIT_FOREVER } from '../';

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
      jest.setTimeout(10000);
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

    it('Rejects with a timeout error when timed out', async () => {
      expect.assertions(2);

      try {
        const initialTime = Date.now();
        await waitUntil(() => Date.now() - initialTime > 500, {
          timeout: 100,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.toString()).toEqual('Error: Timed out after waiting for 100 ms');
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
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.toString()).toEqual('Error: Timed out after waiting for 200 ms');
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
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.toString()).toEqual('Error: Timed out after waiting for 200 ms');
      }
    });

    it('Rejects when the predicate throws an error', async () => {
      expect.assertions(3);

      try {
        await waitUntil(() => {
          throw new TestError('Crap!');
        });
      } catch (e) {
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
      jest.setTimeout(10000);
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
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.toString()).toEqual('Error: Timed out after waiting for 100 ms');
      }
    });

    it('Rejects on timeout only once', async () => {
      expect.assertions(2);

      try {
        const initialTime = Date.now();
        await waitUntil(() => Date.now() - initialTime > 200, 200);
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.toString()).toEqual('Error: Timed out after waiting for 200 ms');
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
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.toString()).toEqual('Error: Timed out after waiting for 200 ms');
      }
    });

    it('Rejects when the predicate throws an error', async () => {
      expect.assertions(3);

      try {
        await waitUntil(() => {
          throw new TestError('Crap!');
        });
      } catch (e) {
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
