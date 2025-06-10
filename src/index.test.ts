import { describe, expect, Matchers, test } from 'bun:test';
import { numericQuantity } from './numericQuantity';
import { numericQuantityTests } from './numericQuantityTests';

for (const [title, tests] of Object.entries(numericQuantityTests)) {
  describe(title, () => {
    for (const [arg, expected, options] of tests) {
      test(`${
        ['string', 'object'].includes(typeof arg)
          ? JSON.stringify(arg)
          : `${arg}`.replace(/(?:\r?\n)/g, ' ')
      }${
        typeof options !== 'undefined'
          ? ` with option ${JSON.stringify(options)}`
          : ''
      } should evaluate to ${expected}`, () => {
        const expectation = expect(numericQuantity(arg, options));
        if (typeof expected === 'bigint') {
          (expectation as unknown as Matchers<bigint>).toBe(expected);
        } else if (isNaN(expected)) {
          expectation.toBeNaN();
        } else {
          expectation.toBe(expected);
        }
      });
    }
  });
}
