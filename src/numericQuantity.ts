import {
  defaultOptions,
  normalizeDigits,
  numericRegexWithTrailingInvalid,
  superSubDigitToAsciiMap,
  superSubDigitsRegex,
  vulgarFractionToAsciiMap,
  vulgarFractionsRegex,
} from './constants';
import { parseRomanNumerals } from './parseRomanNumerals';
import type {
  NumericQuantityOptions,
  NumericQuantityReturnType,
  NumericQuantityVerboseResult,
} from './types';

const spaceThenSlashRegex = /^\s*\//;
const currencyPrefixRegex = /^([-+]?)\s*(\p{Sc}+)\s*/u;
const currencySuffixRegex = /\s*(\p{Sc}+)\s*$/u;
const percentageSuffixRegex = /\s*%$/;

const maxSafeBigInt = BigInt(Number.MAX_SAFE_INTEGER);
const pow10 = (exp: number) => 10n ** BigInt(exp);

/**
 * Evaluates the parsed numeric components as an exact `bigint` rational (magnitude only,
 * sign is applied by the caller) and rounds the result half-up.
 *
 * Returns the rounded `bigint` only if its magnitude exceeds `Number.MAX_SAFE_INTEGER`;
 * otherwise returns `undefined`, meaning "no overflow, use the `number` path".
 *
 * @param group1 - Whole number or numerator (separators already stripped).
 * @param group2 - Decimal/exponent/fraction tail, if any.
 * @param divideBy100 - Whether a percentage suffix was stripped.
 */
const toRoundedBigInt = (
  group1: string,
  group2: string | undefined,
  divideBy100: boolean
): bigint | undefined => {
  let numerator: bigint;
  let denominator = 1n;

  if (!group2) {
    // Plain integer
    numerator = BigInt(group1);
  } else if (group2.startsWith('.') || group2.startsWith('e') || group2.startsWith('E')) {
    // Decimal and/or scientific notation
    const expIndex = group2.search(/[eE]/);
    const fractionDigits = (expIndex === -1 ? group2 : group2.slice(0, expIndex)).slice(1);
    numerator = BigInt(`${group1}${fractionDigits}`);
    if (fractionDigits) denominator = pow10(fractionDigits.length);
    if (expIndex !== -1) {
      const exponent = parseInt(group2.slice(expIndex + 1));
      if (exponent > 0) numerator *= pow10(exponent);
      else if (exponent < 0) denominator *= pow10(-exponent);
    }
  } else if (spaceThenSlashRegex.test(group2)) {
    // Pure fraction, e.g. "1/2"
    numerator = BigInt(group1);
    denominator = BigInt(group2.replace('/', '').trim());
  } else {
    // Mixed number, e.g. "1 2/3"
    const [n, d] = group2.split('/');
    denominator = BigInt(d.trim());
    numerator = BigInt(group1) * denominator + BigInt(n.trim());
  }

  if (divideBy100) denominator *= 100n;

  // Let the `number` path produce `Infinity` for zero denominators
  if (denominator === 0n) return undefined;

  // Round half-up (BigInt division truncates, i.e. floors for non-negative operands)
  const rounded = (2n * numerator + denominator) / (2n * denominator);

  return rounded > maxSafeBigInt ? rounded : undefined;
};

/**
 * Converts a string to a number, like an enhanced version of `parseFloat`.
 *
 * The string can include mixed numbers, vulgar fractions, or Roman numerals.
 * Input is expected to be a `string`, but will be coerced to `string` if necessary.
 *
 * @param quantity - The value to parse as a numeric quantity.
 * @param options - Optional settings to control parsing behavior.
 */
