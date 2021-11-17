import { createTests } from 'utils/create_tests';
import { waitUntil, TimeoutError, DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS, WAIT_FOREVER } from '../dist';

jest.setTimeout(30_000);

createTests({
  waitUntil,
  TimeoutError,
  WAIT_FOREVER,
  DEFAULT_INTERVAL_BETWEEN_ATTEMPTS_IN_MS,
});
