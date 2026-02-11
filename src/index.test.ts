import { describe, expect, Matchers, test } from 'bun:test';
import { normalizeDigits } from './constants';
import { isNumericQuantity } from './isNumericQuantity';
import { numericQuantity } from './numericQuantity';
import { numericQuantityTests } from './numericQuantityTests';
import type { NumericQuantityVerboseResult } from './types';

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

describe('isNumericQuantity', () => {
  test('returns true for valid numbers', () => {
    expect(isNumericQuantity('123')).toBe(true);
    expect(isNumericQuantity('1.5')).toBe(true);
    expect(isNumericQuantity('1/2')).toBe(true);
    expect(isNumericQuantity('1 1/2')).toBe(true);
    expect(isNumericQuantity('½')).toBe(true);
    expect(isNumericQuantity(42)).toBe(true);
  });

  test('returns false for invalid numbers', () => {
    expect(isNumericQuantity('NaN')).toBe(false);
    expect(isNumericQuantity('')).toBe(false);
    expect(isNumericQuantity('abc')).toBe(false);
    expect(isNumericQuantity('$100')).toBe(false);
  });

  test('respects options', () => {
    expect(isNumericQuantity('XII')).toBe(false);
    expect(isNumericQuantity('XII', { romanNumerals: true })).toBe(true);
    expect(isNumericQuantity('$100', { allowCurrency: true })).toBe(true);
    expect(isNumericQuantity('50%', { percentage: true })).toBe(true);
  });

  test('returns true for bigint values', () => {
    expect(
      isNumericQuantity('9007199254740992', { bigIntOnOverflow: true })
    ).toBe(true);
  });
});

describe('verbose output', () => {
  test('returns object with value and input', () => {
    const result = numericQuantity('123', { verbose: true });
    expect(result).toEqual({ value: 123, input: '123' });
  });

  test('includes currencyPrefix when currency stripped from start', () => {
    const result = numericQuantity('$100', {
      verbose: true,
      allowCurrency: true,
    }) as NumericQuantityVerboseResult;
    expect(result.value).toBe(100);
    expect(result.currencyPrefix).toBe('$');
  });

  test('includes currencySuffix when currency stripped from end', () => {
    const result = numericQuantity('100€', {
      verbose: true,
      allowCurrency: true,
    }) as NumericQuantityVerboseResult;
    expect(result.value).toBe(100);
    expect(result.currencySuffix).toBe('€');
  });

  test('includes percentageSuffix when % stripped', () => {
    const result = numericQuantity('50%', {
      verbose: true,
      percentage: 'decimal',
    }) as NumericQuantityVerboseResult;
    expect(result.value).toBe(0.5);
    expect(result.percentageSuffix).toBe(true);
  });

  test('includes trailingInvalid when trailing chars ignored', () => {
    const result = numericQuantity('100abc', {
      verbose: true,
      allowTrailingInvalid: true,
    }) as NumericQuantityVerboseResult;
    expect(result.value).toBe(100);
    expect(result.trailingInvalid).toBe('abc');
  });

  test('handles combined currency and percentage', () => {
    const result = numericQuantity('$50%', {
      verbose: true,
      allowCurrency: true,
      percentage: 'decimal',
    }) as NumericQuantityVerboseResult;
    expect(result.value).toBe(0.5);
    expect(result.currencyPrefix).toBe('$');
    expect(result.percentageSuffix).toBe(true);
  });

  test('returns NaN value for invalid input', () => {
    const result = numericQuantity('invalid', {
      verbose: true,
    }) as NumericQuantityVerboseResult;
    expect(result.value).toBeNaN();
    expect(result.input).toBe('invalid');
  });

  test('works with number input', () => {
    const result = numericQuantity(42, { verbose: true });
    expect(result).toEqual({ value: 42, input: '42' });
  });
});