function numericQuantity(quantity: unknown): number;
function numericQuantity<T extends NumericQuantityOptions>(
  quantity: unknown,
  options: T
): NumericQuantityReturnType<T>;
function numericQuantity(quantity: unknown, options?: NumericQuantityOptions): number;
function numericQuantity(
  quantity: unknown,
  options: NumericQuantityOptions = defaultOptions
): number | bigint | NumericQuantityVerboseResult {
  const opts: Required<NumericQuantityOptions> = {
    ...defaultOptions,
    ...options,
  };

  // `String` (unlike a template literal) does not throw for `symbol` input
  const originalInput = typeof quantity === 'string' ? quantity : String(quantity);

  // Metadata for verbose output
  let currencyPrefix: string | undefined;
  let currencySuffix: string | undefined;
  let percentageSuffix: boolean | undefined;
  let trailingInvalid: string | undefined;
  let parsedSign: '-' | '+' | undefined;
  let parsedWhole: number | undefined;
  let parsedNumerator: number | undefined;
  let parsedDenominator: number | undefined;

  const buildVerboseResult = (value: number | bigint): NumericQuantityVerboseResult => {
    const result: NumericQuantityVerboseResult = {
      value,
      input: originalInput,
    };
    if (currencyPrefix) result.currencyPrefix = currencyPrefix;
    if (currencySuffix) result.currencySuffix = currencySuffix;
    if (percentageSuffix) result.percentageSuffix = percentageSuffix;
    if (trailingInvalid) result.trailingInvalid = trailingInvalid;
    if (parsedSign) result.sign = parsedSign;
    if (parsedWhole !== undefined) result.whole = parsedWhole;
    if (parsedNumerator !== undefined) result.numerator = parsedNumerator;
    if (parsedDenominator !== undefined) result.denominator = parsedDenominator;
    return result;
  };

  const returnValue = (value: number | bigint) =>
    opts.verbose ? buildVerboseResult(value) : value;

  /**
   * Divides by 100 if a percentage suffix was stripped. Exact scaling, no rounding:
   * `round` applies to the quantity as written, before this division.
   */
  const applyPercentage = (value: number) =>
    percentageSuffix && opts.percentage !== 'number' ? value / 100 : value;

  if (typeof quantity === 'symbol') {
    // `String(sym)` is e.g. `'Symbol(1)'`; never a valid quantity
    return returnValue(NaN);
  }

  if (typeof quantity === 'number' || typeof quantity === 'bigint') {
    return returnValue(quantity);
  }

  let finalResult = NaN;
  let workingString = originalInput;

  // Strip currency/percentage affixes until none match, so the two are order-independent.
  // At most one `%` is stripped per parse, so `'50%%'` remains invalid.
  let affixStripped = true;
  while (affixStripped) {
    affixStripped = false;

    if (opts.allowCurrency) {
      const prefixMatch = currencyPrefixRegex.exec(workingString);
      if (prefixMatch?.[2]) {
        currencyPrefix = (currencyPrefix ?? '') + prefixMatch[2];
        // Keep the sign if present, remove currency symbol
        workingString = (prefixMatch[1] || '') + workingString.slice(prefixMatch[0].length);
        affixStripped = true;
      }

      const suffixMatch = currencySuffixRegex.exec(workingString);
      if (suffixMatch) {
        currencySuffix = suffixMatch[1] + (currencySuffix ?? '');
        workingString = workingString.slice(0, -suffixMatch[0].length);
        affixStripped = true;
      }
    }

    if (!percentageSuffix && opts.percentage) {
      const pctMatch = percentageSuffixRegex.exec(workingString);
      if (pctMatch) {
        percentageSuffix = true;
        workingString = workingString.slice(0, -pctMatch[0].length);
        affixStripped = true;
      }
    }
  }

  // Coerce to string and normalize
  const quantityAsString = normalizeDigits(
    workingString
      // Convert vulgar fractions to ASCII, with a leading space
      // to keep the whole number and the fraction separate
      .replace(
        vulgarFractionsRegex,
        (_m, vf: keyof typeof vulgarFractionToAsciiMap) => ` ${vulgarFractionToAsciiMap[vf]}`
      )
      // Convert superscript/subscript digits to ASCII
      .replace(
        superSubDigitsRegex,
        ch => superSubDigitToAsciiMap[ch as keyof typeof superSubDigitToAsciiMap]
      )
      // Convert fraction slash to standard slash
      .replace('⁄', '/')
      .trim()
  );

  // Bail out if the string was only white space
  if (quantityAsString.length === 0) {
    return returnValue(NaN);
  }

  let normalizedString = quantityAsString;
  // Trailing invalid chars identified before the regex runs (comma-decimal path)
  let pendingTrailing: string | undefined;

  if (opts.decimalSeparator === ',') {
    const commaCount = (quantityAsString.match(/,/g) || []).length;
    if (commaCount === 1) {
      // Treat lone comma as decimal separator; remove all "." since they represent
      // thousands/whatever separators
      normalizedString = quantityAsString.replaceAll('.', '_').replace(',', '.');
    } else if (commaCount > 1) {
      // The second comma and everything after is "trailing invalid"
      if (!opts.allowTrailingInvalid) {
        // Bail out if trailing invalid is not allowed
        return returnValue(NaN);
      }

      const firstCommaIndex = quantityAsString.indexOf(',');
      const secondCommaIndex = quantityAsString.indexOf(',', firstCommaIndex + 1);
      const beforeSecondComma = quantityAsString
        .substring(0, secondCommaIndex)
        .replaceAll('.', '_')
        .replace(',', '.');
      const afterSecondComma = quantityAsString.substring(secondCommaIndex + 1);
      normalizedString = beforeSecondComma;
      pendingTrailing = afterSecondComma;
    } else {
      // No comma as decimal separator, so remove all "." since they represent
      // thousands/whatever separators
      normalizedString = quantityAsString.replaceAll('.', '_');
    }
  }

  const regexResult = numericRegexWithTrailingInvalid.exec(normalizedString);

  // If the Arabic numeral regex fails, try Roman numerals
  if (!regexResult) {
    if (!opts.romanNumerals) return returnValue(NaN);
    return returnValue(applyPercentage(parseRomanNumerals(quantityAsString)));
  }

  // Capture trailing invalid characters: group 7 catches chars starting with
  // [^.\d/], but the regex (which lacks a $ anchor) may also leave unconsumed
  // input starting with ".", "/", or digits (e.g. "0.1.2" or "1/").
  const rawTrailing = (
    regexResult[7] ||
    normalizedString.slice(regexResult[0].length) ||
    pendingTrailing ||
    ''
  ).trim();
  if (rawTrailing) {
    trailingInvalid = rawTrailing;
    if (!opts.allowTrailingInvalid) {
      return returnValue(NaN);
    }
  }

  const [, sign, ng1temp, ng2temp] = regexResult;
  if (sign === '-' || sign === '+') parsedSign = sign;
  const numberGroup1 = ng1temp.replaceAll(',', '').replaceAll('_', '');
  const numberGroup2 = ng2temp?.replaceAll(',', '').replaceAll('_', '');

  // Numerify capture group 1
  if (!numberGroup1 && numberGroup2 && numberGroup2.startsWith('.')) {
    finalResult = 0;
  } else {
    if (opts.bigIntOnOverflow) {
      const asBigInt = toRoundedBigInt(
        numberGroup1,
        numberGroup2,
        !!percentageSuffix && opts.percentage !== 'number'
      );
      if (asBigInt !== undefined) {
        return returnValue(sign === '-' ? -asBigInt : asBigInt);
      }
    }

    finalResult = parseInt(numberGroup1);
  }

  // If capture group 2 is null, then we're dealing with an integer
  // and there is nothing left to process
  if (!numberGroup2) {
    finalResult = sign === '-' ? finalResult * -1 : finalResult;
    return returnValue(applyPercentage(finalResult));
  }

  // Non-finite `round` values are treated as `false` (no rounding);
  // negative values clamp to 0 (round to whole number)
  const roundTo =
    typeof opts.round === 'number' && Number.isFinite(opts.round)
      ? Math.floor(Math.max(0, opts.round))
      : false;
  const roundingFactor = roundTo === false ? NaN : parseFloat(`1e${roundTo}`);

  if (
    numberGroup2.startsWith('.') ||
    numberGroup2.startsWith('e') ||
    numberGroup2.startsWith('E')
  ) {
    // If first char of `numberGroup2` is "." or "e"/"E", it's a decimal
    const decimalValue = parseFloat(`${finalResult}${numberGroup2}`);
    finalResult = isNaN(roundingFactor)
      ? decimalValue
      : Math.round(decimalValue * roundingFactor) / roundingFactor;
  } else if (spaceThenSlashRegex.test(numberGroup2)) {
    // If the first non-space char is "/" it's a pure fraction (e.g. "1/2")
    const numerator = parseInt(numberGroup1);
    const denominator = parseInt(numberGroup2.replace('/', ''));
    parsedNumerator = numerator;
    parsedDenominator = denominator;
    finalResult = isNaN(roundingFactor)
      ? numerator / denominator
      : Math.round((numerator * roundingFactor) / denominator) / roundingFactor;
  } else {
    // Otherwise it's a mixed fraction (e.g. "1 2/3")
    const fractionArray = numberGroup2.split('/');
    const [numerator, denominator] = fractionArray.map(v => parseInt(v));
    parsedWhole = finalResult;
    parsedNumerator = numerator;
    parsedDenominator = denominator;
    finalResult += isNaN(roundingFactor)
      ? numerator / denominator
      : Math.round((numerator * roundingFactor) / denominator) / roundingFactor;
  }

  finalResult = sign === '-' ? finalResult * -1 : finalResult;

  return returnValue(applyPercentage(finalResult));
}

export { numericQuantity };
