import { describe, expect, Matchers, test } from 'bun:test';
import { normalizeDigits } from './constants';
import { numericQuantity } from './numericQuantity';
import { numericQuantityTests } from './numericQuantityTests';

// Verify that decimalDigitBlockStarts covers every \p{Nd} codepoint.
// If a future Unicode version adds a new Nd block, this test will fail.
const ndRegex = /^\p{Nd}$/u;
describe('Unicode \\p{Nd} drift check', () => {
  test('normalizeDigits handles every \\p{Nd} codepoint', () => {
    for (let cp = 0x0660; cp <= 0x10ffff; cp++) {
      if (cp >= 0xd800 && cp <= 0xdfff) continue;
      const ch = String.fromCodePoint(cp);
      if (ndRegex.test(ch)) {
        expect(normalizeDigits(ch)).toMatch(/^[0-9]$/);
      }
    }
  });
});

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
